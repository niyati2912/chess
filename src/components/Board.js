// src/components/Board.js
import { useState, useEffect, useMemo, useRef } from "react";
import { Chess } from "chess.js";
import Square from "./Square";
import chessBg from "../chess.jfif";

const pieceSymbols = {
    p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔",
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

function toSquare(index) {
    return files[index % 8] + ranks[Math.floor(index / 8)];
}

const THEMES = {
    light: {
        "--board-border": "#6b4423",
        "--accent": "#3f6b4f",
        "--accent-soft": "#7c9b85",
        "--panel-bg": "rgba(250, 244, 230, 0.95)",
        "--panel-text": "#2c2117",
        "--panel-border": "rgba(107, 68, 35, 0.22)",
        "--bg-overlay": "rgba(250, 244, 230, 0.78)",
        "--brown": "#8b5e34",
        "--brown-dark": "#6b4423",
    },
    dark: {
        "--board-border": "#1c1410",
        "--accent": "#4a8a63",
        "--accent-soft": "#3a5c45",
        "--panel-bg": "rgba(38, 30, 22, 0.95)",
        "--panel-text": "#f1e9da",
        "--panel-border": "rgba(241, 233, 218, 0.12)",
        "--bg-overlay": "rgba(20, 14, 10, 0.6)",
        "--brown": "#6b4a2c",
        "--brown-dark": "#3e2723",
    },
};

function playTone(freq, duration = 150, type = "sine") {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration / 1000);
    } catch (e) {}
}

function playSound(kind) {
    if (kind === "move") playTone(440, 90);
    else if (kind === "capture") playTone(220, 140);
    else if (kind === "check") playTone(660, 200, "triangle");
    else if (kind === "gameover") {
        playTone(523, 150);
        setTimeout(() => playTone(392, 150), 150);
        setTimeout(() => playTone(330, 250), 300);
    }
}

