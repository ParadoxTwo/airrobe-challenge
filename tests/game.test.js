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
        expect(game.bag).toBeTruthy()
        expect(game.bag).toBeTruthy()
        expect(game.racks.players[0].length).toBe(7)
        expect(game.racks.players[1].length).toBe(7)
        expect(game.ioInterface).toBeTruthy()
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
        console.log(original)
        console.log(removed)
        console.log(game.racks.players[player])
        expect(removed.length).toBe(indices.length)
        expect(game.racks.players[player].length).toBe(original.length-indices.length)
        indices.forEach((index, i)=>{
            expect(original[index]).toBe(removed[i])
        })
    })
})