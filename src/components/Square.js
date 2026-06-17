function Square({ isLight, selected, onClick, piece, isWhitePiece, highlighted }) {

    let bg = isLight ? "#f0d9b5" : "#b58863";
    if (selected) bg = "#f6f669";
    else if (highlighted) bg = isLight ? "#cdd26a" : "#aaa23a";

    return (
        <div
            onClick={onClick}
            style={{
                width: "100px",
                height: "100px",
                backgroundColor: bg,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "66px",
                userSelect: "none",
                position: "relative",
                transition: "background-color 0.1s",
            }}
        >
            {highlighted && !piece && (
                <div style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 0, 0, 0.18)",
                    pointerEvents: "none",
                }} />
            )}

            {piece && (
                <span style={{
                    lineHeight: 1,
                    filter: isWhitePiece
                        ? "drop-shadow(0 1px 0 #888)"
                        : "drop-shadow(0 1px 0 rgba(1, 0, 0, 0.3))",
                    zIndex: 1,
                }}>
                    {piece}
                </span>
            )}

            {highlighted && piece && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "4px solid rgba(0,0,0,0.22)",
                    pointerEvents: "none",
                    boxSizing: "border-box",
                }} />
            )}
        </div>
    );
}

export default Square;