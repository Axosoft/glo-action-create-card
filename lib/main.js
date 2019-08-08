"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const glo_sdk_1 = __importDefault(require("@axosoft/glo-sdk"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('here');
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
        console.log('here1');
        try {
            if (!boardId || !name || !columnName || !authToken) {
                console.log('here2');
                return;
            }
            // find the board { id, labels }
            const board = yield glo_sdk_1.default(authToken).boards.get(boardId, {
                fields: ['columns', 'labels', 'members']
            });
            console.log('here3');
            if (!board) {
                core.setFailed(`Board ${boardId} not found`);
                return;
            }
            let cardToCreate = {
                name,
                position
            };
            console.log('here4');
            //set description
            if (description) {
                cardToCreate.description = {
                    text: description
                };
            }
            console.log('here5');
            // find label
            if (board.labels) {
                const label = board.labels.find(l => l.name === labelName);
                if (label) {
                    cardToCreate.labels = [
                        {
                            id: label.id,
                            name: label.name
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
                            id: member.id
                        }
                    ];
                }
            }
            // find column
            if (board.columns) {
                const column = board.columns.find(c => c.name === columnName);
                if (column) {
                    cardToCreate.column_id = column.id;
                }
                else {
                    core.setFailed(`Column ${columnName} not found`);
                    return;
                }
            }
            console.log('here6');
            //create card
            yield glo_sdk_1.default(authToken).boards.cards.create(boardId, cardToCreate);
            console.log('here7');
        }
        catch (error) {
            console.log(error);
            core.setFailed(error.message);
        }
    });
}
run();
