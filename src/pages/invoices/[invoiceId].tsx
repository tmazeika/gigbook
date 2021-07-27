import cn from 'classnames';
import LineItems from 'gigbook/components/lineItems';
import useExchangeRate from 'gigbook/hooks/useExchangeRate';
import { BodyInvoice, fromBody } from 'gigbook/models/invoice';
import { Duration } from 'luxon';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';
import styles from './invoice.module.css';

export default function Invoice(): JSX.Element {
  const router = useRouter();
  const { invoiceId } = router.query;
  const { data: bodyInvoice } = useSWR<BodyInvoice>(
    typeof invoiceId === 'string'
      ? `/api/invoices/${encodeURIComponent(invoiceId)}`
      : null,
  );
  const invoice = fromBody(bodyInvoice);
  const dueDate = invoice?.date.plus(
    Duration.fromObject({ days: invoice.billing.netTerms }),
  );
  const exchangeRate = useExchangeRate(
    invoice?.billing.currency,
    invoice?.client.currency,
  );

  return !invoice || !dueDate ? (
    <p>Loading...</p>
  ) : (
    <div className={styles.Page}>
      <Head>
        <title>Invoice {invoice.reference}</title>
      </Head>
      <div className={styles.FromSection}>
        <h1>INVOICE</h1>
        <div>
          <strong>{invoice.payee.name}</strong>
          {invoice.payee.address.split('\n').map((line, i) => (
            <p
              key={i}
              className={cn(styles.AddressLine, {
                [styles.Em]: isEmMarkdown(line),
                [styles.Strong]: isStrongMarkdown(line),
              })}
            >
              {processLineMarkdown(line)}
            </p>
          ))}
        </div>
      </div>
      <div className={styles.ToSection}>
        <div className={styles.ToSectionClient}>
          <strong className={styles.ToSectionClientTitle}>Bill To</strong>
          <div>
            <p className={styles.AddressLine}>{invoice.client.name}</p>
            {invoice.client.address.split('\n').map((line, i) => (
              <p
                key={i}
                className={cn(styles.AddressLine, {
                  [styles.Em]: isEmMarkdown(line),
                  [styles.Strong]: isStrongMarkdown(line),
                })}
              >
                {processLineMarkdown(line)}
              </p>
            ))}
          </div>
        </div>
        <div>
          <table className={styles.Table}>
            <tbody>
              <tr>
                <td>Invoice #</td>
                <td>{invoice.reference}</td>
              </tr>
              <tr>
                <td>Invoice Date</td>
                <td>{invoice.date.toLocaleString({ dateStyle: 'medium' })}</td>
              </tr>
              <tr>
                <td>Due</td>
                <td>{dueDate.toLocaleString({ dateStyle: 'medium' })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.LineItemsContainer}>
        <h3 className={styles.PayeeDescription}>{invoice.payee.description}</h3>
        <table className={styles.LineItems}>
          <thead>
            <th>Project</th>
            <th>Task</th>
            <th align="right">Rate</th>
            <th align="right">Hours</th>
            <th align="right">Total</th>
          </thead>
          <tbody>
            <LineItems
              lineItems={invoice.lineItems}
              currency={invoice.billing.currency}
              increment={invoice.billing.increment}
              rowFactory={(project, task, rate, hours, total, i) => (
                <tr key={i}>
                  <td>{project}</td>
                  <td>{task}</td>
                  <td align="right">{rate}</td>
                  <td align="right">{hours}</td>
                  <td align="right">{total}</td>
                </tr>
              )}
            >
              {(rows, total) => (
                <>
                  {rows}
                  <tr className={styles.LineItemsTotalRow}>
                    <td colSpan={5} align="right">
                      <span className={styles.BalanceDue}>Balance Due</span>
                      <span className={styles.LineItemsTotal}>{total}</span>
                    </td>
                  </tr>
                </>
              )}
            </LineItems>
          </tbody>
        </table>
      </div>
      <div className={styles.BankDetails}>
        {new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: invoice.client.currency,
        }).format(100)}
      </div>
    </div>
  );
}

function processLineMarkdown(line: string): string {
  let trimN: number;
  if (isEmMarkdown(line)) {
    trimN = 1;
  } else if (isStrongMarkdown(line)) {
    trimN = 2;
  } else {
    return line;
  }
  return line.substring(trimN, line.length - trimN);
}

function isEmMarkdown(line: string): boolean {
  return line.startsWith('_') && line.endsWith('_');
}

function isStrongMarkdown(line: string): boolean {
  return line.startsWith('**') && line.endsWith('**');
}
