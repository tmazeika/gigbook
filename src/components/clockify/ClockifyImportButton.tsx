import LoadingButton from 'gigbook/components/forms/LoadingButton';
import useClockifyApiClient from 'gigbook/hooks/useClockifyApiClient';
import useSignal from 'gigbook/hooks/useSignal';
import { InvoiceLineItem } from 'gigbook/models/invoice';
import { DateTime } from 'luxon';
import { useState } from 'react';

interface Props {
  size?: 'sm' | 'lg';
  startDate: DateTime;
  endDate: DateTime;
  workspaceId?: string;
  clientId?: string;
  lineItems?: InvoiceLineItem[];

  onChange?(lineItems?: InvoiceLineItem[]): void;
}

export default function ClockifyImportButton(props: Props): JSX.Element {
  const signal = useSignal();
  const clockify = useClockifyApiClient();
  const [loading, setLoading] = useState(false);
  const disabled = !clockify || !props.workspaceId || !props.clientId;

  const onClick = async () => {
    if (!clockify || !props.workspaceId || !props.clientId) {
      return;
    }
    setLoading(true);
    const invoice = await clockify.getInvoice(
      props.workspaceId,
      props.clientId,
      props.startDate,
      props.endDate,
      signal,
    );
    const lineItems = invoice.clients[props.clientId]?.lineItems?.map(
      (li): InvoiceLineItem => ({
        id: li.id,
        project: li.project.name,
        task: li.task,
        rate: li.rate,
        duration: li.duration,
      }),
    );
    props.onChange?.(lineItems);
    setLoading(false);
  };

  return (
    <LoadingButton
      variant="outline-primary"
      langVariant="import"
      size={props.size}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
    />
  );
}
