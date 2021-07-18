import { ClockifyWorkspace } from 'gigbook/clockify/client';
import ClockifyEntitySelect from 'gigbook/components/clockifyEntitySelect';
import useClockifyWorkspaces from 'gigbook/hooks/useClockifyWorkspaces';

export interface ClockifyWorkspaceSelectProps {
  size?: 'sm' | 'lg';
  value?: ClockifyWorkspace;
  onChange?: (value?: ClockifyWorkspace) => void;
}

export default function ClockifyWorkspaceSelect(
  props: ClockifyWorkspaceSelectProps,
): JSX.Element {
  const workspaces = useClockifyWorkspaces();

  return (
    <ClockifyEntitySelect
      size={props.size}
      entities={workspaces}
      value={props.value}
      onChange={props.onChange}
    />
  );
}
