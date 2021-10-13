# Scrabble 

Building this game was quite challenging and fun! I learned a lot as I applied TDD in the game.

## Prerequisites

Before running the game, make sure to install nodejs if you do not have it installed already and then run the command in the project directory:

### `npm install`

## Running the game

To run the game, run the following command in the project directory:

### `npm start`

This will start the game in the command line. You can forcefully stop the game by pressing CTRL + C

## Running tests

The tests were built using jest. To run tests, run the following command in the project directory:

### `npm test`

Every test under line 47 of game.test.js can be commented for clearity of details in testing. You can asle modify the parameters for test in package.json depending on the information you need from the tests. For more details check out jest documentation (https://jestjs.io/docs/cli).

## How to play

Each player has a rack of 7 tiles each. First, Player 1 can either place tiles into board or replace his/her tiles from the bag or pass to Player 2.  
<ul>
    <li>If option 1 (Place Tiles) is chosen, the player has to provide information about which tile he/she wants to place and where on the board. The location on the board is in row, column format ranging from 0 to 14 which is shown on the board to make it easier.</li>  
    <li>If option 2 (Replace Tiles From Bag) is chosen, the player has to tell which tiles he/she wants replaced and it will be done.</li>  
    <li>If option 3 (Pass) is chosen, the turn is passed to Player 2.  </li>
</ul>  
This gameplay continues until both players decide to Pass in which case the game ends and scores are shown with the victor.

### Example

This is a turn based game between 2 players. <br/>
If both players pass, the game will end. <br/>

___ __ __ __ __start of board_ __ __ __ __ __ __ <br/>
| | 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 <br/>
__  __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ <br/>
0  |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
1  |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
2  |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
3  |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
4  |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
5  |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
6  |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
7  |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
8  |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
9  |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
10 |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
11 |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
12 |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
13 |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
14 |__|__|__|__|__|__|__|__|__|__|__|__|__|__|__| <br/>
. _ __ __ __ __ end of board_ __ __ __ __ __ __ <br/>
