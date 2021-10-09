class Bag {

    constructor(){
        this.number = 100
        this.generateAlphabet()
        this.generateTiles()
    }
    generateAlphabet(){
        this.alphabet = []
        for(let i=65; i<=91;i++){
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
          t = array[l];
          array[l] = array[i];
          array[i] = t;
        }
    }
    replenish(racks, player){
        let i=racks.players[player].length
        if(i===racks.capacity) return false

        for(;i<racks.capacity;i++){
            if(this.tiles.length>0){
                racks.players[player].push(this.tiles.pop())
            }
            else return false
        }
        return true
    }
    show(){
        console.log(this.tiles)
    }
}

export default Bag