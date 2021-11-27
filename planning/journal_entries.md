# Journal Entries

They have fields:

- Reference `string`
- Date `date`
- Note `string`
- Lines
    - Account
    - Debit amount (mutex w/ credit) `money`
    - Credit amount (mutex w/ debit) `money`
- Attachments `file[]`; examples:
    - Receipts
    - Invoices

They can be:

- Created
    - From most screens
    - Many line items connects this to many accounts
    - Show that line items balance the entry (credits = debits)
- Edited
- Archived
    - Hides from most views
    - Excludes from calculations
    - Restorable
- Deleted
