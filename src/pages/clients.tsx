import Layout from 'gigbook/components/layout';
import useClients from 'gigbook/hooks/useClients';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';

export default function Clients(): JSX.Element {
  const clients = useClients();

  return (
    <Layout>
      <Row>
        <Col>
          <h1>Clients</h1>
          <ListGroup>
            {clients.data.map((c) => (
              <ListGroup.Item key={c.id}>{c.clockifyId}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Layout>
  );
}
