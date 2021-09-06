import React from 'react';
import Button, { ButtonProps } from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const lang = {
  create: ['Create', 'Creating...'],
  delete: ['Delete', 'Deleting...'],
  import: ['Import', 'Importing...'],
  save: ['Save', 'Saving...'],
} as const;

interface Props extends Omit<ButtonProps, 'children'> {
  langVariant: keyof typeof lang;
  loading?: boolean;
}

export default function LoadingButton({
  langVariant,
  loading,
  disabled,
  ...props
}: Props): JSX.Element {
  const [actionText, loadingText] = lang[langVariant];
  return (
    <Button {...props} disabled={disabled || loading}>
      {loading ? (
        <>
          <Spinner as="span" className="me-2" size="sm" animation="border" />
          {loadingText}
        </>
      ) : (
        actionText
      )}
    </Button>
  );
}
