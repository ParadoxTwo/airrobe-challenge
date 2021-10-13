import Board from "../components/Board.js"
//imports/installs to allow testing of Promises (asynchronous functions)
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

describe('Initialization Tests for Board',()=>{
    it('Should Initialize', () => {
        let board
        board = new Board()
        expect(board.board.length).toBeGreaterThan(0)
        expect(board.first).toBe(true)
        expect(board.dictionary.length).toBe(0)
        expect(board.alphabet.length).toBe(26)
        expect(board.loadDictionary).toBeTruthy()
    })
})
describe('Functional & Integration Tests for Board With Loaded Dictionary', ()=>{
    let board
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
    it('Should Reject Invalid Letters Of Tiles', ()=>{
        let posLetters = [[7, 7, 'A'], [7, 8, '1']]
        let result = board.place(posLetters)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe("Invalid letter.")
    })
    it('Should Reject Out of Bounds Placement Of Tiles', ()=>{
        let posLetters = [[7, 7, 'A'], [17, 8, 'T']]
        let result = board.place(posLetters)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe("Position of one of the tiles is out of bounds (outside the range [0-14])")
    })
    it('Should Place Tiles Given in Correct Format', ()=>{
        let posLetters = [[7, 7, 'A'], [7, 8, 'T']]
        let result = board.place(posLetters)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe("Tiles successfully placed and formed word(s).")
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
        expect(result[1]).toBe(true)
        expect(result[2]).toBe("Tiles successfully placed and formed word(s).")
    })
    it('Should Not Place Tiles Seperated From Main Branch', ()=>{
        let posLetters = [[7, 7, 'A'], [7, 8, 'T']]
        let result = board.place(posLetters)
        posLetters = [[8, 8, 'I'], [9, 8, 'E']]
        result = board.place(posLetters)
        posLetters = [[12, 8, 'T'], [12, 9, 'I'], [12, 10, 'E']]
        result = board.place(posLetters)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe("Word not connected to the main branch!")
    })
    it('Placed Tile Over Tiles Already On Board', ()=>{
        let posLetters = [[7, 7, 'A'], [7, 8, 'T']]
        let result = board.place(posLetters)
        posLetters = [[7, 7, 'I']]
        result = board.place(posLetters)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe("Cannot replace tile on the board.")
    })
    it('Should Place Tiles Either In Same Row Or Same Column', ()=>{
        let posLetters = [[7, 7, 'A'], [7, 8, 'T']]
        let result = board.place(posLetters)
        posLetters = [[8, 8, 'I'],[7, 9, 'O']]
        result = board.place(posLetters)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe("Must place all the tiles in either same row or same column.")
    })
    it('Should Produce Correct Scores', ()=>{
        let posLetters = [[7, 7, 'A'], [7, 8, 'T']]
        let result = board.place(posLetters)
        expect(result[0]).toBe(2)
        posLetters = [[8, 8, 'I'], [9, 8, 'E']]
        result = board.place(posLetters)
        expect(result[0]).toBe(3)
        posLetters = [[7, 9, 'L'], [7, 10, 'A'], [7, 11, 'S']]
        result = board.place(posLetters)
        expect(result[0]).toBe(5)
        posLetters = [[5, 9, 'G'], [6, 9, 'O'], [8, 9, 'O']]
        result = board.place(posLetters)
        expect(result[0]).toBe(6)
    })
    it('Should Give Not Place Tiles When Word Is Not Found In Dictionary',()=>{
        let posLetters = [[5, 7, 'G'], [6, 7, 'O'], [8, 7, 'O'],[7, 7, 'L'],[9, 7, 'S']]
        let result = board.place(posLetters)
        expect(result[1]).toBe(false)
    })
    it('Should Not Accept Broken Words (Ex: CAT  S',()=>{
        let posLetters = [[5, 7, 'C'], [6, 7, 'A'], [7, 7, 'T'],[9, 7, 'S']]
        let result = board.place(posLetters)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe("Broken word.")
        posLetters = [[7, 7, 'C'], [7, 8, 'A'], [7, 9, 'T']]
        result = board.place(posLetters)
        expect(result[1]).toBe(true)
        posLetters = [[5, 9, 'P'], [6, 9, 'A'], [9, 9, 'T']]
        result = board.place(posLetters)
        expect(result[1]).toBe(false)
    })
})