const boardStyles = `
* { box-sizing: border-box; }
.chess-app-wrapper { position: relative; min-height: 100vh; width: 100%; overflow-x: hidden; }
.bg-image { position: fixed; inset: 0; background-size: cover; background-position: center; z-index: 0; }
.bg-overlay { position: fixed; inset: 0; background: var(--bg-overlay); z-index: 1; }

.theme-toggle { position: fixed; top: 20px; left: 40px; z-index: 6; display: flex; background: var(--panel-bg); border: 1px solid var(--panel-border); border-radius: 22px; padding: 5px; gap: 5px; box-shadow: 0 6px 18px rgba(0,0,0,0.18); }
.theme-toggle-btn { padding: 8px 16px; border: none; border-radius: 18px; cursor: pointer; font-size: 24px; line-height: 1; background: transparent; opacity: 0.5; transition: all 0.15s ease; }
.theme-toggle-btn.active { background: var(--accent); opacity: 1; }

.game-layout { display: flex; justify-content: center; align-items: flex-start; gap: 28px; position: relative; z-index: 2; padding: 110px 24px 50px; flex-wrap: wrap; }
.side-column { display: flex; flex-direction: column; gap: 14px; width: 200px; }

.timer-panel { width: 100%; height: 240px; background: var(--panel-bg); border: 1px solid var(--panel-border); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 28px rgba(0,0,0,0.2); }
.clock-box { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; transition: background 0.3s ease; }
.black-clock { background: #2a2a2a; }
.white-clock { background: #e8e2d6; color: #2c2117; }
.clock-box.active.black-clock { background: #454545; }
.clock-box.active.white-clock { background: #fdfaf3; }
.clock-time { font-size: 30px; font-weight: bold; margin-top: 4px; }
.clock-divider { height: 2px; background: var(--brown); opacity: 0.4; }

.mode-toggle { display: flex; flex-direction: column; gap: 10px; }
.mode-btn { width: 100%; padding: 14px 16px; border: 2px solid var(--brown); border-radius: 12px; background: transparent; color: var(--panel-text); font-weight: 700; font-size: 15px; cursor: pointer; transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease; }
.mode-btn:hover { transform: translateY(-2px); }
.mode-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

.move-history-panel { width: 100%; max-height: 340px; background: var(--panel-bg); border: 1px solid var(--panel-border); border-radius: 14px; padding: 14px; color: var(--panel-text); box-shadow: 0 10px 28px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
.panel-title { font-weight: 700; margin-bottom: 8px; text-align: center; letter-spacing: 0.5px; color: var(--panel-text); }
.move-list { overflow-y: auto; flex: 1; font-size: 14px; min-height: 60px; }
.move-row { display: flex; gap: 8px; padding: 3px 0; border-bottom: 1px solid var(--panel-border); }
.move-number { width: 24px; opacity: 0.65; }
.move-white { flex: 1; }
.move-black { flex: 1; opacity: 0.8; }

.game-controls { display: flex; flex-direction: column; gap: 10px; }
.btn-large { width: 100%; padding: 16px 20px; border: none; border-radius: 14px; font-weight: 700; font-size: 17px; cursor: pointer; color: #fff; transition: transform 0.15s ease, opacity 0.15s ease; box-shadow: 0 6px 16px rgba(0,0,0,0.25); }
.btn-large:hover { transform: translateY(-2px); }
.btn-large:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-newgame { background: var(--brown); }
.btn-pause { background: #a8632e; }
.btn-resume { background: var(--accent); }

.center-column { display: flex; flex-direction: column; align-items: center; }
.captured-row { display: flex; gap: 6px; min-height: 34px; flex-wrap: wrap; justify-content: center; max-width: 820px; margin: 6px 0; }
.captured-piece { font-size: 24px; opacity: 0.85; }
.board-grid { display: grid; grid-template-columns: repeat(8, 100px); grid-template-rows: repeat(8, 100px); border: 4px solid var(--board-border); border-radius: 12px; overflow: hidden; box-shadow: 0 14px 44px rgba(0,0,0,0.35); transition: filter 0.2s ease; }
.board-disabled { pointer-events: none; filter: grayscale(0.3) brightness(0.85); }
.status-text { margin-top: 16px; font-weight: 800; font-size: 26px; color: var(--panel-text); text-align: center; }
.status-gameover { color: #c0392b; }

.one-minute-popup { position: fixed; top: 30%; left: 0; display: flex; align-items: center; z-index: 20; animation: slideInLeft 0.5s ease; }
.king-figure { font-size: 70px; margin-left: 10px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)); }
.king-white { color: #fff; }
.king-black { color: #222; }
.speech-bubble { background: #fff; color: #111; padding: 10px 16px; border-radius: 14px; margin-left: 8px; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.25); animation: bubbleBounce 1s ease-in-out infinite; position: relative; }
.speech-bubble::after { content: ""; position: absolute; left: -8px; top: 50%; transform: translateY(-50%); border-width: 8px 8px 8px 0; border-style: solid; border-color: transparent #fff transparent transparent; }

.overlay-dark { position: fixed; inset: 0; background: rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; z-index: 50; animation: fadeIn 0.3s ease; overflow: hidden; }
.winner-card { background: #fff; border-radius: 18px; padding: 40px 50px; text-align: center; position: relative; z-index: 2; animation: popupScaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
.trophy { font-size: 60px; }
.winner-title { font-size: 30px; font-weight: 800; color: #222; margin-top: 8px; }
.queen-figure { font-size: 70px; margin-top: 10px; animation: slideInRight 0.5s ease; }
.queen-speech { background: #f5f5f5; padding: 8px 16px; border-radius: 12px; font-weight: 600; margin-top: 6px; animation: bubbleBounce 1s ease-in-out infinite; }
.winner-newgame { margin-top: 20px; }
.confetti-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.confetti-piece { position: absolute; top: -20px; width: 10px; height: 16px; animation-name: confettiFall; animation-timing-function: ease-in; animation-iteration-count: infinite; }
@keyframes slideInLeft { from { transform: translateX(-120px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideInRight { from { transform: translateX(120px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes bubbleBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes popupScaleIn { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes confettiFall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(420px) rotate(360deg); opacity: 0; } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

function Confetti() {
    const pieces = useMemo(
        () =>
            Array.from({ length: 40 }).map((_, i) => ({
                id: i,
                left: Math.random() * 100,
                color: ["#3f6b4f", "#8b5e34", "#a8632e", "#c0392b", "#6b4423"][i % 5],
                delay: Math.random() * 1.5,
                duration: 2 + Math.random() * 1.5,
            })),
        []
    );
    return (
        <div className="confetti-container">
            {pieces.map((p) => (
                <div
                    key={p.id}
                    className="confetti-piece"
                    style={{
                        left: `${p.left}%`,
                        backgroundColor: p.color,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}

function Board() {
    const [moveHistorySan, setMoveHistorySan] = useState([]);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [legalMoves, setLegalMoves] = useState([]);
    const [whiteTime, setWhiteTime] = useState(600);
    const [blackTime, setBlackTime] = useState(600);
    const [paused, setPaused] = useState(false);
    const [theme, setTheme] = useState("light");
    const [gameOverInfo, setGameOverInfo] = useState(null);
    const [oneMinuteWarning, setOneMinuteWarning] = useState(null);
    const [playAI, setPlayAI] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    const warnedRef = useRef({ white: false, black: false });
    const lastSoundIndexRef = useRef(0);

    const game = useMemo(() => {
        const g = new Chess();
        for (const san of moveHistorySan) {
            try { g.move(san); } catch (e) {}
        }
        return g;
    }, [moveHistorySan]);

    const board = useMemo(() => game.board().flat(), [game]);
    const verboseHistory = useMemo(() => game.history({ verbose: true }), [game]);

    const capturedByWhite = useMemo(
        () => verboseHistory.filter((m) => m.color === "w" && m.captured).map((m) => m.captured),
        [verboseHistory]
    );
    const capturedByBlack = useMemo(
        () => verboseHistory.filter((m) => m.color === "b" && m.captured).map((m) => m.captured),
        [verboseHistory]
    );

    const isGameOver = !!gameOverInfo;

    useEffect(() => {
        if (paused || isGameOver) return;
        const interval = setInterval(() => {
            if (game.turn() === "w") setWhiteTime((p) => Math.max(p - 1, 0));
            else setBlackTime((p) => Math.max(p - 1, 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [game, paused, isGameOver]);

    useEffect(() => {
        if (gameOverInfo) return;
        if (whiteTime === 0) setGameOverInfo({ reason: "timeout", winner: "black" });
        else if (blackTime === 0) setGameOverInfo({ reason: "timeout", winner: "white" });
    }, [whiteTime, blackTime, gameOverInfo]);

    useEffect(() => {
        if (gameOverInfo) return;
        if (game.isCheckmate()) {
            setGameOverInfo({ reason: "checkmate", winner: game.turn() === "w" ? "black" : "white" });
        } else if (game.isStalemate()) {
            setGameOverInfo({ reason: "stalemate", winner: null });
        } else if (game.isDraw()) {
            setGameOverInfo({ reason: "draw", winner: null });
        }
    }, [game, gameOverInfo]);

    useEffect(() => {
        if (whiteTime === 60 && !warnedRef.current.white) {
            warnedRef.current.white = true;
            setOneMinuteWarning("white");
            const t = setTimeout(() => setOneMinuteWarning(null), 5000);
            return () => clearTimeout(t);
        }
    }, [whiteTime]);

    useEffect(() => {
        if (blackTime === 60 && !warnedRef.current.black) {
            warnedRef.current.black = true;
            setOneMinuteWarning("black");
            const t = setTimeout(() => setOneMinuteWarning(null), 5000);
            return () => clearTimeout(t);
        }
    }, [blackTime]);

    useEffect(() => {
        if (moveHistorySan.length === 0) return;
        if (moveHistorySan.length === lastSoundIndexRef.current) return;
        lastSoundIndexRef.current = moveHistorySan.length;
        if (game.isCheckmate()) return;
        if (game.inCheck()) playSound("check");
        else {
            const last = verboseHistory[verboseHistory.length - 1];
            playSound(last && last.captured ? "capture" : "move");
        }
    }, [moveHistorySan, game, verboseHistory]);

    useEffect(() => {
        if (gameOverInfo) playSound("gameover");
    }, [gameOverInfo]);

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    function getStatus() {
        if (gameOverInfo?.reason === "timeout") {
            return gameOverInfo.winner === "white" ? "⏰ Time Out! White Wins!" : "⏰ Time Out! Black Wins!";
        }
        if (gameOverInfo?.reason === "checkmate") {
            return `🏆 Checkmate! ${gameOverInfo.winner === "white" ? "White" : "Black"} Wins`;
        }
        if (gameOverInfo?.reason === "stalemate") return "Draw by Stalemate";
        if (gameOverInfo?.reason === "draw") return "Draw";
        if (paused) return "Game Paused";
        if (game.inCheck()) return `${game.turn() === "w" ? "White" : "Black"} is in Check`;
        return `${game.turn() === "w" ? "White" : "Black"} to Move`;
    }

    function getWinnerMessage() {
        if (!gameOverInfo || !gameOverInfo.winner) return "";
        const winnerLabel = gameOverInfo.winner === "white" ? "White" : "Black";
        if (gameOverInfo.reason === "timeout") return `${winnerLabel} Wins On Time!`;
        return `Checkmate! ${winnerLabel} Wins!`;
    }

    function getLegalMoves(index) {
        return game.moves({ square: toSquare(index), verbose: true }).map((m) => m.to);
    }

    function handleSquareClick(index) {
        if (isGameOver || paused || isThinking) return;
        if (playAI && game.turn() === "b") return;

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
            const tempGame = new Chess(game.fen());
            const result = tempGame.move({ from: toSquare(selectedSquare), to: squareName, promotion: "q" });
            if (result) setMoveHistorySan((prev) => [...prev, result.san]);
        }

        setSelectedSquare(null);
        setLegalMoves([]);
    }

    function handleNewGame() {
        setMoveHistorySan([]);
        setSelectedSquare(null);
        setLegalMoves([]);
        setWhiteTime(600);
        setBlackTime(600);
        setPaused(false);
        setGameOverInfo(null);
        setOneMinuteWarning(null);
        setIsThinking(false);
        warnedRef.current = { white: false, black: false };
        lastSoundIndexRef.current = 0;
    }

    function handlePauseToggle() {
        if (isGameOver) return;
        setPaused((p) => !p);
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
                piece={piece ? pieceSymbols[piece.color === "w" ? piece.type.toUpperCase() : piece.type] : null}
                isWhitePiece={piece?.color === "w"}
                onClick={() => handleSquareClick(i)}
            />
        );
    });

    const moveRows = [];
    for (let i = 0; i < moveHistorySan.length; i += 2) {
        moveRows.push({ num: i / 2 + 1, white: moveHistorySan[i], black: moveHistorySan[i + 1] });
    }

    // Stockfish runs as a Web Worker loaded from /public, not as a bundled npm import.
    // Copy stockfish-18-lite-single.js AND stockfish-18-lite-single.wasm from
    // node_modules/stockfish/bin/ into your public/ folder for this to resolve.
    const engine = useMemo(
        () => new Worker(process.env.PUBLIC_URL + "/stockfish-18-lite-single.js"),
        []
    );

    useEffect(() => {
        if (!playAI || game.turn() !== "b" || isGameOver || paused) {
            return;
        }

        const handleBestmove = (event) => {
            const line = event.data;
            if (line.startsWith("bestmove")) {
                setIsThinking(false);
                const move = line.split(" ")[1];

                if (move === "(none)") return;

                const from = move.substring(0, 2);
                const to = move.substring(2, 4);
                const tempGame = new Chess(game.fen());
                const result = tempGame.move({ from, to, promotion: "q" });

                if (result) {
                    setMoveHistorySan((prev) => [...prev, result.san]);
                }
            }
        };

        engine.onmessage = handleBestmove;

        const timeout = setTimeout(() => {
            setIsThinking(true);
            engine.postMessage("position fen " + game.fen());
            engine.postMessage("go depth 12");
        }, 500);

        return () => clearTimeout(timeout);
    }, [playAI, game, isGameOver, paused, engine]);

    return (
        <div className="chess-app-wrapper" style={THEMES[theme]}>
            <style>{boardStyles}</style>
            <div className="bg-image" style={{ backgroundImage: `url(${chessBg})` }} />
            <div className="bg-overlay" />

            <div className="theme-toggle">
                <button
                    className={`theme-toggle-btn ${theme === "light" ? "active" : ""}`}
                    onClick={() => setTheme("light")}
                    aria-label="Light mode"
                    title="Light mode"
                >
                    ☀️
                </button>
                <button
                    className={`theme-toggle-btn ${theme === "dark" ? "active" : ""}`}
                    onClick={() => setTheme("dark")}
                    aria-label="Dark mode"
                    title="Dark mode"
                >
                    🌙
                </button>
            </div>

            <div className="game-layout">
                <div className="side-column side-left">
                    <div className="timer-panel">
                        <div className={`clock-box black-clock ${game.turn() === "b" && !isGameOver ? "active" : ""}`}>
                            <div>BLACK</div>
                            <div className="clock-time">{formatTime(blackTime)}</div>
                        </div>
                        <div className="clock-divider" />
                        <div className={`clock-box white-clock ${game.turn() === "w" && !isGameOver ? "active" : ""}`}>
                            <div>WHITE</div>
                            <div className="clock-time">{formatTime(whiteTime)}</div>
                        </div>
                    </div>

                    <div className="mode-toggle">
                        <button
                            className={`mode-btn ${!playAI ? "active" : ""}`}
                            onClick={() => { setPlayAI(false); handleNewGame(); }}
                        >
                            Play vs Friend
                        </button>
                        <button
                            className={`mode-btn ${playAI ? "active" : ""}`}
                            onClick={() => { setPlayAI(true); handleNewGame(); }}
                        >
                            Play vs AI
                        </button>
                    </div>
                </div>

                <div className="center-column">
                    <div className="captured-row captured-top">
                        {capturedByBlack.map((t, i) => (
                            <span key={i} className="captured-piece">{pieceSymbols[t.toUpperCase()]}</span>
                        ))}
                    </div>

                    <div className={`board-grid ${paused || isGameOver ? "board-disabled" : ""}`}>{squares}</div>

                    <div className="captured-row captured-bottom">
                        {capturedByWhite.map((t, i) => (
                            <span key={i} className="captured-piece">{pieceSymbols[t]}</span>
                        ))}
                    </div>

                    <div className={`status-text ${isGameOver ? "status-gameover" : ""}`}>
                        {isThinking ? "🤖 Thinking..." : getStatus()}
                    </div>
                </div>

                <div className="side-column side-right">
                    <div className="move-history-panel">
                        <div className="panel-title">Moves</div>
                        <div className="move-list">
                            {moveRows.map((row) => (
                                <div key={row.num} className="move-row">
                                    <span className="move-number">{row.num}.</span>
                                    <span className="move-white">{row.white}</span>
                                    <span className="move-black">{row.black ? `${row.num}... ${row.black}` : ""}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="game-controls">
                        <button className="btn-large btn-newgame" onClick={handleNewGame}>New Game</button>
                        <button
                            className={`btn-large ${paused ? "btn-resume" : "btn-pause"}`}
                            onClick={handlePauseToggle}
                            disabled={isGameOver}
                        >
                            {paused ? "Resume" : "Pause"}
                        </button>
                    </div>
                </div>
            </div>

            {oneMinuteWarning && (
                <div className="one-minute-popup">
                    <div className={`king-figure king-${oneMinuteWarning}`}>
                        {oneMinuteWarning === "white" ? "♔" : "♚"}
                    </div>
                    <div className="speech-bubble">⚠ One Minute Left!</div>
                </div>
            )}

            {gameOverInfo && gameOverInfo.winner && (
                <div className="overlay-dark">
                    <Confetti />
                    <div className="winner-card">
                        <div className="trophy">🏆</div>
                        <div className="winner-title">{gameOverInfo.winner.toUpperCase()} WINS</div>
                        <div className="queen-figure">{gameOverInfo.winner === "white" ? "♕" : "♛"}</div>
                        <div className="queen-speech">{getWinnerMessage()}</div>
                        <button className="btn-large btn-newgame winner-newgame" onClick={handleNewGame}>New Game</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Board;