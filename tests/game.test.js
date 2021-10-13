//imports/installs to allow testing of Promises (asynchronous functions)
import "core-js/stable";
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime";
import Game from "../components/Game.js";

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
    })
})

describe('Integration and System Test for Game', ()=>{
    let game
    beforeAll(async ()=>{
        game = new Game()
        await game.load()
    })
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
    it('Game Should End When Both Players Pass', () => {
        let testParams = { //all iterators here increment automatically.. preset in the Game class
            optIter: 0, //for iterating through options of multiple turns
            option: [3, 3],  //pass once and pass again
            tileNumIter: 0,  //for iterating through placeNumberOfTiles of multiple turns    
            placeNumberOfTiles: [],
            currentTileIndex: 0, //kinda similar to j but can be different. for iterating through tile indices that need to be placed on board
            tileIndices: [],
            letterPosIter: 0, //for iterating through placePos
            letterPos: [],
            replaceIter: 0, // for iterating through replaceNumberOfTiles
            replaceNumberOfTiles: [],
            rTileIndex: 0, //for iterating through tile indices that need to be replaced
            rTileIndices: []
        }
        game.start(true, testParams)
        expect(game.scores[0]).toBe(0);
        expect(game.scores[1]).toBe(0);
    });
    it('Player 1 Should Win If They Place Tiles Correctly And Then Both Players Pass', () => {
        let testParams = { //all iterators here increment automatically.. preset in the Game class
            optIter: 0, //for iterating through options of multiple turns
            option: [1, 3, 3],  //player1 place tiles, player2 passes and then player1 passes
            tileNumIter: 0,  //for iterating through placeNumberOfTiles of multiple turns    
            placeNumberOfTiles: [1], //just placing one tile
            currentTileIndex: 0, //kinda similar to j but can be different. for iterating through tile indices that need to be placed on board
            tileIndices: [1],    //placing 1st tile from rack as all letters individually are in the word dictionary
            letterPosIter: 0, //for iterating through letterPos
            letterPos: ['7,7'], //placing at the center of the game board according to ruls
            replaceIter: 0, // for iterating through replaceNumberOfTiles
            replaceNumberOfTiles: [],
            rTileIndex: 0, //for iterating through tile indices that need to be replaced
            rTileIndices: []
        }
        game.start(true, testParams)
        expect(game.scores[0]).toBe(1);
        expect(game.scores[1]).toBe(0);
    });
})