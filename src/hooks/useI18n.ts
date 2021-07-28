import I18nContext, { I18n } from 'gigbook/context/I18nContext';
import { useContext } from 'react';

export default function useI18n(): I18n {
  return useContext(I18nContext);
}
