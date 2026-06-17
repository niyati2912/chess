import { useMemo, useState, useEffect } from "react";
import { Chess } from "chess.js";
import Square from "./Square";

const pieceSymbols = {
    p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔",
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

function toSquare(index) {
    return files[index % 8] + ranks[Math.floor(index / 8)];
}

function Board() {
    const [fen, setFen] = useState(() => new Chess().fen());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [legalMoves, setLegalMoves] = useState([]);

    const game = useMemo(() => new Chess(fen), [fen]);
    const board = useMemo(() => game.board().flat(), [game]);

    const [whiteTime, setWhiteTime] = useState(600);
    const [blackTime, setBlackTime] = useState(600);

    const status = game.isCheckmate()
        ? `Checkmate — ${game.turn() === "w" ? "Black" : "White"} wins`
        : game.isStalemate()
        ? "Stalemate"
        : game.isDraw()
        ? "Draw"
        : game.inCheck()
        ? `${game.turn() === "w" ? "White" : "Black"} is in check`
        : `${game.turn() === "w" ? "White" : "Black"} to move`;

    function getLegalMoves(index) {
        return game
            .moves({ square: toSquare(index), verbose: true })
            .map(m => m.to);
    }

    function handleSquareClick(index) {
        if (game.isGameOver()) return;

        const piece = board[index];
        const squareName = toSquare(index);

        if (selectedSquare === null) {
            if (piece && piece.color === game.turn()) {
                setSelectedSquare(index);
                setLegalMoves(getLegalMoves(index));
            }
            return;
        }

        if (index === selectedSquare) {
            setSelectedSquare(null);
            setLegalMoves([]);
            return;
        }

    
        if (piece && piece.color === game.turn()) {
            setSelectedSquare(index);
            setLegalMoves(getLegalMoves(index));
            return;
        }

        if (legalMoves.includes(squareName)) {
            const next = new Chess(fen);
            next.move({ from: toSquare(selectedSquare), to: squareName });
            setFen(next.fen());
        }

        setSelectedSquare(null);
        setLegalMoves([]);
    }

    const squares = board.map((piece, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const squareName = toSquare(i);

        //chess timer 
    const [whiteTime, setWhiteTime] = useState(600);
    const [blackTime, setBlackTime] = useState(600);

    useEffect(() => {

    if (game.isGameOver()) return;

    if (whiteTime <= 0 || blackTime <= 0) return;

    const timer = setInterval(() => {

        if (game.turn() === "w") {
            setWhiteTime(prev => Math.max(prev - 1, 0));
        } else {
            setBlackTime(prev => Math.max(prev - 1, 0));
        }

    }, 1000);

    return () => clearInterval(timer);

}, [fen, whiteTime, blackTime]);

    function formatTime(seconds) {

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

        return (
            <Square
                key={i}
                isLight={(row + col) % 2 === 0}
                selected={selectedSquare === i}
                highlighted={legalMoves.includes(squareName)}
                piece={piece ? pieceSymbols[piece.color === "w" ? piece.type.toUpperCase() : piece.type] : null}
                isWhitePiece={piece?.color === "w"}
                onClick={() => handleSquareClick(i)}
            />

        );

    }

    


);

return (
    <>
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "20px",
                marginTop: "20px"
            }}
        >

            {/* BOARD */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(8, 80px)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
                        borderRadius: "8px",
                        overflow: "hidden",
                    }}
                >
                    {squares}
                </div>

                <button
                    onClick={() => {
                        setFen(new Chess().fen());
                        setSelectedSquare(null);
                        setLegalMoves([]);
                        
                        setWhiteTime(600);
                        setBlackTime(600);
                    }}
                    style={{
                        marginTop: "18px",
                        padding: "10px 25px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#2563eb",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >
                    New Game
                </button>
            </div>

            {/* CHESS CLOCK */}
            <div
                style={{
                    width: "120px",
                    height: "220px",
                    background: "#222",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                <div
                    style={{
                        flex: 1,
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <div
                        style={{
                            fontSize: "12px",
                            letterSpacing: "1px"
                        }}
                    >
                        BLACK
                    </div>

                    <div
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold"
                        }}
                    >
                        {formatTime(blackTime)}
                    </div>
                </div>

                <div
                    style={{
                        height: "2px",
                        background: "#555"
                    }}
                />

                        <div
                                style={{
                                        flex: 1,
                                        background: game.turn() === "b"
                                                            ? "#444"
                                                            : "#222",
                                        color: "white",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        transition: "0.3s"
    }}
>
                    <div
                        style={{
                            fontSize: "12px",
                            letterSpacing: "1px"
                        }}
                    >
                        WHITE
                    </div>

                    <div
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold"
                        }}
                    >
                        {formatTime(whiteTime)}
                    </div>
                </div>

            </div>

        </div>

        <div
    style={{
        flex: 1,
        background: game.turn() === "w"
            ? "#ffffff"
            : "#e5e5e5",
        color: "#111",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "0.3s"
    }}
>
            {status}
        </div>
    </>
);
}

export default Board;