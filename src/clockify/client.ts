import Fraction from 'fraction.js';
import { buildUrl } from 'gigbook/util/url';
import { DateTime, Duration } from 'luxon';

export class ClockifyError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(url: string, status: number, statusText: string) {
    super(`Request to ${url} failed: ${status} ${statusText}`);
    Object.setPrototypeOf(this, ClockifyError.prototype);
    this.status = status;
    this.statusText = statusText;
  }
}

export function isClockifyError(e: unknown): e is ClockifyError {
  return e instanceof ClockifyError;
}

interface ClockifyAPIUser {
  id: string;
  name: string;
  settings: {
    timeZone: string;
  };
}

interface ClockifyAPIReport {
  timeentries: {
    _id: string;
    clientId: string;
    clientName: string;
    projectId: string;
    projectName: string;
    description: string;
    timeInterval: {
      start: string;
      end: string;
    };
    rate: number;
  }[];
}

export interface ClockifyUser {
  id: string;
  name: string;
  timeZone: string;
}

export interface ClockifyWorkspace {
  id: string;
  name: string;
}

export interface ClockifyClient {
  id: string;
  workspaceId: string;
  name: string;
}

export interface ClockifyInvoice {
  period: {
    start: DateTime;
    end: DateTime;
  };
  clients: {
    [id: string]: {
      name: string;
      lineItems: {
        id: string;
        project: {
          id: string;
          name: string;
        };
        task: string;
        rate: Fraction;
        duration: Duration;
      }[];
    };
  };
}

export default class ClockifyApiClient {
  static readonly apiKeyRegExp: RegExp = /^[a-z0-9]{48}$/i;

  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? '';
  }

  async isValid(signal?: AbortSignal): Promise<boolean> {
    if (!ClockifyApiClient.apiKeyRegExp.test(this.apiKey)) {
      return false;
    }
    try {
      await this.get('user', {}, signal);
      return true;
    } catch (err) {
      if (isClockifyError(err) && err.status === 401) {
        return false;
      }
      throw err;
    }
  }

  async getUser(signal?: AbortSignal): Promise<ClockifyUser> {
    const user = (await this.get('user', {}, signal)) as ClockifyAPIUser;
    return {
      id: user.id,
      name: user.name,
      timeZone: user.settings.timeZone,
    };
  }

  async getWorkspaces(signal?: AbortSignal): Promise<ClockifyWorkspace[]> {
    const workspaces = (await this.get(
      'workspaces',
      {},
      signal,
    )) as ClockifyWorkspace[];
    return workspaces.map((w) => ({
      id: w.id,
      name: w.name,
    }));
  }

  async getClients(
    workspaceId: string,
    signal?: AbortSignal,
  ): Promise<ClockifyClient[]> {
    workspaceId = encodeURIComponent(workspaceId);
    const clients = (await this.get(
      `workspaces/${workspaceId}/clients`,
      {
        archived: false,
        'sort-column': 'name',
        'sort-order': 'ascending',
      },
      signal,
    )) as ClockifyClient[];
    return clients.map((c) => ({
      id: c.id,
      workspaceId: c.workspaceId,
      name: c.name,
    }));
  }

  async getInvoice(
    workspaceId: string,
    clientId: string,
    from: DateTime,
    to: DateTime,
    signal?: AbortSignal,
  ): Promise<ClockifyInvoice> {
    console.assert(from.zone.equals(to.zone));
    workspaceId = encodeURIComponent(workspaceId);
    const report = (await this.getReport(
      `workspaces/${workspaceId}/reports/detailed`,
      {
        exportType: 'JSON',
        dateRangeStart: from.startOf('day').toISO({ includeOffset: false }),
        dateRangeEnd: to.endOf('day').toISO({ includeOffset: false }),
        timeZone: from.zone.name,
        amountShown: 'EARNED',
        billable: true,
        detailedFilter: {
          // TODO: handle pagination
          page: 1,
          pageSize: 200,
          options: {
            totals: 'EXCLUDE',
          },
        },
        clients: {
          ids: [clientId],
          contains: 'CONTAINS',
          status: 'ALL',
        },
      },
      signal,
    )) as ClockifyAPIReport;
    const invoice: ClockifyInvoice = {
      period: {
        start: from,
        end: to,
      },
      clients: {},
    };
    report.timeentries.forEach((timeEntry) => {
      const duration = DateTime.fromISO(timeEntry.timeInterval.end).diff(
        DateTime.fromISO(timeEntry.timeInterval.start),
      );
      const client = (invoice.clients[timeEntry.clientId] ??= {
        name: timeEntry.clientName,
        lineItems: [],
      });
      const rate = new Fraction(timeEntry.rate).div(100);
      const lineItem = client.lineItems.find(
        (i) =>
          i.project.id === timeEntry.projectId &&
          i.task === timeEntry.description &&
          i.rate.equals(rate),
      );
      if (lineItem) {
        lineItem.duration = lineItem.duration.plus(duration);
      } else {
        client.lineItems.push({
          id: timeEntry._id,
          project: {
            id: timeEntry.projectId,
            name: timeEntry.projectName,
          },
          task: timeEntry.description,
          rate,
          duration,
        });
      }
    });
    return invoice;
  }

  private async getReport(
    resource: string,
    body: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<unknown> {
    return this.request(
      'POST',
      buildUrl(`https://reports.api.clockify.me/v1/${resource}`),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal,
      },
    );
  }

  private async get(
    resource: string,
    query: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<unknown> {
    return this.request(
      'GET',
      buildUrl(`https://api.clockify.me/api/v1/${resource}`, query),
      { signal },
    );
  }

  private async request(
    method: string,
    url: string,
    init?: RequestInit,
  ): Promise<unknown> {
    const res = await fetch(url, {
      ...init,
      method,
      headers: {
        ...init?.headers,
        'X-Api-Key': this.apiKey,
      },
    });
    if (!res.ok) {
      throw new ClockifyError(url, res.status, res.statusText);
    }
    return res.json();
  }
}
