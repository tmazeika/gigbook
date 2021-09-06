import { signIn, signOut, useSession } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

interface Props {
  children?: React.ReactNode;
}

export default function Layout(props: Props): JSX.Element {
  const router = useRouter();
  const [session] = useSession();

  return (
    <>
      <Head>
        <title>GigBook</title>
      </Head>
      <Navbar className="mb-3" bg="light">
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>GigBook</Navbar.Brand>
          </Link>
          <Nav className="me-auto" activeKey={router.route}>
            <Link href="/invoices" passHref>
              <Nav.Link>Invoices</Nav.Link>
            </Link>
            <Link href="/clients" passHref>
              <Nav.Link>Clients</Nav.Link>
            </Link>
          </Nav>
          {session ? (
            <>
              <Navbar.Text className="me-3">
                {session.user.name ?? session.user.email ?? session.user.id}
              </Navbar.Text>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => signOut()}
              >
                Log Out
              </Button>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={() => signIn()}>
              Log In
            </Button>
          )}
        </Container>
      </Navbar>
      <Container>{props.children}</Container>
    </>
  );
}
