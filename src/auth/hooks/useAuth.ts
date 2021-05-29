import { useContext } from 'react';
import type { Auth } from '../index';
import { context } from '../index';

export default function useAuth(): Auth {
  return useContext(context);
}
