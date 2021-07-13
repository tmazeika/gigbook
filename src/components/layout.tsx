import { signIn, signOut, useSession } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

export default function Layout(
  props: React.PropsWithChildren<unknown>,
): JSX.Element {
  const router = useRouter();
  const [session] = useSession();

  return (
    <Container className="my-3">
      <Head>
        <title>GigBook</title>
      </Head>
      <Row className="mb-3">
        <Col>
          <Navbar bg="light" variant="light">
            <Link href="/" passHref>
              <Navbar.Brand>GigBook</Navbar.Brand>
            </Link>
            <Nav className="mr-auto" activeKey={router.route}>
              <Link href="/clients" passHref>
                <Nav.Link>Clients</Nav.Link>
              </Link>
            </Nav>
            {session ? (
              <>
                <Navbar.Text className="mr-3">
                  {session.user?.email}
                </Navbar.Text>
                <Button variant="outline-danger" onClick={() => signOut()}>
                  Log Out
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => signIn()}>
                Log In
              </Button>
            )}
          </Navbar>
        </Col>
      </Row>
      {props.children}
    </Container>
  );
}
