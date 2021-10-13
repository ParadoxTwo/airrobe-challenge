class Bag {

    constructor(){
        this.number = 100
        this.alphabet = []
        //Using official number of tiles of each kind except for E & I which are one more each instead of 2 jokers
        this.alphabetCounts = {'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 13, 'F': 2, 'G': 3, 'H': 2, 'I': 10, 'J': 1, 'K':1, 'L':4, 'M':2, 'N':6, 'O':8, 'P':2, 'Q':1, 'R':6, 'S':4, 'T':6, 'U':4, 'V':2, 'W':2, 'X':1, 'Y':2, 'Z':1}
        this.generateTiles()
        this.shuffle()
    }
    /*
    Randomly generates tiles for the bag
    Parameters: void
    Return: void
    */
    generateTiles(){
        this.tiles = []
        let counts = this.alphabetCounts
        for(let letter of Object.keys(counts)){
            this.alphabet.push(letter)
            for(let count=0;count<counts[letter];count++)
                this.tiles.push(letter)
        }
    }
    /*Shuffles the bag of tiles
    Parameters: void
    Return: void
    */
    shuffle() {
        //The Fisher–Yates Shuffle
        var l = this.tiles.length, t, i;
        
        while (l) {
          i = Math.floor(Math.random() * l--);
          t = this.tiles[l];
          this.tiles[l] = this.tiles[i];
          this.tiles[i] = t;
        }
    }
    /*
    Replaces the given indices of tiles from a player's rack with random tiles from the bag
    Parameters: 
        racks - the racks object which has a specific structure 
        {
            capacity: 7,
            players: [[],[]],
        }
        player - the player number which could be either 0 or 1
        indices - the list of indices which needs to be replaced from bag
    Return: boolean, true if operation succeeds and false otherwise
    */
    replaceTiles(racks, player, indices){
        let returnValue = true
        indices.forEach(index=>{ //if the given indices don't exist, return false
            if(racks.players[player][index] === undefined)
                returnValue = false
        })
        if(!returnValue) return returnValue
        //push letters of the indices from racks.player[player] into the tiles
        //shuffle
        //pop from tiles for each index in indices and replace it in the player stack
        indices.forEach(index => {
            this.tiles.push(racks.players[player][index])
        });
        this.shuffle()
        indices.forEach(index=>{
            racks.players[player][index] = this.tiles.pop()
        })
        return true

    }
    /*
    Replenishes a player's rack of tiles to the specified capacity of 7
    Parameters: 
        racks - the racks object which has a specific structure 
        {
            capacity: 7,
            players: [[],[]],
        }
        player - the player whose rack needs to be replenished with tiles
    Return: boolean, true if operation succeeds and false otherwise
    */
    replenish(racks, player){
        let i=racks.players[player].length
        let returnValue = false
        if(i===racks.capacity) return returnValue
        for(;i<racks.capacity;i++){
            if(this.tiles.length>0){
                racks.players[player].push(this.tiles.pop())
                returnValue = true
            }
            else return returnValue
        }
        return true
    }
    /*
    Shows the bag of tiles
    Parameters: void
    Return: void
    */
    show(){
        console.log(this.tiles)
    }
}

export default Bag