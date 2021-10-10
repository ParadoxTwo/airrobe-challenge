import Board from "../components/Board.js"
import "core-js/stable";
import "regenerator-runtime/runtime";

describe('Functional & Integration Tests for Board',()=>{
    let board
    beforeEach(()=>{
        board = new Board()
    })
    it('Should Initialize', () => {
        expect(board.board.length).toBeGreaterThan(0)
    })
})
describe('Functional & Integration Tests for Board With Loaded Dictionary', ()=>{
    let board
    let racks
    beforeAll(async()=>{
        board = new Board()
        await board.loadDictionary()
    })
    beforeEach(()=>{
        board.reset()
    })
    it('Should Load Dictionary', ()=>{
        expect(board.dictionary.length).toBeGreaterThan(0)
    })
    it('Should Place Tiles Given in Correct Format', ()=>{
        
        //test here
        let posLetters = [[7, 7, 'A'], [7, 8, 'T']]
        let result = board.place(posLetters)
        console.log(result)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe("Tiles successfully placed and formed words.")
    })
    it('First Word Should Pass Through Center', ()=>{
        let posLetters = [[7, 9, 'A'], [7, 8, 'T']]
        let result = board.place(posLetters)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe("First word has to be in the center.")
    })
    it('Placed Tiles Connected to Main Branch', ()=>{
        expect(board.first).toBe(true)
        let posLetters = [[7, 7, 'A'], [7, 8, 'T']]
        let result = board.place(posLetters)
        expect(board.first).toBe(false)
        posLetters = [[8, 8, 'I'], [9, 8, 'E']]
        result = board.place(posLetters)
        console.log(result)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe("Tiles successfully placed and formed words.")
    })
    it('Should Not Place Tiles Seperated From Main Branch', ()=>{
        let posLetters = [[7, 7, 'A'], [7, 8, 'T']]
        let result = board.place(posLetters)
        posLetters = [[8, 8, 'I'], [9, 8, 'E']]
        result = board.place(posLetters)
        posLetters = [[12, 8, 'T'], [12, 9, 'I'], [12, 10, 'E']]
        result = board.place(posLetters)
        console.log(result)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe("Word not connected to the main branch!")
    })
})