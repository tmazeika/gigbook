import { ClockifyClient, ClockifyWorkspace } from 'gigbook/clockify/client';
import ClockifyApiKeyButton from 'gigbook/components/clockifyApiKeyButton';
import ClockifyClientSelect from 'gigbook/components/clockifyClientSelect';
import ClockifyImportButton from 'gigbook/components/clockifyImportButton';
import ClockifyWorkspaceSelect from 'gigbook/components/clockifyWorkspaceSelect';
import Layout from 'gigbook/components/layout';
import useForm from 'gigbook/hooks/useForm';
import { NumberInputValue } from 'gigbook/util/type';
import { DateTime, Duration } from 'luxon';
import { useCallback, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

const numberFormatter = new Intl.NumberFormat();

export interface LineItem {
  id: string;
  project: string;
  task: string;
  rate: number;
  quantity: Duration;
}

export interface BankDetail {
  key: string;
  value: string;
}

const today = DateTime.now().startOf('day');
const lastMonth = today
  .minus(Duration.fromObject({ months: 1 }))
  .startOf('month');

export default function Index(): JSX.Element {
  const [workspace, setWorkspace] = useState<ClockifyWorkspace>();
  const [client, setClient] = useState<ClockifyClient>();
  const form = useForm({
    initialValues: {
      id: '',
      date: today,
      periodStart: lastMonth,
      periodEnd: lastMonth.endOf('month').startOf('day'),
      myName: '',
      myDescription: '',
      myAddress: '',
      clientName: '',
      clientAddress: '',
      clientCurrency: 'usd',
      lineItems: [] as LineItem[],
      billingIncrement: NumberInputValue.fromNumber(6),
      billingNet: NumberInputValue.fromNumber(30),
      billingCurrency: 'usd',
      bank: [] as BankDetail[],
      template: '',
      templateStyles: '',
    },
  });
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: form.values.billingCurrency,
      }),
    [form.values.billingCurrency],
  );
  const periodDiff = numberFormatter.format(
    form.values.periodEnd.diff(form.values.periodStart, ['days', 'hours'])
      .days + 1,
  );
  const dueDate = form.values.date
    .plus(Duration.fromObject({ days: form.values.billingNet.n ?? 0 }))
    .toLocaleString({ dateStyle: 'medium' });
  const billingIncrementOk = form.values.billingIncrement.n
    ? Number.isInteger((form.values.billingIncrement.n / 60) * 100)
    : true;

  const onWorkspaceChange = useCallback((w?: ClockifyWorkspace) => {
    setWorkspace(w);
    setClient(undefined);
  }, []);

  return (
    <Layout>
      <Form noValidate onSubmit={(e) => form.onSubmit(e)}>
        <h3>Invoice</h3>
        <Row className="mb-3">
          <Col>
            <FloatingLabel controlId="floating-id" label="ID">
              <Form.Control
                type="text"
                placeholder=""
                value={form.values.id}
                onChange={(e) => form.set('id', e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <Form.Group controlId="date">
              <FloatingLabel controlId="floating-date" label="Date">
                <Form.Control
                  type="date"
                  value={form.values.date.toISODate()}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      form.set('date', today.startOf('day'));
                      return;
                    }
                    form.set(
                      'date',
                      DateTime.fromISO(e.target.value, { zone: 'local' }),
                    );
                  }}
                />
              </FloatingLabel>
              <Form.Text>
                <ButtonGroup size="sm">
                  <Button
                    variant="link"
                    onClick={() =>
                      form.set(
                        'date',
                        today.minus(Duration.fromObject({ days: 1 })),
                      )
                    }
                  >
                    Yesterday
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => form.set('date', today.startOf('month'))}
                  >
                    Start of Month
                  </Button>
                </ButtonGroup>
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="period-start">
              <FloatingLabel
                controlId="floating-period-start"
                label="Period Start"
              >
                <Form.Control
                  type="date"
                  max={form.values.periodEnd.toISODate()}
                  value={form.values.periodStart.toISODate()}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      form.set(
                        'periodStart',
                        form.values.periodEnd.startOf('month'),
                      );
                      return;
                    }
                    const date = DateTime.fromISO(e.target.value, {
                      zone: 'local',
                    });
                    if (date.valueOf() <= form.values.periodEnd.valueOf()) {
                      form.set('periodStart', date);
                    }
                  }}
                />
              </FloatingLabel>
              <Form.Text>
                <ButtonGroup size="sm">
                  <Button
                    variant="link"
                    onClick={() => {
                      form.set('periodStart', lastMonth);
                      form.set(
                        'periodEnd',
                        lastMonth.endOf('month').startOf('day'),
                      );
                    }}
                  >
                    Last Month
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => {
                      form.set('periodStart', today.startOf('month'));
                      form.set(
                        'periodEnd',
                        today.endOf('month').startOf('day'),
                      );
                    }}
                  >
                    This Month
                  </Button>
                </ButtonGroup>
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="period-end">
              <FloatingLabel controlId="floating-period-end" label="Period End">
                <Form.Control
                  type="date"
                  min={form.values.periodStart.toISODate()}
                  value={form.values.periodEnd.toISODate()}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      form.set(
                        'periodEnd',
                        form.values.periodStart.endOf('month').startOf('day'),
                      );
                      return;
                    }
                    const date = DateTime.fromISO(e.target.value, {
                      zone: 'local',
                    });
                    if (date.valueOf() >= form.values.periodStart.valueOf()) {
                      form.set('periodEnd', date);
                    }
                  }}
                />
              </FloatingLabel>
              <Form.Text muted>{periodDiff} day period</Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <h3>Payee</h3>
        <Row className="mb-3">
          <Col>
            <FloatingLabel controlId="floating-my-name" label="Name">
              <Form.Control
                type="text"
                placeholder=""
                value={form.values.myName}
                onChange={(e) => form.set('myName', e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              controlId="floating-my-description"
              label="Description"
            >
              <Form.Control
                type="text"
                placeholder=""
                value={form.values.myDescription}
                onChange={(e) => form.set('myDescription', e.target.value)}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <FloatingLabel
          className="mb-3"
          controlId="floating-my-address"
          label="Address"
        >
          <Form.Control
            as="textarea"
            style={{ height: '8em' }}
            placeholder=""
            value={form.values.myAddress}
            onChange={(e) => form.set('myAddress', e.target.value)}
          />
        </FloatingLabel>
        <h3>Client</h3>
        <Row className="mb-3">
          <Col>
            <FloatingLabel controlId="floating-client-name" label="Name">
              <Form.Control
                type="text"
                placeholder=""
                value={form.values.clientName}
                onChange={(e) => form.set('clientName', e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              controlId="floating-client-currency"
              label="Preferred Currency"
            >
              <Form.Select
                value={form.values.clientCurrency}
                onChange={(e) =>
                  form.set('clientCurrency', e.currentTarget.value)
                }
              >
                <option value="gbp">GBP</option>
                <option value="usd">USD</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <FloatingLabel
          className="mb-3"
          controlId="floating-client-address"
          label="Address"
        >
          <Form.Control
            as="textarea"
            style={{ height: '8em' }}
            placeholder=""
            value={form.values.clientAddress}
            onChange={(e) => form.set('clientAddress', e.target.value)}
          />
        </FloatingLabel>
        <h3>Billing</h3>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="billing-increment">
              <Form.Label>Increment</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={form.values.billingIncrement.text}
                  onChange={(e) => {
                    const n = NumberInputValue.fromText(e.target.value, {
                      integer: true,
                      positive: true,
                    });
                    if (n.isValid) {
                      form.set('billingIncrement', n);
                    }
                  }}
                />
                <InputGroup.Text>minutes</InputGroup.Text>
              </InputGroup>
              {!billingIncrementOk && (
                <Form.Text className="text-warning">
                  <strong>Warning:</strong> {form.values.billingIncrement.n}
                  &#8202;&#247;&#8202;60 has more than two decimal places
                </Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="billing-net">
              <Form.Label>Net Terms</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={form.values.billingNet.text}
                  onChange={(e) => {
                    const n = NumberInputValue.fromText(e.target.value, {
                      integer: true,
                      positive: true,
                    });
                    if (n.isValid) {
                      form.set('billingNet', n);
                    }
                  }}
                />
                <InputGroup.Text>days</InputGroup.Text>
              </InputGroup>
              <Form.Text muted>Due by {dueDate}</Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="billing-currency">
              <Form.Label>Currency</Form.Label>
              <Form.Select
                value={form.values.billingCurrency}
                onChange={(e) =>
                  form.set('billingCurrency', e.currentTarget.value)
                }
              >
                <option value="gbp">GBP</option>
                <option value="usd">USD</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <h3>Line Items</h3>
        <Row className="mb-2 g-2">
          <Col xs="auto">
            <ClockifyApiKeyButton size="sm" />
          </Col>
          <Col xs="auto">
            <ClockifyWorkspaceSelect
              size="sm"
              value={workspace}
              onChange={onWorkspaceChange}
            />
          </Col>
          <Col xs="auto">
            <ClockifyClientSelect
              size="sm"
              workspaceId={workspace?.id}
              value={client}
              onChange={setClient}
            />
          </Col>
          <Col xs="auto">
            <ClockifyImportButton
              size="sm"
              dateStart={form.values.periodStart}
              dateEnd={form.values.periodEnd}
              workspaceId={workspace?.id}
              clientId={client?.id}
              lineItems={form.values.lineItems}
              onChange={(li) => form.set('lineItems', li ?? [])}
            />
          </Col>
        </Row>
        <Table className="mb-3" striped bordered>
          <thead>
            <tr>
              <th>Project</th>
              <th>Task</th>
              <th>Rate</th>
              <th>Hours</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {form.values.lineItems.map((li) => (
              <tr key={li.id}>
                <td>{li.project}</td>
                <td>{li.task}</td>
                <td align="right">{currencyFormatter.format(li.rate)}</td>
                <td align="right">
                  {numberFormatter.format(
                    roundQuantity(
                      li.quantity,
                      form.values.billingIncrement.n ?? 0,
                    ).as('hours'),
                  )}
                </td>
                <td align="right">
                  {currencyFormatter.format(
                    li.rate *
                      roundQuantity(
                        li.quantity,
                        form.values.billingIncrement.n ?? 0,
                      ).as('hours'),
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} />
              <td align="right">
                <strong>
                  {currencyFormatter.format(
                    form.values.lineItems.reduce(
                      (sum, li) =>
                        sum +
                        li.rate *
                          roundQuantity(
                            li.quantity,
                            form.values.billingIncrement.n ?? 0,
                          ).as('hours'),
                      0,
                    ),
                  )}
                </strong>
              </td>
            </tr>
          </tbody>
        </Table>
        <Button variant="primary" type="submit">
          Generate
        </Button>
      </Form>
    </Layout>
  );
}

function roundQuantity(quantity: Duration, incrementMinutes: number): Duration {
  const quantityMinutes = quantity.as('minutes');
  return incrementMinutes
    ? Duration.fromObject({
        minutes:
          Math.ceil(quantityMinutes / incrementMinutes) * incrementMinutes,
      })
    : quantity;
}
