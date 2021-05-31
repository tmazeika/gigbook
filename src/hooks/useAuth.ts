import { useContext } from 'react';
import type { Auth } from '../contexts/authContext';
import AuthContext from '../contexts/authContext';

export default function useAuth(): Auth {
  return useContext(AuthContext);
}
