import Game from "./components/Game.js";

let game = new Game()
await game.load()
game.start()