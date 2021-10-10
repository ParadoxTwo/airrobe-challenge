import { createInterface } from "readline";
import Board from './components/Board.js';
import Bag from './components/Bag.js';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

let board = new Board()
await board.loadDictionary()
let posLetters = [[7, 7, 'A'], [7, 8, 'T']]
let result = board.place(posLetters)
console.log(result)
board.show()
posLetters = [[8, 8, 'I'], [9, 8, 'E']]
result = board.place(posLetters)
console.log(result)
board.show()
posLetters = [[12, 8, 'I'], [13, 8, 'E']]
result = board.place(posLetters)
console.log(result)
board.show()

// rl.question("What is your name ? ", function(name) {
//     rl.question("Where do you live ? ", function(country) {
//         console.log(`${name}, is a citizen of ${country}`);
//         rl.close();
//     });
// });