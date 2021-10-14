//imports/installs to allow testing of Promises (asynchronous functions)
import "core-js/stable";
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime";
import Game from "../components/Game.js";
let timeout = 10000 //increase timeout if connection is slower
describe('Integration Test Via Class Game', ()=>{
    let game
    it('Should Initialize The Game', ()=>{
        game = new Game()
        expect(game.loaded).toBe(false)
        expect(game.board).toBeTruthy()
        expect(game.scores[0]).toBe(0)
        expect(game.scores[1]).toBe(0)
        expect(game.bag).toBeTruthy()
        expect(game.bag).toBeTruthy()
        expect(game.racks.players[0].length).toBe(7)
        expect(game.racks.players[1].length).toBe(7)
        expect(game.prompt).toBeTruthy()
        expect(game.load).toBeTruthy()
    })
    it('Should Load The Game', async ()=>{
        await game.load()
        expect(game.loaded).toBe(true)
    }, timeout)
})

describe('Integration and System Test for Game', ()=>{
    let game
    beforeAll(async ()=>{
        game = new Game()
        await game.load()
    }, timeout)
    it('Should Have Loaded Dictionary', ()=>{
        expect(game.board.dictionary.length).toBeGreaterThan(0)
    })
    it('Should Remove Correct Tiles From Rack Given Correct Indices', ()=>{
        let original = game.racks.players[0].slice(0), player = 0, indices = [1, 2, 5]
        let removed = game.removeTilesFromRack(player, indices)
        expect(removed.length).toBe(indices.length)
        expect(game.racks.players[player].length).toBe(original.length-indices.length)
        indices.forEach((index, i)=>{
            expect(original[index]).toBe(removed[i])
        })
    })
    //some basic gameplay tests. the detailed rule tests are already covered in board.test.js
    //every test under this section can be commented for clearity of test cases
    it('Game Should End When Both Players Pass', () => {
        let testParams = { //all iterators here increment automatically.. preset in the Game class
            optIter: 0, //for iterating through options of multiple turns
            option: [3, 3],  //pass once and pass again
            currentTileIndex: 0, //kinda similar to j but can be different. for iterating through tile indices that need to be placed on board
            tileIndices: [],
            letterPosIter: 0, //for iterating through placePos
            letterPos: [],
            rTileIndex: 0, //for iterating through tile indices that need to be replaced
            rTileIndices: []
        }
        game.start(true, testParams)
        expect(game.scores[0]).toBe(0);
        expect(game.scores[1]).toBe(0);
    });
    
    it('Should Reset Correctly', ()=>{
        game.reset()
        expect(game.loaded).toBe(true)
        expect(game.board).toBeTruthy()
        expect(game.scores[0]).toBe(0)
        expect(game.scores[1]).toBe(0)
        expect(game.bag).toBeTruthy()
        expect(game.bag).toBeTruthy()
        expect(game.racks.players[0].length).toBe(7)
        expect(game.racks.players[1].length).toBe(7)
        expect(game.prompt).toBeTruthy()
        expect(game.load).toBeTruthy()
        expect(game.board.dictionary.length).toBeGreaterThan(0)
    })
    it('Player 1 Should Win If They Place Tiles Correctly And Then Both Players Pass', () => {
        game.reset()
        let testParams = { //all iterators here increment automatically.. preset in the Game class
            optIter: 0, //for iterating through options of multiple turns
            option: [1, 3, 3],  //player1 place tiles, player2 passes and then player1 passes
            currentTileIndex: 0, //kinda similar to j but can be different. for iterating through tile indices that need to be placed on board
            tileIndices: ['1'],    //placing 1st tile from rack as all letters individually are in the word dictionary
            letterPosIter: 0, //for iterating through letterPos
            letterPos: ['7,7'], //placing at the center of the game board according to ruls
            rTileIndex: 0, //for iterating through tile indices that need to be replaced
            rTileIndices: []
        }
        game.start(true, testParams)
        expect(game.scores[0]).toBe(1);
        expect(game.scores[1]).toBe(0);
    });
    it('Player 2 Should Win: Player 1 Replaces Their Tiles. Player 2 Forms A Word. Both Players Pass.', () => {
        game.reset()
        let testParams = { //all iterators here increment automatically.. preset in the Game class
            optIter: 0, //for iterating through options of multiple turns
            option: [2, 1, 3, 3],  // same sequence as test tile
            currentTileIndex: 0, //kinda similar to j but can be different. for iterating through tile indices that need to be placed on board
            tileIndices: ['1'],    //placing 1st tile from rack as all letters individually are in the word dictionary
            letterPosIter: 0, //for iterating through letterPos
            letterPos: ['7,7'], //placing at the center of the game board according to ruls
            rTileIndex: 0, //for iterating through tile indices that need to be replaced
            rTileIndices: ['1,4'] //tiles of index 1 & 4 will be replaced
        }
        game.start(true, testParams)
        expect(game.scores[0]).toBe(0);
        expect(game.scores[1]).toBe(1);
    });
    it('Player 1 Should Be Able To Try Again If Placed A Tile Incorrectly.', ()=>{
        game.reset()
        let testParams = { //all iterators here increment automatically.. preset in the Game class
            optIter: 0, //for iterating through options of multiple turns
            option: [1, 3, 3],  // player 1 places incorrectly & correctly and then both pass
            currentTileIndex: 0, //kinda similar to j but can be different. for iterating through tile indices that need to be placed on board
            tileIndices: ['1', '1'],    //placing 1st tile from rack each time (Note: if number of tiles was 2, 1 , then this wwould have been ['1,1' ,  '1'])
            letterPosIter: 0, //for iterating through letterPos
            letterPos: ['7,6', '7,7'], //1st wrong placement and then correct placement
            rTileIndex: 0, //for iterating through tile indices that need to be replaced
            rTileIndices: [] //no tiles will be replaced
        }
        game.start(true, testParams)
        expect(game.scores[0]).toBe(1); //player 1 should win
        expect(game.scores[1]).toBe(0);
    })
    it('Player 2 Should Be Able To Try Again If Placed A Tile Incorrectly.', ()=>{
        game.reset()
        let testParams = { //all iterators here increment automatically.. preset in the Game class
            optIter: 0, //for iterating through options of multiple turns
            option: [3, 1, 3, 3],  // player1 passes, player 2 places incorrectly & correctly and then both pass
            currentTileIndex: 0, //kinda similar to j but can be different. for iterating through tile indices that need to be placed on board
            tileIndices: ['1', '1'],    //placing 1st tile from rack each time (Note: if number of tiles was 2, 1 , then this wwould have been ['1,1' ,  '1'])
            letterPosIter: 0, //for iterating through letterPos
            letterPos: ['7,6', '7,7'], //1st wrong placement and then correct placement
            rTileIndex: 0, //for iterating through tile indices that need to be replaced
            rTileIndices: [] //no tiles will be replaced
        }
        game.start(true, testParams)
        expect(game.scores[0]).toBe(0); //player 2 should win
        expect(game.scores[1]).toBe(1);
    })
})