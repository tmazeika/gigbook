import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Index(): JSX.Element {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            GigBook
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Chart of Accounts
        </Typography>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell>Account Description</TableCell>
                <TableCell>Account Type</TableCell>
                <TableCell>Statement</TableCell>
                <TableCell align="right">
                  <Button>New Account</Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1010</TableCell>
                <TableCell>Cash</TableCell>
                <TableCell>Assets</TableCell>
                <TableCell>Balance Sheet</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1020</TableCell>
                <TableCell>Accounts Receivable</TableCell>
                <TableCell>Assets</TableCell>
                <TableCell>Balance Sheet</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Chart of Accounts
        </Typography>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell>Account Description</TableCell>
                <TableCell>Account Type</TableCell>
                <TableCell>Statement</TableCell>
                <TableCell align="right">
                  <Button>New Account</Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1010</TableCell>
                <TableCell>Cash</TableCell>
                <TableCell>Assets</TableCell>
                <TableCell>Balance Sheet</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1020</TableCell>
                <TableCell>Accounts Receivable</TableCell>
                <TableCell>Assets</TableCell>
                <TableCell>Balance Sheet</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
