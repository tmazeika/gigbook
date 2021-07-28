import useClockify from 'gigbook/hooks/useClockify';
import { InvoiceLineItem } from 'gigbook/models/invoice';
import { DateTime } from 'luxon';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export interface ClockifyImportButtonProps {
  size?: 'sm' | 'lg';
  startDate: DateTime;
  endDate: DateTime;
  workspaceId?: string;
  clientId?: string;
  lineItems?: InvoiceLineItem[];
  onChange?: (lineItems?: InvoiceLineItem[]) => void;
}

export default function ClockifyImportButton(
  props: ClockifyImportButtonProps,
): JSX.Element {
  const clockify = useClockify();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        variant="outline-primary"
        size={props.size}
        disabled={!clockify || !props.workspaceId || !props.clientId || loading}
        onClick={async () => {
          if (!clockify || !props.workspaceId || !props.clientId) {
            return;
          }
          setLoading(true);
          const invoice = await clockify.getInvoice(
            props.workspaceId,
            props.clientId,
            props.startDate,
            props.endDate,
          );
          const lineItems = invoice.clients[props.clientId]?.lineItems?.map(
            (li): InvoiceLineItem => ({
              project: li.project.name,
              task: li.task,
              rate: li.rate,
              duration: li.duration,
            }),
          );
          props.onChange?.(lineItems);
          setLoading(false);
        }}
      >
        {loading ? (
          <>
            <Spinner as="span" className="me-1" size="sm" animation="border" />
            {' Importing...'}
          </>
        ) : (
          'Import'
        )}
      </Button>
    </>
  );
}
