import { createContext } from 'react';

export interface I18n {
  locale?: string;
}

export default createContext<I18n>({});
