# GitHub action to create a card in a Glo Board

Use this action to create a card on a [Glo Board](https://www.gitkraken.com/glo).
The action requires a board ID, name and a column as inputs.

## Requirements
The action requires an auth token in the form of a PAT that you can create in your GitKraken account.
See the [Personal Access Tokens](https://support.gitkraken.com/developers/pats/) page on our support site.

This token should be stored in your GitHub repo secrets (in repo Settings -> Secrets).

## Inputs
The `boardId` input is the ID of the Glo Board to create the card in.
The `name` input is the name of the card.
The `column` input is the name of a column that already exists in the Glo Board.
The `description` input is the description for the card (optional).
The `assignee` input is the username of a user to assign to the card (optional).
The `label` input is the name of a lable to add to the card (optional).

## Examples
Add a step in your workflow file to perform this action:
```yaml
    steps:
    - uses: Axosoft/glo-action-create-card@v1
      with:
        authToken: ${{ secrets.GLO-PAT }}
        boardId: '1234'
        name: 'New card from action'
        column: 'New'
        label: 'Bug'
      id: glo-create
```
