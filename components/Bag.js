class Bag {

    constructor(){
        this.number = 100
        this.generateAlphabet()
        this.generateTiles()
    }
    generateAlphabet(){
        this.alphabet = []
        for(let i=65; i<91;i++){
            let letter = String.fromCharCode(i)
            this.alphabet.push(letter)
        }
    }
    generateTiles(){
        this.tiles = []
        let frequent = ['A', 'I', 'E', 'O', 'U']
        for(let i=0;i<this.number;i++){
            if(Math.random()<0.3){
                let select = Math.round(Math.random()*4)
                this.tiles.push(frequent[select])
            }
            else{
                let select = Math.round(Math.random()*25)
                this.tiles.push(this.alphabet[select])
            }
        }
    }
    shuffle() {
        //The Fisher–Yates Shuffle
        var l = this.tiles.length, t, i;
        // While there remain elements to shuffle…
        while (l) {
          // Pick a remaining element…
          i = Math.floor(Math.random() * l--);
          // And swap it with the current element.
          t = this.tiles[l];
          this.tiles[l] = this.tiles[i];
          this.tiles[i] = t;
        }
    }
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
    show(){
        console.log(this.tiles)
    }
}

export default Bag