import Game from "./components/Game.js";

let game = new Game()
if(await game.load())
    game.start()