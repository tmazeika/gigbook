import SelectInput from 'gigbook/components/forms/SelectInput';
import { FormValueController } from 'gigbook/hooks/useForm';
import { currencies, Currency } from 'gigbook/models/currency';

const options = Object.fromEntries(
  currencies.map((currency) => [currency, currency.toUpperCase()]),
) as Record<Currency, string>;

interface Props {
  className?: string;
  controller: FormValueController<Currency>;
}

export default function CurrencySelectInput(props: Props): JSX.Element {
  return (
    <SelectInput {...props} options={options} />
  );
}
