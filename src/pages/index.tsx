import Fraction from 'fraction.js';
import ClockifyApiKeyButton from 'gigbook/components/clockifyApiKeyButton';
import ClockifyEntitySelect from 'gigbook/components/clockifyEntitySelect';
import ClockifyImportButton from 'gigbook/components/clockifyImportButton';
import DateInput from 'gigbook/components/dateInput';
import Layout from 'gigbook/components/layout';
import LineItemsTable from 'gigbook/components/lineItemsTable';
import NumberInput from 'gigbook/components/numberInput';
import SelectInput from 'gigbook/components/selectInput';
import TextInput from 'gigbook/components/textInput';
import useClockifyClients from 'gigbook/hooks/useClockifyClients';
import useClockifyWorkspaces from 'gigbook/hooks/useClockifyWorkspaces';
import useInvoiceForm from 'gigbook/hooks/useInvoiceForm';
import useSelect from 'gigbook/hooks/useSelect';

import { DateTime, Duration } from 'luxon';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

export interface LineItem {
  id: string;
  project: string;
  task: string;
  rate: Fraction;
  quantity: Duration;
}

const today = DateTime.now().startOf('day');
const lastMonth = today
  .minus(Duration.fromObject({ months: 1 }))
  .startOf('month');

export default function Index(): JSX.Element {
  const form = useInvoiceForm();
  const periodDiff = numberFormatter.format(
    form.values.periodEnd.diff(form.values.periodStart, ['days', 'hours'])
      .days + 1,
  );
  const dueDate = form.values.date
    .plus(Duration.fromObject({ days: form.values.billingNetTerms.n ?? 0 }))
    .toLocaleString({ dateStyle: 'medium' });
  const billingIncrementOk = form.values.billingIncrement.n
    ? Number.isInteger((form.values.billingIncrement.n / 60) * 100)
    : true;

  const workspaces = useClockifyWorkspaces();
  const [selectedWorkspace, selectWorkspace] = useSelect(workspaces);
  const clients = useClockifyClients(
    workspaces?.find((w) => w.id === selectedWorkspace?.id)?.id,
  );
  const [selectedClient, selectClient] = useSelect(clients);

  return (
    <Layout>
      <Form noValidate onSubmit={(e) => form.onSubmit(e)}>
        <h3>Invoice</h3>
        <Row className="mb-3">
          <Col>
            <FloatingLabel controlId="reference-input" label="Reference">
              <TextInput controller={form.control('reference')} />
            </FloatingLabel>
          </Col>
          <Col>
            <Form.Group controlId="date">
              <FloatingLabel label="Date">
                <DateInput controller={form.control('date')} />
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
              <FloatingLabel label="Period Start">
                <DateInput
                  max={form.values.periodEnd}
                  controller={form.control('periodStart')}
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
              <FloatingLabel label="Period End">
                <DateInput
                  min={form.values.periodStart}
                  controller={form.control('periodEnd')}
                />
              </FloatingLabel>
              <Form.Text muted>{periodDiff} day period</Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <h3>Payee</h3>
        <Row className="mb-3">
          <Col>
            <FloatingLabel controlId="payee-name" label="Name">
              <TextInput controller={form.control('payeeName')} />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="payee-description" label="Description">
              <TextInput controller={form.control('payeeDescription')} />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <FloatingLabel controlId="payee-address" label="Address">
              <TextInput controller={form.control('payeeAddress')} textArea />
            </FloatingLabel>
          </Col>
        </Row>
        <h3>Client</h3>
        <Row className="mb-3">
          <Col>
            <FloatingLabel controlId="client-name" label="Name">
              <TextInput controller={form.control('clientName')} />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              controlId="client-currency"
              label="Preferred Currency"
            >
              <SelectInput
                controller={form.control('clientCurrency')}
                options={{
                  usd: 'USD',
                  gbp: 'GBP',
                  jpy: 'JPY',
                }}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <FloatingLabel controlId="client-address" label="Address">
              <TextInput controller={form.control('clientAddress')} textArea />
            </FloatingLabel>
          </Col>
        </Row>
        <h3>Billing</h3>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="billing-increment">
              <Form.Label>Increment</Form.Label>
              <InputGroup>
                <NumberInput controller={form.control('billingIncrement')} />
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
            <Form.Group controlId="billing-net-terms">
              <Form.Label>Net Terms</Form.Label>
              <InputGroup>
                <NumberInput controller={form.control('billingNetTerms')} />
                <InputGroup.Text>days</InputGroup.Text>
              </InputGroup>
              <Form.Text muted>Due by {dueDate}</Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="billing-currency">
              <Form.Label>Currency</Form.Label>
              <SelectInput
                controller={form.control('billingCurrency')}
                options={{
                  gbp: 'GBP',
                  usd: 'USD',
                  jpy: 'JPY',
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <h3>Line Items</h3>
        <Row className="mb-2 g-2">
          <Col xs="auto">
            <ClockifyApiKeyButton size="sm" />
          </Col>
          <Col xs="auto">
            <ClockifyEntitySelect
              size="sm"
              entities={workspaces}
              value={selectedWorkspace}
              onChange={selectWorkspace}
            />
          </Col>
          <Col xs="auto">
            <ClockifyEntitySelect
              size="sm"
              entities={clients}
              value={selectedClient}
              onChange={selectClient}
            />
          </Col>
          <Col xs="auto">
            <ClockifyImportButton
              size="sm"
              startDate={form.values.periodStart}
              endDate={form.values.periodEnd}
              workspaceId={selectedWorkspace?.id}
              clientId={selectedClient?.id}
              lineItems={form.values.lineItems}
              onChange={(li) => form.set('lineItems', li ?? [])}
            />
          </Col>
        </Row>
        <LineItemsTable
          lineItems={form.values.lineItems}
          currency={form.values.billingCurrency}
          increment={form.values.billingIncrement.n ?? 0}
        />
        <Button variant="primary" type="submit">
          Generate
        </Button>
      </Form>
    </Layout>
  );
}
