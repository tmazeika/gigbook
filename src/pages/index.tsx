import Clockify, {
  ClockifyClient,
  ClockifyWorkspace,
} from 'gigbook/clockify/client';
import Layout from 'gigbook/components/layout';
import useClockifyClients from 'gigbook/hooks/useClockifyClients';
import useClockifyWorkspaces from 'gigbook/hooks/useClockifyWorkspaces';
import useForm from 'gigbook/hooks/useForm';
import { NumberInputValue } from 'gigbook/util/type';
import { DateTime, Duration } from 'luxon';
import { useEffect, useMemo, useState } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import useSWR from 'swr';
import * as uuid from 'uuid';

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
  const { data: apiKey } = useSWR<{ apiKey: string }>('/api/clockify/api-key');
  const workspaces = useClockifyWorkspaces(apiKey?.apiKey);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<ClockifyWorkspace>();
  const clients = useClockifyClients(apiKey?.apiKey, selectedWorkspace?.id);
  const [selectedClient, setSelectedClient] = useState<ClockifyClient>();
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [lineItemsLoading, setLineItemsLoading] = useState(false);
  useEffect(() => {
    if (workspaces?.length) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces]);
  useEffect(() => {
    if (clients?.length) {
      setSelectedClient(clients[0]);
    }
  }, [clients]);
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
      clientCurrency: 'USD',
      lineItems: [] as LineItem[],
      billingIncrement: NumberInputValue.fromNumber(6),
      billingNet: NumberInputValue.fromNumber(30),
      billingCurrency: 'USD',
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
    .toLocaleString();
  const billingIncrementOk = form.values.billingIncrement.n
    ? Number.isInteger((form.values.billingIncrement.n / 60) * 100)
    : true;

  return (
    <Layout>
      <Form noValidate onSubmit={(e) => form.onSubmit(e)}>
        <h3>Invoice</h3>
        <Form.Row>
          <Col>
            <Form.Group controlId="id">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="000 001"
                value={form.values.id}
                onChange={(e) => form.set('id', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
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
              <Form.Text>
                <ButtonGroup>
                  <Button
                    variant="link"
                    size="sm"
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
                    size="sm"
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
              <Form.Label>Period Start</Form.Label>
              <Form.Control
                type="date"
                max={form.values.periodEnd.toISODate()}
                value={form.values.periodStart.toISODate()}
                onChange={(e) => {
                  if (e.target.value === '') {
                    form.set(
                      'periodStart',
                      DateTime.min(form.values.periodEnd, lastMonth),
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
              <Form.Text>
                <ButtonGroup>
                  <Button
                    variant="link"
                    size="sm"
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
                    size="sm"
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
              <Form.Label>Period End</Form.Label>
              <Form.Control
                type="date"
                min={form.values.periodStart.toISODate()}
                value={form.values.periodEnd.toISODate()}
                onChange={(e) => {
                  if (e.target.value === '') {
                    form.set(
                      'periodEnd',
                      DateTime.max(
                        form.values.periodStart,
                        lastMonth.endOf('month').startOf('day'),
                      ),
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
              <Form.Text muted>{periodDiff} day period</Form.Text>
            </Form.Group>
          </Col>
        </Form.Row>
        <h3>Payee</h3>
        <Form.Row>
          <Col>
            <Form.Group controlId="my-name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="My Company LLC"
                value={form.values.myName}
                onChange={(e) => form.set('myName', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="my-description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Software Engineering Services"
                value={form.values.myDescription}
                onChange={(e) => form.set('myDescription', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Group controlId="my-address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={'123 Main St\nBoston, MA 02115\nUnited States'}
            value={form.values.myAddress}
            onChange={(e) => form.set('myAddress', e.target.value)}
          />
        </Form.Group>
        <h3>Client</h3>
        <Form.Row>
          <Col>
            <Form.Group controlId="client-name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Client Company LLC"
                value={form.values.clientName}
                onChange={(e) => form.set('clientName', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="client-currency">
              <Form.Label>Preferred Currency</Form.Label>
              <Form.Control
                as="select"
                custom
                value={form.values.clientCurrency}
                onChange={(e) => form.set('clientCurrency', e.target.value)}
              >
                <option>GBP</option>
                <option>USD</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Group controlId="client-address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={'123 Main St\nBoston, MA 02115\nUnited States'}
            value={form.values.clientAddress}
            onChange={(e) => form.set('clientAddress', e.target.value)}
          />
        </Form.Group>
        <h3>Billing</h3>
        <Form.Row>
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
                <InputGroup.Append>
                  <InputGroup.Text>minutes</InputGroup.Text>
                </InputGroup.Append>
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
                <InputGroup.Append>
                  <InputGroup.Text>days</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text muted>Due by {dueDate}</Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="billing-currency">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                as="select"
                custom
                value={form.values.billingCurrency}
                onChange={(e) => form.set('billingCurrency', e.target.value)}
              >
                <option>GBP</option>
                <option>USD</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Form.Row>
        <h3>Line Items</h3>
        <ButtonToolbar className="mb-2">
          <DropdownButton
            className="mr-2"
            disabled={!workspaces?.length}
            title={selectedWorkspace?.name ?? 'Select workspace'}
            size="sm"
            onSelect={(id) =>
              setSelectedWorkspace(workspaces?.find((w) => w.id === id))
            }
          >
            {workspaces?.map((workspace) => (
              <Dropdown.Item
                key={workspace.id}
                eventKey={workspace.id}
                active={selectedWorkspace?.id === workspace.id}
              >
                {workspace.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <DropdownButton
            className="mr-2"
            disabled={!clients?.length}
            title={selectedClient?.name ?? 'Select client'}
            size="sm"
            onSelect={(id) =>
              setSelectedClient(clients?.find((w) => w.id === id))
            }
          >
            {clients?.map((client) => (
              <Dropdown.Item
                key={client.id}
                eventKey={client.id}
                active={selectedClient?.id === client.id}
              >
                {client.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <Button
            variant="outline-primary"
            size="sm"
            disabled={
              apiKey === undefined ||
              !selectedWorkspace ||
              !selectedClient ||
              lineItemsLoading
            }
            onClick={async () => {
              setLineItemsLoading(true);
              const clockify = new Clockify(apiKey?.apiKey ?? '');
              const invoice = await clockify.getInvoice(
                selectedWorkspace?.id ?? '',
                selectedClient?.id ?? '',
                form.values.periodStart,
                form.values.periodEnd,
              );
              const all = Object.values(invoice.clients)[0].lineItems.map(
                (li): LineItem => ({
                  id: uuid.v4(),
                  project: li.project.name,
                  task: li.task,
                  rate: li.rate / 100,
                  quantity: li.quantity,
                }),
              );
              form.set('lineItems', all);
              setLineItems(all);
              setLineItemsLoading(false);
            }}
          >
            {lineItemsLoading ? 'Loading...' : 'Import'}
          </Button>
        </ButtonToolbar>
        <Table striped bordered>
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
            {lineItems.map((lineItem) => (
              <tr key={lineItem.id}>
                <td>{lineItem.project}</td>
                <td>{lineItem.task}</td>
                <td align="right">{currencyFormatter.format(lineItem.rate)}</td>
                <td align="right">
                  {numberFormatter.format(
                    roundQuantity(
                      lineItem.quantity,
                      form.values.billingIncrement.n ?? 0,
                    ).as('hours'),
                  )}
                </td>
                <td align="right">
                  {currencyFormatter.format(
                    lineItem.rate *
                      roundQuantity(
                        lineItem.quantity,
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
                    lineItems.reduce(
                      (sum, lineItem) =>
                        sum +
                        lineItem.rate *
                          roundQuantity(
                            lineItem.quantity,
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
