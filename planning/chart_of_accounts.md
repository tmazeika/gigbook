# Chart of Accounts

Accounts have a type:

- **Asset**
    - Debit (+)
    - Credit (-)
- **Liability**
    - Debit (-)
    - Credit (+)
- **Equity**
    - Debit (-)
    - Credit (+)
- **Income**
    - Debit (-)
    - Credit (+)
- **Expense**
    - Debit (+)
    - Credit (-)

They have fields:

- Number `int`
- Name `string`
- Description `string`
- Currency `enum`

They can be:

- Created
- Edited
    - Changing account type may throw off balance (show warning)
    - Changing currency requires conversion
- Archived
    - Keeps related journal entries
- Deleted
    - Cascade deletes related journal entries
