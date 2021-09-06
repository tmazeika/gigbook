import cn from 'classnames';
import useInvoice from 'gigbook/hooks/useInvoice';
import { DateTime } from 'luxon';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './invoice.module.css';

export default function Invoice(): JSX.Element {
  const router = useRouter();
  const invoiceIdQuery = router.query.invoiceId;
  const invoiceId =
    typeof invoiceIdQuery === 'string' ? invoiceIdQuery : undefined;
  const { invoice: computedInvoice } = useInvoice(invoiceId);

  if (!computedInvoice) {
    return <p>Loading...</p>;
  } else {
    const { invoice, computations } = computedInvoice;
    return (
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
                  <td>{invoice.date.toLocaleString(DateTime.DATE_MED)}</td>
                </tr>
                <tr>
                  <td>Due</td>
                  <td>
                    {computations.dueDate.toLocaleString(DateTime.DATE_MED)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.LineItemsContainer}>
          <h3 className={styles.PayeeDescription}>
            {invoice.payee.description}
          </h3>
          <table className={styles.LineItems}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Task</th>
                <th align="right">Rate</th>
                <th align="right">Hours</th>
                <th align="right">Total</th>
              </tr>
            </thead>
            <tbody>
              {computations.lineItems.all.map((li) => (
                <tr key={li.id}>
                  <td>{li.project}</td>
                  <td>{li.task}</td>
                  <td align="right">{li.rate}</td>
                  <td align="right">{li.hours}</td>
                  <td align="right">{li.total}</td>
                </tr>
              ))}
              <tr className={styles.LineItemsTotalRow}>
                <td colSpan={5} align="right">
                  <span className={styles.BalanceDue}>Balance Due</span>
                  <span className={styles.LineItemsTotal}>
                    {computations.lineItems.total}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.BankDetails}>
          <p>
            Please pay <strong>{computations.exchangedTotal}</strong> by{' '}
            <strong>
              {computations.dueDate.toLocaleString(DateTime.DATE_FULL)}
            </strong>{' '}
            to:
          </p>
          <table className={styles.Table2}>
            <tbody>
              <tr>
                <td>Account Holder</td>
                <td>Someone LLC</td>
              </tr>
              <tr>
                <td>Sort Code</td>
                <td>11-11-11</td>
              </tr>
              <tr>
                <td>Account #</td>
                <td>12345678</td>
              </tr>
              <tr>
                <td>IBAN</td>
                <td>AAAA BBBB CCCC DDDD EEEE FF</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>
                  TransferWise
                  <br />
                  56 Shoreditch High Street
                  <br />
                  London
                  <br />
                  E1 6JJ
                  <br />
                  United Kingdom
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
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
