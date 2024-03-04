
var NumSelected = null;
var TileSelected = null;

var error = 0;

function generateBoard() {
    let board = new Array(9).fill(0).map(() => new Array(9).fill(0));

    for (let i = 0; i < 81; i++) {
        let row = Math.floor(i / 9);
        let col = i % 9;
        let block = Math.floor(row / 3) * 3 + Math.floor(col / 3);

        let numbers = new Array(9).fill(0).map((_, index) => index + 1);
        for (let j = 0; j < col; j++) {
            const pos = numbers.indexOf(board[row][j]);
            if (pos !== -1) numbers.splice(pos, 1);
        }

        for (let j = 0; j < row; j++) {
            const pos = numbers.indexOf(board[j][col]);
            if (pos !== -1) numbers.splice(pos, 1);
        }

        for (let j = 0; j < 9; j++) {
            const pos = numbers.indexOf(board[Math.floor(block / 3) * 3 + Math.floor(j / 3)][block % 3 * 3 + j % 3]);
            if (pos !== -1) numbers.splice(pos, 1);
        }

        let rand = Math.floor(Math.random() * numbers.length);
        if (numbers[rand] === undefined) return generateBoard();
        board[row][col] = numbers[rand];
    }

    return board;
}

function generateGame(board) {
    let game = JSON.parse(JSON.stringify(board));  // Copy the board
    for (let i = 0; i < 81; i++) {
        // change the difficulty of the game by changing the probability of a number being removed
        if (Math.random() < 0.75) {
            let row = Math.floor(i / 9);
            let col = i % 9;
            game[row][col] = 0;
        }
    }
    return game;
}

var solution = generateBoard()
var board = generateGame(solution);

window.onload = function () {
    setGame();
}

function setGame() 
{
    for (let i=1; i<=9; i++) 
    {
        // Create a div for each number
        // <div id="1" class="number">1</div> to <div id="9" class="number">9</div>
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i; 
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("Number").appendChild(number);
        let nbRestant = document.createElement("div");
        nbRestant.id = i;
        nbRestant.innerText = 0;
        nbRestant.classList.add("nbRestant");
        document.getElementById("nbRestant").appendChild(nbRestant);
    }

    //board 9x9
    for(let i=0; i<9; i++)
    {
        for(let j=0; j<9; j++)
        {
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            if(board[i][j] != 0)
            {
                tile.innerText = board[i][j];
                tile.classList.add("tile-start");
            }
            if(i == 2 || i == 5)
            {
                tile.classList.add("horizontal-line");
            }
            if(j == 2 || j == 5)
            {
                tile.classList.add("vertical-line");
            }
            tile.classList.add("tile");
            tile.addEventListener("click", selectTile);
            tile.innerText = board[i][j] == 0 ? "" : board[i][j];
            document.getElementById("Board").appendChild(tile);
            if(board[i][j] == nbRestant[i])
            {
                nbRestant[i].innerText ++;
            }
        }
    }
}

function selectNumber()
{
    if(NumSelected != null)
    {
        NumSelected.classList.remove("number-selected");
    }
    NumSelected = this;
    NumSelected.classList.add("number-selected");
}

function selectTile()
{
    if(NumSelected)
    {
        if(this.innerText != "")
        {
            return;
        }
        let rc = this.id.split("-");
        let r = parseInt(rc[0]);
        let c = parseInt(rc[1]);

        if(solution[r][c] == NumSelected.id)
        {
            this.innerText = NumSelected.id;
        }
        else
        {
            error++;
            document.getElementById("errors").innerText = "Error: " + error;
            //document.getElementById(this.id).classList.add("tile-error");
        }
    }
}

function newGame()
{
    location.reload();
}

function solve()
{
    for(let i=0; i<9; i++)
    {
        for(let j=0; j<9; j++)
        {
            let tile = document.getElementById(i.toString() + "-" + j.toString());
            if(tile.classList.contains("tile-start"))
            {
                continue;
            }
            tile.innerText = solution[i][j];
            tile.classList.add("tile-solved");
        }
    }
}

