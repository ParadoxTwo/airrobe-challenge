import { createInterface } from "readline";
import Board from './components/Board.js';
import Bag from './components/Bag.js';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

let board = new Board()
board.loadDictionary()

// rl.question("What is your name ? ", function(name) {
//     rl.question("Where do you live ? ", function(country) {
//         console.log(`${name}, is a citizen of ${country}`);
//         rl.close();
//     });
// });