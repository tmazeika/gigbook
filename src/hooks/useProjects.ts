import useEntities, { EntitiesHook } from 'gigbook/hooks/useEntities';
import { Project } from 'gigbook/models/project';

export default function useProjects(
  clientId?: number,
): Readonly<EntitiesHook<Project>> {
  return useEntities(
    clientId !== undefined ? `/api/clients/${clientId}/projects` : null,
  );
}
