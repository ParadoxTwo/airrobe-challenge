import PromptSync from "prompt-sync";
import Bag from "./Bag.js"
import Board from "./Board.js"
class Game {
    //initializes the game
    constructor(){
        //a simple structure to store tiles for each player with capacity of 7
        this.loaded = false
        this.scores = [0, 0] //scores for each player
        this.racks = {
            capacity: 7,
            players: [[],[]], //2 players, 2 player racks
        }
        this.board = new Board() 
        this.bag = new Bag()
        this.bag.replenish(this.racks, 0)
        this.bag.replenish(this.racks, 1)
        this.prompt = PromptSync({sigint: true})
        let context = this
        /*
        Loads the dictionary for the game while generating a simple loading animation
        Parameters: void
        Returns: boolean, true if the dictionary successfully loads and false otherwise
        */
        this.load = async ()=>{
            process.stdout.write("\nLoading the game.")
            let loaderAnimation = setInterval(()=>{
                process.stdout.write(".")
            }, 1000)
            context.loaded = await context.board.loadDictionary()
            clearInterval(loaderAnimation)
            if(context.loaded){
                console.log("\nLoading complete!")
                return true
            }
            else{
                console.log("\nLoading failed.")
                return false
            }
        }
    }
    //resets the game (more efficient than creating a new game)
    reset(){
        this.scores = [0, 0] //scores for each player
        this.racks = {
            capacity: 7,
            players: [[],[]], //2 players, 2 player racks
        }
        this.board.reset()
        this.bag.generateTiles()
        this.bag.replenish(this.racks, 0)
        this.bag.replenish(this.racks, 1)
    }
    //method to remove and return tiles of given indices from the rack of given players
    removeTilesFromRack(player = 0, indices = []){
        let removed = [], newRack = []
        for(let i=0;i<this.racks.players[player].length;i++){
            if(indices.includes(i))
                removed.push(this.racks.players[player][i])
            else{
                newRack.push(this.racks.players[player][i])
            }
        }
        this.racks.players[player] = newRack
        return removed
    }
    /*
    for reference
    testParams = { //could be set & changed however.
        optIter: 0, //for iterating through options of multiple turns
        option: [],
        currentTileIndex: 0, //kinda similar to j but can be different. for iterating through tile indices that need to be placed on board
        tileIndices: [],
        letterPosIter: 0, //for iterating through letterPos
        letterPos: [],
        rTileIndex: 0, //for iterating through tile indices that need to be replaced
        rTileIndices: [],
    }
    */
    //starts the game. test and testParams must only be used during testing.
    start(test=false, testParams){
        console.log("This is a turn based game between 2 players.\nIf both players pass, the game will end.\n")
        this.board.show()
        let context = this, pass = 0
        while(pass<2){
            for(let i=0;i<2&&pass<2;i++){ //one turn each
                console.log(`Player ${i+1}'s Turn\nYour rack:`)
                console.log(this.racks.players[i])
                let option = 0
                while(option<1||option>3){
                    console.log(`What action would you like to take?\n1. Place Tiles\n2. Replace Tiles From Bag\n3. Pass`)
                    if(test)
                        option = testParams.option[testParams.optIter++]
                    else
                        option = Number(this.prompt())
                    if(option === 1 ){
                        pass = 0
                        if(this.racks.players[i].length<1){
                            option = 0
                            console.log("You don't have anymore tiles. Please select another option.")
                            continue
                        }
                        let run = true
                        while(run){
                            console.log(this.racks.players[i])
                            console.log(`Enter the indices of the tiles you want to place from your rack [1-${this.racks.players[i].length}] (example: 1, 5, 2, 7)`)
                            let indices //index = testParams.rTileIndices[testParams.rTileIndex++]
                            try{
                                if(test)
                                    indices = JSON.parse('['+testParams.tileIndices[testParams.currentTileIndex++]+']')
                                else
                                    indices = JSON.parse('['+this.prompt()+']')
                            }
                            catch(e){
                                console.log("Incorrect format.")
                                continue
                            }
                            let unique = true, inRange = true
                            for(let j=0;j<indices.length;j++){
                                for(let k=0;k<indices.length;k++){
                                    if(!j===k)
                                        if(indices[j]===indices[k])
                                            unique = false
                                }
                                if(indices[j]<1||indices[j]>this.racks.players[i].length)
                                    inRange = false
                            }
                            for(let j=0;j<indices.length;j++)
                                indices[j]-- //subtracting 1 to make it computer readable index
                            
                            if(!unique){
                                console.log("You have one or more repeating tiles. Please select again.")
                                continue
                            }
                            if(!inRange){
                                console.log(`One of the indices is out of range [1-${this.racks.players[i].length}].`)
                                continue
                            }
                            let tiles = this.removeTilesFromRack(i, indices), positionTiles = []
                            this.board.show()
                            tiles.forEach((tile)=>{
                                let run = true
                                while(run){
                                    try{
                                        console.log(`Enter the row[0-14] & column[0-14] number where you want to place ${tile} (example: 6, 10)`)
                                        let pos
                                        if(test)
                                            pos = testParams.letterPos[testParams.letterPosIter++]
                                        else
                                            pos = context.prompt()
                                        let posTile = JSON.parse('['+pos+']')
                                        run = false
                                        posTile.forEach(i=>{
                                            if(i<0||i>14){
                                                run = true
                                                console.log("Row or column number out of the range [0-14].")
                                            }
                                        })
                                        if(!run){
                                            posTile.push(tile)
                                            positionTiles.push(posTile)
                                        }
                                        
                                    }
                                    catch(e){
                                        console.log("Incorrect format of placement.")
                                    }
                                }
                            })
                            let result = this.board.place(positionTiles)
                            if(result[1]){
                                this.scores[i]+=result[0]
                                console.log(result[2])
                                console.log(result[3])
                                this.bag.replenish(this.racks,i)
                                console.log("Your score is now: "+this.scores[i])
                                console.log("Your rack has been replenished")
                                console.log(this.racks.players[i])
                                run = false
                            }
                            else{
                                positionTiles.forEach(posTile=>{
                                    this.racks.players[i].push(posTile[2]) // putting the tile back into the player's rack
                                })
                                console.log(result[2])
                                option = 0
                                continue
                            }
                            this.board.show()
                        }
                    }
                    else if(option === 2 ){
                        pass = 0
                        let run = true
                        while(run){
                            console.log(this.racks.players[i])
                            console.log(`Enter the indices of the tiles you want to replace from your rack [1-${this.racks.players[i].length}] (example: 1, 5, 2, 7)`)
                            let indices
                            try{
                                if(test)
                                    indices = JSON.parse('['+testParams.rTileIndices[testParams.rTileIndex++]+']')
                                else
                                    indices = JSON.parse('['+this.prompt()+']')
                            }
                            catch(e){
                                console.log("Incorrect format.")
                                continue
                            }
                            let unique = true, inRange = true
                            for(let j=0;j<indices.length;j++){
                                for(let k=0;k<indices.length;k++){
                                    if(!j===k)
                                        if(indices[j]===indices[k])
                                            unique = false
                                }
                                if(indices[j]<1||indices[j]>this.racks.players[i].length)
                                    inRange = false
                            }
                            for(let j=0;j<indices.length;j++)
                                indices[j]-- //subtracting 1 to make it computer readable index
                            
                            if(!unique){
                                console.log("You have one or more repeating tiles. Please select again.")
                                continue
                            }
                            if(!inRange){
                                console.log(`One of the indices is out of range [1-${this.racks.players[i].length}].`)
                                continue
                            }
                            console.log('These tiles will be replaced randomly from the bag:')
                            console.log(indices)
                            if(this.bag.replaceTiles(this.racks, i, indices)){
                                console.log("Successfully replaced the tiles")
                                console.log(this.racks.players[i])
                                break
                            }
                            else{
                                console.log("Failed to replace the specified tiles.")
                            }
                        }
                    }
                    else if(option === 3){
                        pass+=1
                        console.log(`You have passed your turn.`)
                        if(pass===1)
                            console.log(`If Player ${((i+1)%2)+1} passes, the game will end.`)
                    }
                    else{
                        pass = 0
                        console.log("Incorrect option. Select again.")
                    }
                }
            }
        }
        console.log("GAME OVER!!")
        if(this.scores[0]>this.scores[1]){
            console.log(`Player 1 wins with a score of ${this.scores[0]}!`)
            console.log(`Player 2 scored ${this.scores[1]}`)
        }
        else if (this.scores[1]>this.scores[0]){
            console.log(`Player 2 wins with a score of ${this.scores[1]}!`)
            console.log(`Player 1 scored ${this.scores[0]}`)
        }
        else {
            console.log(`You both tied with a score of ${this.scores[0]}!`)
        }
    }
}

export default Game