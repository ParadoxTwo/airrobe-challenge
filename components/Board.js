import axios from "axios"
class Board{
    constructor(){
        this.board = []
        this.dictionary = []
        for(let i=0;i<15;i++){
            let row = []
            for(let j=0;j<15;j++){
                row.push("_")
            }
            this.board.push(row)
        }
    }
    loadDictionary() {
        let context = this
        return new Promise(function(myResolve, myReject) {
            //load the json dictionary 
            //why load online data? because it's easier to add new word to the json file online remotely than to access the local files add word there
            //also, the path could be easily replaced by some other dictionary api path instead of manually downloading a new dictionary and using fs
            let path = "https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json"
            axios.get(path)
            .then(json => {
                context.dictionary = Object.keys(json.data)
                myResolve()
            })
            .catch(e=>{
                console.error(e)
                myReject("Failed to Load Dictionary")
            })
        })
    }
    place(posLetters) { //format of posLetters: [row, col, letter]
        let temp = JSON.parse(JSON.stringify(this.board))
        let score = 0;
        posLetters.forEach(set=>{
            let row = set[0], col = set[1]
            let letter = set[2]
            if(temp[row][col] ==='_')
                temp[row][col] = letter
            else 
                score = -1
        })
        if(score===-1)
            return false
        //check the points row & column


    }
    show(){
        //add pointers for row and column as well
        console.log(" _ _ _ _start of board _ _ _ _ ")
        console.log(" _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ")
        this.board.forEach((row)=>{
            process.stdout.write("|");
            row.forEach((cell)=>{
                process.stdout.write(cell+"|")
            })
            console.log()
        })
        console.log(" _ _ _ _ end of board_ _ _ _ _ ")
    }
}

export default Board