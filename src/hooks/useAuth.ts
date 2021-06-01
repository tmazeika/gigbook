import type { Auth } from 'gigbook/contexts/auth';
import AuthContext from 'gigbook/contexts/auth';
import { useContext } from 'react';

export default function useAuth(): Auth {
  return useContext(AuthContext);
}
