// Initialization
const numRows = 16;
const numCols = 16;
const grid = Array.from({ length: numRows }, () => Array(numCols).fill('_'));
// Original Words and Location
const loc_direction = [
    [6,4,3], [12,6,4], [4,9,1], [3,6,4], [13,5,4],
    [4,15,1], [4,11,1], [2,3,2], [15,3,4], [2,4,3],
    [4,4,3], [1,1,4], [1,16,1]
];
const words = [
    'TADEO',
    'IBARRA',
    'PECSON',
    'BASILIO',
    'PAULITA',
    'MAKARAIG',
    'SANDOVAL',
    'SCHOOLMASTER',
    'FATHERMILLON',
    'PILOSOPOTASIO',
    'JUANITOPELAEZ',
    'FATHERFERNANDEZ',
    'PLACIDOPENITENTE'
];

const wordColors = {}; // Object to store colors for each word
words.forEach((word, index) => {
    wordColors[word] = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
});

var guess = "";
var guess_locations = [];
// Generate the grid
const wordSearchContainer = document.getElementById("wordSearch");
const checklistContainer = document.getElementById("checklist");
placeAllWords();
for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
        const cell = document.createElement("div");
        const random_letters = 'QWXY';
        const randomIndex = Math.floor(Math.random() * random_letters.length);
        cell.className = "cell";
        cell.id = "elem_"+i+"_"+j;
        if (grid[i][j] != "_"){
            cell.textContent = grid[i][j];
        } else {
            cell.textContent = random_letters[randomIndex];
        }
        // cell.textContent = grid[i][j];
        cell.addEventListener("click", () => clickLetter(i, j));
        wordSearchContainer.appendChild(cell);
    }
}
for (let i = 0; i < words.length; i++) {
    const cell = document.createElement("div");
    cell.id = "word" + words[i];
    cell.textContent = words[i];
    cell.style.color = "black"; // Set checklist word color to black
    checklistContainer.appendChild(cell);
}

// FUNCTIONS
// Place words in the grid with arbitrary location and direction
function placeAllWords() {
    for (let i = 0; i < loc_direction.length; i++) {
        placeSingleWord(loc_direction[i][0], loc_direction[i][1], loc_direction[i][2], words[i]);
    }
}

function placeSingleWord(startX, startY, direction, str) {
    if (direction == 1) {
        for (let i = 0; i < str.length; i++) {
            grid[startY-1-i][startX-1+i] = str[i];
        }
    } else if (direction == 2) {
        for (let i = 0; i < str.length; i++) {
            grid[startY-1][startX-1+i] = str[i];
        }
    } else if (direction == 3) {
        for (let i = 0; i < str.length; i++) {
            grid[startY-1+i][startX-1+i] = str[i];
        }
    } else if (direction == 4) {
        for (let i = 0; i < str.length; i++) {
            grid[startY-1+i][startX-1] = str[i];
        }
    }
}

function clickLetter(i, j) {
    const block2click = document.getElementById("elem_"+i+"_"+j);
    if (block2click.style.backgroundColor != "lime") {
        if (guess_locations.length == 0) {
            appendGuess(i, j);
        } else if (guess_locations.length == 1) {
            let init_diffX = j - guess_locations[0][1];
            let init_diffY = i - guess_locations[0][0];
            if ([0,1].includes(Math.abs(init_diffX)) && [0,1].includes(Math.abs(init_diffY)) &&
                (init_diffX != 0 | init_diffY != 0)) {
                    appendGuess(i, j);
                }
        } else if (guess_locations.length > 1) {
            let init_diffX = guess_locations[1][1] - guess_locations[0][1];
            let init_diffY = guess_locations[1][0] - guess_locations[0][0];
            let lastX = guess_locations[guess_locations.length-1][1];
            let lastY = guess_locations[guess_locations.length-1][0];
            if ((i == lastY + init_diffY) && (j == lastX + init_diffX)) {
                appendGuess(i, j);
            }
        }
    } else {
        alert("ALREADY GUESSED!");
    }
}

