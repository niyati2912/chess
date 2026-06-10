function Square({
    isLight,
    index,
    selected,
    onClick,
    piece
}) {

    return (
        <div
            onClick={onClick}
            style={{
                width: "60px",
                height: "60px",
                backgroundColor: selected
                    ? "yellow"
                    : isLight
                    ? "#f0d9b5"
                    : "#b58863",
                border: "1px solid black",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "40px",
                userSelect: "none"
            }}
        >
            {piece}
        </div>
    );
}

export default Square;