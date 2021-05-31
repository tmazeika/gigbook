export interface Client {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email?: string;
  verified: boolean;
}
