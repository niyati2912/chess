import { useState } from "react";
import Square from "./Square";

function Board() {

    const [selectedSquare, setSelectedSquare] = useState(null);

    const [board, setBoard] = useState([
    "♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜",
    "♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟",

    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,

    "♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙",
    "♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"
]);

    function handleSquareClick(index) {

    if (selectedSquare === null) {

        if (board[index] !== null) {
            setSelectedSquare(index);
        }

    } else {

        const newBoard = [...board];

        newBoard[index] = newBoard[selectedSquare];
        newBoard[selectedSquare] = null;

        setBoard(newBoard);
        setSelectedSquare(null);
    }
}

    const squares = [];

    for (let i = 0; i < 64; i++) {

        const row = Math.floor(i / 8);
        const col = i % 8;
        const isLight = (row + col) % 2 === 0;

        squares.push(
            <Square
                key={i}
                index={i}
                piece={board[i]}
                isLight={isLight}
                selected={selectedSquare === i}
                onClick={() => handleSquareClick(i)}
            />
        );
    }

    return (
        <>
            <h2 style={{ textAlign: "center" }}>
                Selected Square: {selectedSquare}
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(8, 60px)",
                    width: "fit-content",
                    margin: "20px auto"
                }}
            >
                {squares}
            </div>
        </>
    );
}

export default Board;