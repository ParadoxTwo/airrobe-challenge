/*
    To support ES6 in jest:
    Had to configure babel by installing
    babel-jest @babel/preset-env
    and creating babel.config.json file with data:
    {
        "presets": ["@babel/preset-env"]
    }
*/
import Bag from "../components/Bag.js"
describe('Functional & Integration Tests for Bag', () => {
    let bag
    let az = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let racks
    beforeEach(()=>{
        bag = new Bag()
        racks = {
            capacity: 7,
            players: [[],[]],
        }
    })
    it('Should Initialize', () => {
        expect(bag.number).toBe(100)
        expect(bag.alphabet.length).toBe(26)
        expect(bag.tiles).toBeTruthy()
    });

    it('Should Have All Alphbet', ()=>{
        bag.alphabet.forEach((letter, i)=>{
            expect(letter).toBe(az[i])
        })
    })

    it('Should Have Tiles Containing Letters', ()=>{
        bag.tiles.forEach((letter)=>{
            expect(az).toContain(letter)
        })
    })

    it('generateTiles() Should Generate New Tiles', ()=>{
        let currentTiles = bag.tiles.slice(0)
        expect(JSON.stringify(currentTiles)===JSON.stringify(bag.tiles)).toBe(true)
        bag.generateTiles()
        expect(JSON.stringify(currentTiles)===JSON.stringify(bag.tiles)).toBe(false)
        bag.tiles.forEach((letter)=>{
            expect(az).toContain(letter)
        })
    })

    it('shuffle() Should Shuffle Tiles', ()=>{
        let currentTiles = bag.tiles.slice(0)
        expect(JSON.stringify(currentTiles)===JSON.stringify(bag.tiles)).toBe(true)
        bag.shuffle()
        expect(JSON.stringify(currentTiles)===JSON.stringify(bag.tiles)).toBe(false)
        bag.tiles.forEach((letter)=>{
            expect(az).toContain(letter)
        })
    })
    
    it('replenish() Should Replenish Player\'s Rack',()=>{
        expect(racks.players[0].length).toBeLessThan(7)
        bag.replenish(racks, 0) //for player 1  (indexing starts with 0)
        expect(racks.players[0].length).toBe(7)
        expect(racks.players[1].length).toBeLessThan(7)
        bag.replenish(racks, 1) //for player 1  (indexing starts with 0)
        expect(racks.players[1].length).toBe(7)
    })
    it('replenish() Should Remove Tiles From The Bag', ()=>{
        bag.replenish(racks, 0)
        expect(bag.tiles.length).toBe(100-7)
    })
    it('replenish() Should Not Replenish When Tiles Run Out', ()=>{
        //initially 100 tiles. Each player rack has capacity of 7.
        //To run out, a player rack has to be replenished fully 14 times (7*14=98) and then once more to be left with 2 tiles in the rack.
        for(let i=0; i<14; i++){ //14 times complete replenishing and emptying
            bag.replenish(racks, 0)
            racks.players[0] = []
        }
        expect(bag.replenish(racks, 0)).toBe(true) //replish possible one more time
        expect(racks.players[0].length).toBe(2) // the last 2 tiles should be in the rack after replenishing
        expect(bag.replenish(racks, 0)).toBe(false) //no more tiles left, therefore replenish should fail
    })
    it('shuffle() Should Shuffle Even With Decreased Tiles in The Bag', ()=>{
        bag.replenish(racks, 0)
        let currentTiles = bag.tiles.slice(0)
        expect(JSON.stringify(currentTiles)===JSON.stringify(bag.tiles)).toBe(true)
        bag.shuffle()
        expect(JSON.stringify(currentTiles)===JSON.stringify(bag.tiles)).toBe(false)
        bag.tiles.forEach((letter)=>{
            expect(az).toContain(letter)
        })
    })
    it('replaceTiles() Should Replace Given Indices of Rack with Tiles From The Bag', ()=>{
        bag.replenish(racks, 0) //just having something in the racks
        expect(bag.replaceTiles(racks, 0, [1, 3, 5])).toBe(true)
        let replaced = false, iterations = 50
        //going through each index replacing multiple times 
        //so that even if the replaced letter is same, it probably won't remain the same after couple of times
        for(let i=0; i< iterations; i++){
            let rackCopy = racks.players[0].slice(0)
            bag.replaceTiles(racks, 0, [1, 3, 5])
            if(racks.players[0][1]!==rackCopy[1]&&racks.players[0][3]!==rackCopy[3]&&racks.players[0][5]!==rackCopy[5]){
                replaced = true
                break;
            }
        }
        expect(replaced).toBe(true)
    })
    it('replaceTiles() Should Not Replace Out of Bounds Indices of Rack with Tiles From The Bag', ()=>{
        bag.replenish(racks, 0) //just having something in the racks
        expect(bag.replaceTiles(racks, 0, [1, 3, 9])).toBe(false)
    })
});