/*
    To support ES6 in jest:
    Had to configure babel by installing
    babel-jest @babel/preset-env
    and creating babel.config.json file with data:
    {
        "presets": ["@babel/preset-env"]
    }
*/
// import Board from "../components/Board.js"
import Bag from "../components/Bag.js"
describe('Unit Tests for Bag', () => {
    it('Should Initialize', () => {
        const bag = new Bag()
        expect(bag.number).toBe(100)
    });
});