/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var score, roundScore, activePlayer, dice, dice_1, gamePlaying, countSix = 0, maxScore;

init();

document.querySelector('.btn-roll').addEventListener('click', function () {
	if (gamePlaying) { //variable state

		//1. Random number
		dice = Math.floor(Math.random() * 6) + 1;
		dice_1 = Math.floor(Math.random() * 6) + 1;

		//2 Display the result
		var diceDOM = document.querySelector('.dice');
		var diceDOM_1 = document.querySelector('.dice-1');
		diceDOM.style.display = 'block';
		diceDOM_1.style.display = 'block';
		diceDOM.src = 'dice-' + dice + '.png';
		diceDOM_1.src = 'dice-' + dice_1 + '.png';

		//3 Update the round score IF the rolled number was NOT a 1 or NOT double 6
		if (dice === 6 || dice_1 === 6) { //count six
			countSix++;
		} else {
			countSix = 0;
		}

		if (dice !== 1 && dice_1 !== 1 && countSix !== 2) {
			//add score
			roundScore += dice + dice_1;
			document.getElementById('current-' + activePlayer).textContent = roundScore;
		} else if (countSix === 2) {
			scores[activePlayer] = 0;
			document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
			nextPlayer();
		} else {
			//Next player
			nextPlayer();
		}
	}
});

document.querySelector('.btn-hold').addEventListener('click', function () {
	if (gamePlaying) {
		countSix = 0;
		//add CURRENT score to GLOBAL score
		scores[activePlayer] += roundScore;

		//Update the UI
		document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

		//Check if player won the game
		if (scores[activePlayer] >= maxScore) {
			document.getElementById('name-' + activePlayer).textContent = 'Winner';
			document.querySelector('.dice').style.display = 'none';
			document.querySelector('.dice-1').style.display = 'none';
			document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
			document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
			gamePlaying = false;
		} else {
			nextPlayer();
		}
	}
});

document.querySelector('.btn-new').addEventListener('click', init);

document.querySelector('.btn-score').addEventListener('click', function () {
	maxScore = document.getElementById('max-score').value;
	document.getElementById('max-score').value = maxScore;
	init();
});

function nextPlayer() {
	activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
	roundScore = 0;

	document.getElementById('current-0').textContent = 0;
	document.getElementById('current-1').textContent = 0;

	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

	if (dice !== 1 && dice_1 !== 1 && countSix !== 2) {
		document.querySelector('.dice').style.display = 'none';
		document.querySelector('.dice-1').style.display = 'none';
	} else {
		setTimeout("document.querySelector('.dice').style.display = 'none';", 500);
		setTimeout("document.querySelector('.dice-1').style.display = 'none';", 500);
	}
	countSix = 0;
};


function init() {
	//start display 
	scores = [0, 0];
	roundScore = 0;
	activePlayer = 0;
	countSix = 0;

	maxScore = document.getElementById('max-score').value;

	gamePlaying = true;

	document.querySelector('.dice').style.display = 'none';
	document.querySelector('.dice-1').style.display = 'none';

	document.getElementById('score-0').textContent = 0;
	document.getElementById('score-1').textContent = 0;
	document.getElementById('current-0').textContent = 0;
	document.getElementById('current-1').textContent = 0;
	document.getElementById('name-0').textContent = 'Player 1';
	document.getElementById('name-1').textContent = 'Player 2';
	document.querySelector('.player-0-panel').classList.remove('winner', 'active');
	document.querySelector('.player-1-panel').classList.remove('winner', 'active');
	document.querySelector('.player-0-panel').classList.add('active');
}
