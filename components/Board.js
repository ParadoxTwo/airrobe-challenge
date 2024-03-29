import axios from "axios"
import fs from "fs"

class Board{
    //initializes the board setting all initial values
    constructor(){
        this.board = []
        this.first = true
        this.dictionary = []
        this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        for(let i=0;i<15;i++){
            let row = []
            for(let j=0;j<15;j++){
                row.push("_")
            }
            this.board.push(row)
        }
        let context = this
        /*
        Function to load the dictionary used by the game. It is expected to be in json object format. { "word1": 1, "word2": 1, ...}
        Parameters: void
        Returns: Promise, boolean when fulfilled; true when successfully loaded the game dictionary, false otherwise
        */
        this.loadDictionary = ()=>{
            return new Promise(function(myResolve, myReject) {
                //load the json dictionary 
                //why load online data? because it's easier to add new word to the json file online remotely than to access the local files add word there
                //also, the path could be easily replaced by some other dictionary api path instead of manually downloading a new dictionary and using fs
                let path = "https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json"
                process.stdout.write("\n.")
                axios.get(path)
                .then(json => {
                    let dictionary = Object.keys(json.data)
                    dictionary.forEach((word)=>{
                        context.dictionary.push(word.toUpperCase())
                    })
                    myResolve(true)
                })
                .catch(e=>{
                    console.log('Failed to load dictionary from the internet. Loading locally...')
                    fs.readFile('./data/words_dictionary.json', 'utf8', (err, json) => {
                        if (err) {
                            console.log(`Error reading file: ${err}`);
                            myReject(false)
                        } else {
                            // parse JSON string to JSON object and store keys (words) in dictionary
                            let dictionary = Object.keys(JSON.parse(json))
                            dictionary.forEach((word)=>{
                                context.dictionary.push(word.toUpperCase())
                            })
                            myResolve(true)
                        }
                    });
                })
            })
        }
    }
    /*
    Resets the board efficiently
    Parameters: void
    Returns: void
    */
    reset(){
        this.board = []
        this.first = true
        for(let i=0;i<15;i++){
            let row = []
            for(let j=0;j<15;j++){
                row.push("_")
            }
            this.board.push(row)
        }
    }
    /*
    Places tiles into the board in the specified location
    Parameters: 
        posLetters - A structure comprised of 2D array which stores the desired location (row & column) and the letter to be placed on the board
    Returns: Array holding upto 4 values - 
            number - represents the increase of score due to formation of word(s)
            boolean - true if placement of all tiles succeeds and false otherwise
            string - a message corresponding to success or failure of word formation
            array - a list of words which were successfully
    */
    place(posLetters) { //format of posLetters: [[row, col, letter]...]
        let tempBoard = JSON.parse(JSON.stringify(this.board)), context = this
        let score = 0, center = false, initRow = posLetters[0][0], initCol = posLetters[0][1], rowWise = true, colWise = true, invalid = false, outOfBounds = false, overlap = false
        posLetters.forEach(set=>{
            let row = set[0], col = set[1], letter = set[2]
            if(!this.alphabet.includes(letter))
                invalid = true
            if(row<0||row>14||col<0||col>14)
                outOfBounds = true
        })
        if(invalid)
            return [0, false, "Invalid letter."]
        if(outOfBounds)
            return [0, false, "Position of one of the tiles is out of bounds (outside the range [0-14])"]
        posLetters.forEach(set=>{
            let row = set[0], col = set[1]
            let letter = set[2]
            if(row!==initRow)
                rowWise = false
            if(col!==initCol)
                colWise = false
            if(context.first){
                if(row===7&&col===7){
                    center = true
                }
            }
            if(tempBoard[row][col] ==='_')
                tempBoard[row][col] = letter
            else 
                overlap = true
        })
        
        if(!(rowWise||colWise))
            return [0, false, "Must place all the tiles in either same row or same column."]
        if(overlap)
            return [0, false, "Cannot replace tile on the board."]
        if(!center)
            if(this.first)
                return [0, false, "First word has to be in the center."]
        //check the points row & column
        let wordlist = [], horizontalCheck = true, verticalCheck = true
        if(colWise){
            let row = initRow, col = initCol
            let rowIterator, currentLetter, currentWord
            //check if it's connected to the main branch
            let last = row, first = row
            if(!this.first){
                let connected
                if(!(row-1<0))
                    connected = this.alphabet.includes(tempBoard[row-1][col]) //starting from above 1st element
                posLetters.forEach(set=>{
                    if(connected) return
                    let row = set[0] //7
                    let col = set[1] //5
                    if(row>last)
                        last = row
                    if(!(col-1<0))
                        if(this.alphabet.includes(tempBoard[row][col-1])) //left
                            connected = true
                    if(!(col+1>14))
                        if(this.alphabet.includes(tempBoard[row][col+1])) //right
                            connected = true
                    if(!(row-1<0))
                        if(this.alphabet.includes(context.board[row-1][col])) //above in the original
                            connected = true
                    if(!(row+1>14))
                        if(this.alphabet.includes(context.board[row+1][col])) //below in the original
                            connected = true
                })
                if(!(last+1>14))
                    if(this.alphabet.includes(tempBoard[last+1][col]))
                        connected = true
                
                if(!connected)
                    return [0, false, "Word not connected to the main branch!"]
            }
            //check for columnwise continuity in word
            posLetters.forEach(set=>{
                let row = set[0]
                if(row>last)
                    last = row
                if(row<first)
                    first = row
            })
            for(rowIterator = first+1; rowIterator<last; rowIterator++){
                if(!this.alphabet.includes(tempBoard[rowIterator][col]))
                    return [0, false, "Broken word."]
            }
            //upward to letter (reverse)
            let upward = ""
            rowIterator = 1
            currentLetter = tempBoard[row][col]
            while(this.alphabet.includes(currentLetter)&&!(row - rowIterator<0)){
                currentLetter = tempBoard[row-rowIterator][col]
                if(this.alphabet.includes(currentLetter))
                    upward = currentLetter + upward
                ++rowIterator
            }
            //downward to letter
            let downward = ""
            rowIterator = 1
            currentLetter = tempBoard[row][col]
            while(this.alphabet.includes(currentLetter)&&!(row + rowIterator>14)){
                currentLetter = tempBoard[row+rowIterator][col]
                if(this.alphabet.includes(currentLetter))
                    downward = downward + currentLetter
                ++rowIterator
            }
            //combine up & down -> word
            currentWord = upward + tempBoard[row][col] + downward
            if(this.dictionary.includes(currentWord))
                wordlist.push(currentWord)
            else
                verticalCheck = false
            
            //check horizontally - letterwise
            posLetters.forEach(set=>{
                row = set[0]
                col = set[1]
                let colIterator
                //leftward to letter (reverse)
                let leftward = ""
                colIterator = 1
                currentLetter = tempBoard[row][col]
                while(this.alphabet.includes(currentLetter)&&!(col - colIterator<0)){
                    currentLetter = tempBoard[row][col-colIterator]
                    if(this.alphabet.includes(currentLetter))
                        leftward = currentLetter+leftward
                    ++colIterator
                }
                //rightward to letter
                let rightward = ""
                colIterator = 1
                currentLetter = tempBoard[row][col]
                while(this.alphabet.includes(currentLetter)&&!(col + colIterator>14)){
                    currentLetter = tempBoard[row][col+colIterator]
                    if(this.alphabet.includes(currentLetter))
                        rightward = rightward + currentLetter
                    ++colIterator
                }
                //combine left & right -> word
                if(leftward+rightward!==""){ //nothing to consider if there are no letters either to left or to right
                    currentWord = leftward + tempBoard[row][col] + rightward
                    if(this.dictionary.includes(currentWord))
                        wordlist.push(currentWord)
                    else 
                        horizontalCheck = false
                }
            })
        }
        else if(rowWise){
            let row = initRow, col = initCol
            let colIterator, currentLetter, currentWord
            //check if it's connected to the main branch
            let last = col, first = col
            if(!this.first){
                let connected
                if(!(col-1<0))
                    connected = this.alphabet.includes(tempBoard[row][col-1]) //starting from left of 1st element
                posLetters.forEach(set=>{
                    if(connected) return
                    let row = set[0]
                    let col = set[1]
                    if(col>last)
                        last = col
                    if(!(row-1<0))
                        if(this.alphabet.includes(tempBoard[row-1][col])) //above
                            connected = true
                    if(!(row+1>14))
                        if(this.alphabet.includes(tempBoard[row+1][col])) //below
                            connected = true
                    if(!(col-1<0))
                        if(this.alphabet.includes(context.board[row][col-1])) //left in original
                            connected = true
                    if(!(col+1>14))
                        if(this.alphabet.includes(context.board[row][col+1])) //right in original
                            connected = true
                })
                if(!(last+1>14))
                    if(this.alphabet.includes(tempBoard[row][last+1]))
                        connected = true
                if(!connected)
                    return [0, false, "Word not connected to the main branch!"]
            }
            //check for row wise continuity in word
            posLetters.forEach(set=>{
                let col = set[1]
                if(col>last)
                    last = col
                if(col<first)
                    first = col
            })
            for(colIterator = first+1; colIterator<last; colIterator++){
                console.log(tempBoard[row][colIterator])
                if(!this.alphabet.includes(tempBoard[row][colIterator]))
                    return [0, false, "Broken word."]
            }
            //leftward to letter (reverse)
            let leftward = ""
            colIterator = 1
            currentLetter = tempBoard[row][col]
            while(this.alphabet.includes(currentLetter)&&!(col - colIterator<0)){
                currentLetter = tempBoard[row][col-colIterator]
                if(this.alphabet.includes(currentLetter))
                    leftward = currentLetter+leftward
                ++colIterator
            }

            //rightward to letter
            let rightward = ""
            colIterator = 1
            currentLetter = tempBoard[row][col]
            while(this.alphabet.includes(currentLetter)&&!(col + colIterator>14)){
                currentLetter = tempBoard[row][col+colIterator]
                if(this.alphabet.includes(currentLetter))
                    rightward = rightward + currentLetter
                ++colIterator
            }

            //combine left & right -> word
            currentWord = leftward + tempBoard[row][col] + rightward
            if(this.dictionary.includes(currentWord))
                wordlist.push(currentWord)
            else 
                horizontalCheck = false

            //check vertically - letterwise
            posLetters.forEach(set=>{
                row = set[0]
                col = set[1]
                let rowIterator = 1
                //upward to letter (reverse)
                let upward = ""
                currentLetter = tempBoard[row][col]
                while(this.alphabet.includes(currentLetter)&&!(row - rowIterator<0)){
                    currentLetter = tempBoard[row-rowIterator][col]
                    if(this.alphabet.includes(currentLetter))
                        upward = currentLetter + upward
                    ++rowIterator
                }
                //downward to letter
                let downward = ""
                rowIterator = 1
                currentLetter = tempBoard[row][col]
                while(this.alphabet.includes(currentLetter)&&!(row + rowIterator>14)){
                    currentLetter = tempBoard[row+rowIterator][col]
                    if(this.alphabet.includes(currentLetter))
                        downward = downward + currentLetter
                    ++rowIterator
                }
                //combine up & down -> word
                if(upward+downward!==""){ //nothing to consider if there are no letters either above or below
                    currentWord = upward + tempBoard[row][col] + downward
                    if(this.dictionary.includes(currentWord))
                        wordlist.push(currentWord)
                    else
                        verticalCheck = false
                }
            })
        }
        //validating final checks
        if(!verticalCheck)
            return [0, false, "One of the columns doesn't form a word."]
        if(!horizontalCheck)
            return [0, false, "One of the rows doesn't form a word."]

        //scoring
        if(horizontalCheck&&verticalCheck){
            wordlist.forEach(word=>{
                score+=word.length
            })
        }
        this.board = tempBoard
        this.first = false
        return [score, true, "Tiles successfully placed and formed word(s).", wordlist]
    }
    /*
    Prints the board in a console level appealing manner for ease of positioning
    Parameters: void
    Returns: void
    */
    show(){
        console.log("    __ __ __ __start of board_ __ __ __ __ __ __ ")
        console.log("    0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 ")
        console.log("    __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ ")
        this.board.forEach((row, i)=>{
            if(i<10)
                process.stdout.write(i+"  |")
            else
                process.stdout.write(i+" |")
            row.forEach((cell)=>{
                process.stdout.write(cell+"_|")
            })
            console.log()
        })
        console.log("    __ __ __ __ end of board_ __ __ __ __ __ __ ")
    }
}

export default Board