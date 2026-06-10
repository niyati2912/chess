function Square({
    isLight,
    index,
    selected,
    onClick
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
                cursor: "pointer"
            }}
        >
        </div>
    );
}

export default Square;