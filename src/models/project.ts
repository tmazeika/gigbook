export interface UnsavedProject {
  clientId: number;
  name: string;
}

export interface Project extends UnsavedProject {
  id: number;
}

export function isValidUnsavedProject(v: unknown): v is UnsavedProject {
  return isUnsavedProject(v) && isValid(v);
}

function isUnsavedProject(v: unknown): v is UnsavedProject {
  return typeof (v as UnsavedProject)?.name === 'string';
}

function isValid({ name }: UnsavedProject): boolean {
  return 1 <= name.length && name.length <= 255;
}