function appendGuess(i, j) {
    const txt_guessval = document.getElementById("guessValue");
    guess = guess + grid[i][j];
    guess_locations.push([i,j]);
    txt_guessval.innerHTML = guess;
    colorGuessBlock(i, j, "yellow");
}

function checkGuess() {
    if (words.includes(guess)) {
        let init_diffX = guess_locations[1][1] - guess_locations[0][1];
        let init_diffY = guess_locations[1][0] - guess_locations[0][0];
        let startX = guess_locations[0][1];
        let startY = guess_locations[0][0];
        let lastX = guess_locations[guess_locations.length-1][1];
        let lastY = guess_locations[guess_locations.length-1][0];
        var cntr = 1;
        var subset_list = [];
        var left_letters = "";
        var right_letters = "";
        var expectedAnswer = "N/A";

        for (let i = 0; i < words.length; i++) {
            if (words[i].indexOf(guess) !== -1 && words[i] != guess) {
                subset_list.push(words[i].replace(guess, ""));
            }
        }
        if (subset_list.length == 0) {
            expectedAnswer = guess;
        }
        else if (subset_list.length >= 1) {
            while (true) { // LEFTWARDS
                let currentY = startY-(init_diffY*cntr);
                let currentX = startX-(init_diffX*cntr)
                if (currentX >= 0 && currentX < numCols && currentY >= 0 && currentY < numRows) {
                    left_letters = grid[currentY][currentX] + left_letters;
                    cntr++;
                } else {
                    cntr = 1;
                    break;
                }
            }
            while (true) { // RIGHTWARDS
                let currentY = lastY+(init_diffY*cntr);
                let currentX = lastX+(init_diffX*cntr)
                if (currentX >= 0 && currentX < numCols && currentY >= 0 && currentY < numRows) {
                    right_letters = right_letters + grid[currentY][currentX];
                    cntr++;
                } else {
                    break;
                }
            }
            for (let i = 0; i < subset_list.length; i++) {
                if (left_letters.indexOf(subset_list[i]) !== -1) {
                    expectedAnswer = subset_list[i]+guess;
                }
                if (right_letters.indexOf(subset_list[i]) !== -1) {
                    expectedAnswer = guess+subset_list[i];
                }
            }
            if (expectedAnswer == "N/A") {
                expectedAnswer = guess;
            }
        }

        if (guess == expectedAnswer) {
            correctGuess();
        } else {
            alert("WRONG ANSWER!");
        }

        const allWordsFound = words.every(word => document.getElementById("word" + word).style.textDecoration === "line-through");
        if (allWordsFound) {
            alert("YOU FOUND ALL THE WORDS. CONGRATULATIONS!");
        }

    } else {
        alert("WRONG ANSWER!");
    }
}

function correctGuess() {
    const word2cross = document.getElementById("word"+guess);
    word2cross.style.textDecoration = "line-through";
    guess_locations.forEach(element => {
        colorGuessBlock(parseInt(element[0]), parseInt(element[1]), wordColors[guess]); // Set cell color to the color of the guessed word
    });
    guess = "";
    guess_locations = [];
    const txt_guessval = document.getElementById("guessValue");
    txt_guessval.innerHTML = guess;
}

function clearGuess() {
    const txt_guessval = document.getElementById("guessValue");
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const block2color = document.getElementById("elem_"+i+"_"+j);
            if (block2color.style.backgroundColor === "yellow") {
                colorGuessBlock(i, j, "white");
            }
        }
    }
    guess = "";
    guess_locations = [];
    txt_guessval.innerHTML = guess;
}

function colorGuessBlock(i, j, color) {
    const block2color = document.getElementById("elem_"+i+"_"+j);
    block2color.style.backgroundColor = color;
}
