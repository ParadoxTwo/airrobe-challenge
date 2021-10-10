import Board from "../components/Board.js"

describe('Functional & Integration Tests for Board',()=>{
    let board
    let racks
    beforeEach(()=>{
        board = new Board()
        racks = {
            capacity: 7,
            players: [[],[]],
        }
    })
    it('Should Initialize', () => {
        expect(board.board.length).toBeGreaterThan(0)
    });
    it('Should Load Dictionary', ()=>{
        board.loadDictionary().then(()=>{
            expect(board.dictionary.length).toBeGreaterThan(0)
        }).catch(err=>{
            console.log(err)
        })
    })
})