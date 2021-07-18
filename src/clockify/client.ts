import Fraction from 'fraction.js';
import { buildUrl } from 'gigbook/util/url';
import { DateTime, Duration } from 'luxon';

export class ClockifyError extends Error {
  public readonly status: number;
  public readonly statusText: string;

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

export interface ClockifyAPIUser {
  id: string;
  name: string;
  settings: {
    timeZone: string;
  };
}

export interface ClockifyAPIReport {
  timeentries: {
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
        project: {
          id: string;
          name: string;
        };
        task: string;
        rate: Fraction;
        quantity: Duration;
      }[];
    };
  };
}

export default class Clockify {
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? '';
  }

  async isValid(): Promise<boolean> {
    if (!/^[a-z0-9]{48}$/i.test(this.apiKey)) {
      return false;
    }
    try {
      await this.get('user');
      return true;
    } catch (e) {
      if (isClockifyError(e) && e.status === 401) {
        return false;
      }
      throw e;
    }
  }

  async getUser(): Promise<ClockifyUser> {
    const user = (await this.get('user')) as ClockifyAPIUser;
    return {
      id: user.id,
      name: user.name,
      timeZone: user.settings.timeZone,
    };
  }

  async getWorkspaces(): Promise<ClockifyWorkspace[]> {
    const workspaces = (await this.get('workspaces')) as ClockifyWorkspace[];
    return workspaces.map((w) => ({
      id: w.id,
      name: w.name,
    }));
  }

  async getClients(workspaceId: string): Promise<ClockifyClient[]> {
    workspaceId = encodeURIComponent(workspaceId);
    const clients = (await this.get(`workspaces/${workspaceId}/clients`, {
      archived: false,
      'sort-column': 'name',
      'sort-order': 'ascending',
    })) as ClockifyClient[];
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
  ): Promise<ClockifyInvoice> {
    console.assert(from.zone.equals(to.zone));
    workspaceId = encodeURIComponent(workspaceId);
    const report = (await this.getReport(
      `workspaces/${workspaceId}/reports/detailed`,
      {
        exportType: 'JSON',
        dateRangeStart: from.toISO({ includeOffset: false }),
        dateRangeEnd: to.toISO({ includeOffset: false }),
        timeZone: from.zone.name,
        amountShown: 'EARNED',
        billable: true,
        detailedFilter: {
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
        lineItem.quantity = lineItem.quantity.plus(duration);
      } else {
        client.lineItems.push({
          project: {
            id: timeEntry.projectId,
            name: timeEntry.projectName,
          },
          task: timeEntry.description,
          rate,
          quantity: duration,
        });
      }
    });
    return invoice;
  }

  private async getReport(
    resource: string,
    body: Record<string, unknown>,
  ): Promise<unknown> {
    return this.request(
      'POST',
      buildUrl('https://reports.api.clockify.me', `/v1/${resource}`),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
  }

  private async get(
    resource: string,
    query?: Record<string, unknown>,
  ): Promise<unknown> {
    return this.request(
      'GET',
      buildUrl('https://api.clockify.me', `/api/v1/${resource}`, query),
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
