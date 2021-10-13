import PromptSync from "prompt-sync";
import Bag from "./Bag.js"
import Board from "./Board.js"
class Game {
    //initializes the game
    constructor(){
        //a simple structure to store tiles for each player with capacity of 7
        this.loaded = false
        this.scores = [0, 0] //scores for each player (test)
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
        this.load = async ()=>{
            process.stdout.write("\nLoading the game.")
            let loaderAnimation = setInterval(()=>{
                process.stdout.write(".")
            }, 1000)
            context.loaded = await context.board.loadDictionary()
            clearInterval(loaderAnimation)
            if(context.loaded)
                console.log("\nLoading complete!")
            else
                console.log("\nLoading failed.")
        }
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
    start(){
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
                    option = Number(this.prompt())
                    if(option === 1 ){
                        pass = 0
                        if(this.racks.players[i].length<1){
                            option = 0
                            console.log("You don't have anymore tiles. Please select another option.")
                            continue
                        }
                        let numberOfTiles = 0
                        while(numberOfTiles<1||numberOfTiles>this.racks.players[i].length){
                            console.log(`How many tiles would you like to place? [1-${this.racks.players[i].length}]`)
                            numberOfTiles = Number(this.prompt())
                            if(numberOfTiles<1||numberOfTiles>this.racks.players[i].length){
                                console.log("Please enter a number within the valid range.")
                                continue
                            }
                            let indices = [], j
                            for(j=0; j<numberOfTiles; ){
                                console.log(this.racks.players[i])
                                console.log(`Enter the index of the tile ${j+1} from your rack [0-${this.racks.players[i].length-1}]`)
                                let index = this.prompt()
                                index = Number(index)
                                if(index<0||index>this.racks.players[i].length-1){
                                    console.log("Index entered is out of range.")
                                    continue
                                }
                                j++
                                indices.push(index)
                            }
                            let tiles = this.removeTilesFromRack(i, indices), positionTiles = []
                            this.board.show()
                            tiles.forEach((tile)=>{
                                let run = true
                                while(run){
                                    try{
                                        console.log(`Enter the row[0-14] & column[0-14] number where you want to place ${tile} (example: 6, 10)`)
                                        let pos = context.prompt()
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
                                        console.log(e) //remove 
                                        console.log("Incorrect format of placement.")
                                    }
                                }
                            })
                            //test
                            console.log(positionTiles)
                            let result = this.board.place(positionTiles)
                            if(result[1]){
                                this.scores[i]+=result[0]
                                this.bag.replenish(this.racks,i)
                                console.log("Your score is now: "+this.scores[i])
                            }
                            else{
                                console.log(result[2])
                                option = 0
                                continue
                            }
                            this.board.show()
                        }
                    }
                    else if(option === 2 ){
                        pass = 0
                        let numberOfTiles = 0
                        while(numberOfTiles<=0||numberOfTiles>7){
                            console.log("How many tiles would you like to replace? [1-7]")
                            let numberOfTiles = Number(this.prompt())
                            let indices = [], j
                            for(j=0; j<numberOfTiles; ){
                                console.log(this.racks.players[i])
                                console.log(`Enter the index of the tile ${j+1} from your rack [0-${this.racks.players[i].length-1}]`)
                                let index = this.prompt()
                                index = Number(index)
                                if(index<0||index>this.racks.players[i].length-1){
                                    console.log("Index entered is out of range.")
                                    continue
                                }
                                j++
                                indices.push(index)
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
                                numberOfTiles = 0
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
        if(this.scores[0]>this.scores[1]){
            console.log(`Player 1 wins with a score of ${this.scores[0]}!`)
        }
        else if (this.scores[1]>this.scores[0]){
            console.log(`Player 2 wins with a score of ${this.scores[1]}!`)
        }
        else {
            console.log(`You both tied with a score of ${this.scores[0]}!`)
        }
    }
}

export default Game