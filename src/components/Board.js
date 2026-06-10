function Board(){

    const squares=[];

    for(let i=0;i<=63;i++){
    const row = Math.floor(i/8);
    const col = i % 8;
    const isLight = (row + col) % 2 === 0;
        squares.push(
            <div key={i}
                style={{
                    width: "60px",
                    height: "60px",
                    border: "1.8px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isLight ? "#f0d9b5" : "#b58863"
                }}>
                
                {i}
            </div>
        );
    }
        
    return (
        <div style={{
            display: "grid",
            margin: "20px auto",
            width : "fit-content",

            gridTemplateColumns: "repeat(8, 60px)"
        }}> 
            {squares}
        </div>
    );
}


export default Board;
//this line tells that other file s are allowed to import the board component