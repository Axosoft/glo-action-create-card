import * as core from '@actions/core';
import GloSDK from '@axosoft/glo-sdk';

interface ICardToCreate {
  name: string;
  description?: {
    text: string;
  };
  labels?: {id: string; name: string}[];
  assignees?: {id: string}[];
  column_id?: string;
  position: number;
}

async function run() {
  //required
  const authToken = core.getInput('authToken');
  const boardId = core.getInput('boardID');
  const name = core.getInput('name');
  const columnName = core.getInput('column');
  const position = 0;

  //optional
  const description = core.getInput('description');
  const username = core.getInput('assignee');
  const labelName = core.getInput('label');

  try {
    if (!boardId || !name || !columnName || !authToken) {
      return;
    }

    // find the board { id, labels }
    const board = await GloSDK(authToken).boards.get(boardId, {
      fields: ['columns', 'labels', 'members']
    });
    if (!board) {
      core.setFailed(`Board ${boardId} not found`);
      return;
    }

    let cardToCreate: ICardToCreate = {
      name,
      position
    };

    //set description
    if (description) {
      cardToCreate.description = {
        text: description
      };
    }

    // find label
    if (board.labels) {
      const label = board.labels.find(l => l.name === labelName);
      if (label) {
        cardToCreate.labels = [
          {
            id: label.id as string,
            name: label.name as string
          }
        ];
      }
    }

    // find assignee
    if (board.members) {
      const member = board.members.find(m => m.username === username);
      if (member) {
        cardToCreate.assignees = [
          {
            id: member.id as string
          }
        ];
      }
    }

    // find column
    if (board.columns) {
      const column = board.columns.find(c => c.name === columnName);
      if (column) {
        cardToCreate.column_id = column.id;
      } else {
        core.setFailed(`Column ${columnName} not found`);
        return;
      }
    }

    //create card
    await GloSDK(authToken).boards.cards.create(boardId, cardToCreate);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
