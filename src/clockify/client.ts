import { buildUrl } from 'gigbook/util/url';

export class ClockifyError extends Error {
  public readonly status: number;

  constructor(resource: string, status: number, statusText: string) {
    super(`Request to ${resource} failed: ${status} ${statusText}`);
    Object.setPrototypeOf(this, ClockifyError.prototype);
    this.status = status;
  }
}

export function isClockifyError(e: unknown): e is ClockifyError {
  return e instanceof ClockifyError;
}

export interface User {
  id: string;
  name: string;
}

export interface Workspace {
  id: string;
  name: string;
}

export default class Clockify {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getUser(): Promise<User> {
    const { id, name } = (await this.get('user')) as User;
    return {
      id: id,
      name: name,
    };
  }

  async getWorkspaces(): Promise<Workspace[]> {
    const workspaces = (await this.get('workspaces')) as Workspace[];
    return workspaces.map((w) => ({
      id: w.id,
      name: w.name,
    }));
  }

  private async get(
    resource: string,
    query?: Record<string, unknown>,
  ): Promise<unknown> {
    const url = buildUrl(
      'https://api.clockify.me',
      `/api/v1/${resource}`,
      query,
    );
    const res = await fetch(url, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
    if (!res.ok) {
      throw new ClockifyError(resource, res.status, res.statusText);
    }
    return res.json();
  }
}
