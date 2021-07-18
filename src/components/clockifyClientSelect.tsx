import { ClockifyClient } from 'gigbook/clockify/client';
import ClockifyEntitySelect from 'gigbook/components/clockifyEntitySelect';
import useClockifyClients from 'gigbook/hooks/useClockifyClients';

export interface ClockifyClientSelectProps {
  size?: 'sm' | 'lg';
  workspaceId?: string;
  value?: ClockifyClient;
  onChange?: (value?: ClockifyClient) => void;
}

export default function ClockifyClientSelect(
  props: ClockifyClientSelectProps,
): JSX.Element {
  const clients = useClockifyClients(props.workspaceId);

  return (
    <ClockifyEntitySelect
      size={props.size}
      entities={clients}
      value={props.value}
      onChange={props.onChange}
    />
  );
}
