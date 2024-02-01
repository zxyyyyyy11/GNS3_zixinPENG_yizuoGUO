const prompt = require('prompt-sync')();
var words = require('an-array-of-french-words')
/*https://github.com/words/an-array-of-english-words*/

const letter_pool = {"A":14,"B":4,"C":7,"D":5,"E":19,"F":2,"G":4,"H":2,"I":11,"J":1,"K":1,"L":6,"M":5,"N":9,"O":8,"P":4,"Q":1,"R":10,"S":7,"T":9,"U":8,"V":2,"W":1,"X":1,"Y":1,"Z":2};
let letters_left = letter_pool;
// var init = false;

/*
 * get 6 random letters from the bag if it concerns the first hand of the game or 1 letter if not
 * return: an array of 6 letters or a letter
 */
function get_random_letters(init) {
  const letters = Object.keys(letters_left);
  const random_letters = [];
  let nb_letters = 1;
  if (init) { nb_letters = 6; } 

  for (let i = 0; i < nb_letters ; i++) {
    let letter = '';
    
    while (letter === '' || letters_left[letter] === 0) {
      const random_index = Math.floor(Math.random() * letters.length);
      letter = letters[random_index];
    }
    
    random_letters.push(letter);
    letters_left[letter]--;
  }
  
  return random_letters;
}


// need to seperate to a main js file
let player1 = {
  plate : [[[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]]],
  hand : ['A','B','C','D','E','F'],
  words_played : []
}
let player2 = {
  plate : [[['M'],['O'],['M'],[],[],[],[],[],[]],
           [['D'],['A'],['D'],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]],
           [[],[],[],[],[],[],[],[],[]]],
  hand : ['F','R','E','N','C','H'],
  words_played : []
}

/*
 * change the letters chosen with the bag, no return
 */ 
function exchange_with_bag(player,letters, letters_left) {
  for (let letter of letters) {
    player.hand.push(get_random_letters(false)[0]);
    if (letters_left[letter] === undefined) {
      letters_left[letter] = 0;
    }
    letters_left[letter]++;
  }
}

/*
 * choose a place to put the letter in the plate
 * return: (type,row); type =1 or 2 correspond to the next action the player should do 
 */
function get_aimed_row(player) {
  console.log('choose a row (0-7) to put the letter');
  let x = parseInt(prompt('x: '));
  if (x < 0 || x > 7) {
    console.log('this row is outside the plate, choose again');
    return get_locat(player);
  } else {
    if (player.plate[x][0].length === 0) {
      let aime = x;
      for (let i = x; i > 0 ; i--) {
        if (player.plate[i][0].length === 0){ aime = i;}
      }
      console.log('you try to put a letter in an empty row, you have to fill the row from the top');
      console.log('please choose at least 3 letters in your hand to put in this row');
      return [1, aime];
    } else {
      console.log('you try to put a letter in a row with letters, please choose a letter in your hand to put in this row');
      return [2, x];
    }
  }
}


/* 
 * choose a letter from hand to put in the plate or three letters to exchange with the bag
 * return: a letter or an array of three letters
 */
function get_aimed_letter(player,type){
  if (type === '2') {
    let letter = prompt('choose a letter: ');
    if (player.hand.includes(letter)) {
      const index = player.hand.indexOf(letter);
      player.hand.splice(index, 1);
      return letter;
    } else {
      console.log('you do not have this letter in your hand, try again');
      return get_aimed_letter(player,'put');
    }
  }
  else if (type === '1') {
    console.log('choose 3 letters to put');
    return [get_aimed_letter(player,'put'),get_aimed_letter(player,'put'),get_aimed_letter(player,'put')];
  }
  else if (type === 'exchange') {
    console.log('choose 3 letters to exchange');
    return [get_aimed_letter(player,'put'),get_aimed_letter(player,'put'),get_aimed_letter(player,'put')];
  }
}

/*
 * rearrange the letters in input
 * return: an array of letters rearranged
 */
function rearrange_letters(letters) {
  let arranged_letters = [];
  console.log('enter all the letters in the row by your order: ', letters);
  while (letters.length > 0) {
    let letter = prompt('letter: ');
    const index = letters.indexOf(letter);
    if (index !== -1) {
      letters.splice(index, 1);
      arranged_letters.push(letter);
    } else {
      console.log('Invalid letter. Please try again.');
    }
  }
  return arranged_letters;
}
console.log(rearrange_letters(['A','B','C','D','E','F']));

/*
 * check if the word is valid, return true or false
 */
function verify_word(word) {
}





function put_letter(letter, player, x, y) {
  x = parseInt(x);
  y = parseInt(y);
  if (Array.isArray(player.plate[x][y]) && player.plate[x][y].length > 0) {
    console.log('this cell is already occupied,tried another one');
    let newLetter = prompt('letter: ');
    let newX = parseInt(prompt('x: '));
    let newY = parseInt(prompt('y: '));
    put_letter(newLetter, player, newX, newY);
  } else {
    player.plate[x][y] = [letter];
  }
}


function display_plate(player) {
  for (let row of player.plate) {
    let rowStr = '';
    for (let cell of row) {
      rowStr += (Array.isArray(cell) && cell.length === 0) ? ' [ ] ' :  ' ['+cell+'] ';
    }
    console.log(rowStr);
  }
}
