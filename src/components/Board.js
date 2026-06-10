import { useState } from "react";
import Square from "./Square";

function Board() {

    const [selectedSquare, setSelectedSquare] = useState(null);

    const squares = [];

    for (let i = 0; i < 64; i++) {

        const row = Math.floor(i / 8);
        const col = i % 8;
        const isLight = (row + col) % 2 === 0;

        squares.push(
            <Square
                key={i}
                index={i}
                isLight={isLight}
                selected={selectedSquare === i}
                onClick={() => setSelectedSquare(i)}
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