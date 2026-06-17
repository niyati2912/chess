import { useMemo, useState, useEffect } from "react";
import { Chess } from "chess.js";
import Square from "./Square";

const pieceSymbols = {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    P: "♙",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

function toSquare(index) {
    return files[index % 8] + ranks[Math.floor(index / 8)];
}

function Board() {
    const [fen, setFen] = useState(new Chess().fen());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [legalMoves, setLegalMoves] = useState([]);

    const [whiteTime, setWhiteTime] = useState(600);
    const [blackTime, setBlackTime] = useState(600);

    const [paused, setPaused] = useState(false);

    const game = useMemo(() => new Chess(fen), [fen]);
    const board = useMemo(() => game.board().flat(), [game]);

    useEffect(() => {
    if (paused) return;

    if (game.isGameOver()) return;

    const interval = setInterval(() => {
        if (game.turn() === "w") {
            setWhiteTime(prev => Math.max(prev - 1, 0));
        } else {
            setBlackTime(prev => Math.max(prev - 1, 0));
        }
    }, 1000);

    return () => clearInterval(interval);

}, [fen, game, paused]);

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    const timeoutMessage =
        whiteTime === 0
            ? "⏰ Time Out! Black Wins!"
            : blackTime === 0
            ? "⏰ Time Out! White Wins!"
            : null;

    const status = game.isCheckmate()
        ? `🏆 Checkmate! ${game.turn() === "w" ? "Black" : "White"} Wins`
        : game.isStalemate()
        ? "Draw by Stalemate"
        : game.isDraw()
        ? "Draw"
        : game.inCheck()
        ? `${game.turn() === "w" ? "White" : "Black"} is in Check`
        : `${game.turn() === "w" ? "White" : "Black"} to Move`;

    function getLegalMoves(index) {
        return game
            .moves({
                square: toSquare(index),
                verbose: true,
            })
            .map(move => move.to);
    }

    function handleSquareClick(index) {
        if (game.isGameOver()) return;
        if (whiteTime === 0 || blackTime === 0) return;

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

            next.move({
                from: toSquare(selectedSquare),
                to: squareName,
            });

            setFen(next.fen());
        }

        setSelectedSquare(null);
        setLegalMoves([]);
    }

    const squares = board.map((piece, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;

        return (
            <Square
                key={i}
                isLight={(row + col) % 2 === 0}
                selected={selectedSquare === i}
                highlighted={legalMoves.includes(toSquare(i))}
                piece={
                    piece
                        ? pieceSymbols[
                            piece.color === "w"
                                ? piece.type.toUpperCase()
                                : piece.type
                        ]
                        : null
                }
                isWhitePiece={piece?.color === "w"}
                onClick={() => handleSquareClick(i)}
            />
        );
    });

    
    return (
        <>
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
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

                <div
    style={{
        display: "flex",
        gap: "12px",
        marginTop: "18px",
    }}
>
    <button
        onClick={() => {
            setFen(new Chess().fen());
            setSelectedSquare(null);
            setLegalMoves([]);
            setWhiteTime(600);
            setBlackTime(600);
            setPaused(false);
        }}
        style={{
            padding: "10px 25px",
            border: "none",
            borderRadius: "8px",
            background: "#eb2592",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
        }}
    >
        New Game
    </button>

    <button
        onClick={() => setPaused(!paused)}
        style={{
            padding: "10px 25px",
            border: "none",
            borderRadius: "8px",
            background: paused ? "#16a34a" : "#dc2626",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
        }}
    >
        {paused ? "Resume" : "Pause"}
    </button>
</div>

                <div
                style={{ position: "fixed",
                    right: "40px",
                    top: "120px",

                    width: "150px",
                    height: "260px",

                    background: "#222",
                    borderRadius: "12px",
                    overflow: "hidden",

                    display: "flex",
                    flexDirection: "column",

                    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                }}
                >
                    <div
                        style={{
                            flex: 1,
                            background:
                                game.turn() === "b" ? "#444" : "#222",
                            color: "white",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div>BLACK</div>
                        <div
                            style={{
                                fontSize: "30px",
                                fontWeight: "bold",
                            }}
                        >
                            {formatTime(blackTime)}
                        </div>
                    </div>

                    <div
                        style={{
                            height: "2px",
                            background: "#555",
                        }}
                    />

                    <div
                        style={{
                            flex: 1,
                            background:
                                game.turn() === "w"
                                    ? "#ffffff"
                                    : "#e5e5e5",
                            color: "#111",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div>WHITE</div>
                        <div
                            style={{
                                fontSize: "30px",
                                fontWeight: "bold",
                            }}
                        >
                            {formatTime(whiteTime)}
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{
                    textAlign: "center",
                    marginTop: "15px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    color:
                        timeoutMessage ||
                        game.isCheckmate()
                            ? "#d32f2f"
                            : "#555",
                }}
            >
                {timeoutMessage || status}
            </div>
        </>
    );
}

export default Board;