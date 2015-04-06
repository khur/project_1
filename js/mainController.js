'use strict';

angular.module('ticTacToe', ['firebase'])
			.controller('MainController', MainController);

MainController.$inject = ['$firebaseArray', '$firebaseObject']



function MainController($firebaseArray, $firebaseObject){

	var self = this;

	////////////////////////////////////////////////////////////
	/////////                  SYNCED                 //////////
	////////////////////////////////////////////////////////////

	self.gameSquares = gameSquares();
	self.gameInfo = gameInfo();




	////////////////////////////////////////////////////////////
	//////////             VARIABLES            ////////////////
	////////////////////////////////////////////////////////////

	self.scoreReset = scoreReset;
	self.clearBoard = clearBoard;
	self.playerChange = playerChange;
	self.setPlayer = setPlayer;
	self.playerName;// input for player set
	self.localPlayer;// sets local player to X or O
	self.postComment = postComment;
	self.chatLog = gameInfo.chatLog
	self.msgInput;// chat input box
	
	//////////////////////////////////////////////////////////////
	/////////////          FIREBASE ARRAY             ////////////
	//////////////////////////////////////////////////////////////

	function gameSquares(){
		var ref = new Firebase('project1-ttt.firebaseio.com/squares');

		var gameSquares = $firebaseArray(ref);


			gameSquares.$loaded(function(){
						for(var i = 0; i < 9; i++){
							gameSquares[i].move = '';
							gameSquares.$save(gameSquares[i]);
						}

			})

		return gameSquares;
	}


	/////////////////////////////////////////////////////////////////
	/////////               FIREBASE OBJECT            //////////////
	/////////////////////////////////////////////////////////////////

	function gameInfo(){
		var ref = new Firebase('https://project1-ttt.firebaseio.com/gameInfo');
		var gameInfo = $firebaseObject(ref);

			
			


			gameInfo.$loaded(function(){
				gameInfo.oh = "O";
				gameInfo.ex = "X";
				gameInfo.playerSwitch = true;
				gameInfo.catsGame = false;
				gameInfo.oScore = 0;
				gameInfo.xScore = 0;
				gameInfo.count = 0;
				gameInfo.chatLog = [{test: 'talk some smack!'}];
				gameInfo.winner = '';
				// gameInfo.currentMove = "X"
				setPlayer();
				gameInfo.$save();

			});

		console.log(gameInfo);
		return gameInfo;
		
	}
	 


		//=========================================================//
		//===================== FUNCTIONS  ========================//
    	//=========================================================//






	/////////////////////////////////////////////////////////////
	/////////               PLAYER CHANGE                ////////
	/////////////////////////////////////////////////////////////

	function playerChange($index){

		/*if(self.gameInfo.count === 0){
			self.setPlayer();
		}*/

		if(self.localPlayer === "X" && self.gameInfo.playerSwitch === true){
			if (self.gameSquares[$index].move === '') {
				self.gameSquares[$index].move = self.gameInfo.ex;
				self.gameSquares.$save(self.gameSquares[$index]);
				self.gameInfo.playerSwitch = false;
				self.gameInfo.count++;
				self.gameInfo.$save();
			};
			
			
		}else if (self.localPlayer === "O" && self.gameInfo.playerSwitch === false){
			if (self.gameSquares[$index].move === '') {
				self.gameSquares[$index].move = self.gameInfo.oh;
				self.gameSquares.$save(self.gameSquares[$index]);
				self.gameInfo.playerSwitch = true;
				self.gameInfo.count++;
				self.gameInfo.$save();
			};	
		}else{
			alert("Wait your turn homie!");
		}

		getWinner();
			
	}

	
	///////////////////////////////////////////////////////////////
	//////////                WIN LOGIC                ////////////
	///////////////////////////////////////////////////////////////


	function getWinner(){

		var winner = false;
		var one = self.gameSquares[0].move;
		var two = self.gameSquares[1].move;
		var three = self.gameSquares[2].move;
		var four = self.gameSquares[3].move;
		var five = self.gameSquares[4].move;
		var six = self.gameSquares[5].move;
		var seven = self.gameSquares[6].move;
		var eight = self.gameSquares[7].move;
		var nine = self.gameSquares[8].move;
		var clicks = 0;

			if(one != '' && one === two && one === three){	
				self.gameInfo.winner = one;
				console.log("winner!!");
				console.log("row one!");
				scoreKeeper();

			}
			else if(one != '' && one === four && one === seven){
				self.gameInfo.winner = one;
				console.log("winner!!");
				console.log("column one!");
				scoreKeeper();
			
			}
			else if(two != '' && two === five && two === eight){
				self.gameInfo.winner = two;
				console.log("winner!!");
				console.log("column two!");
				scoreKeeper();
			
			}
			else if(three != '' && three === six && three === nine){
				self.gameInfo.winner = three;
				console.log("winner!!");
				console.log("column three!");
				scoreKeeper();
			
			}
			else if(four != '' && four === five && four === six){
				self.gameInfo.winner = four;
				console.log("winner!!");
				console.log("row two!");
				scoreKeeper();
			
			}
			else if(seven != '' && seven === eight && seven === nine){
				self.gameInfo.winner = seven;
				console.log("winner!!");
				console.log("row three!");
				scoreKeeper();
			
			}
			else if(one != '' && one === five && one === nine){
				self.gameInfo.winner = one;
				console.log("winner!!");
				console.log("diagonal left to right!");
				scoreKeeper();
			
			}
			else if(three != '' && three === five &&three === seven){
				self.gameInfo.winner = three;
				console.log("winner!!");
				console.log("diagonal right to left!");
				scoreKeeper();
		
			}else if(self.gameInfo.count === 9){
				self.gameInfo.winner = "CATS GAME!";
				self.gameInfo.$save();	
				console.log("CCCCAAAAAATTTTTSSS!");
			}else{
				console.log("keep rollin..")
			}
		
	}

	
	/////////////////////////////////////////////////////////////
	/////////               SCORE KEEPING                ////////
	/////////////////////////////////////////////////////////////

	function scoreKeeper(){

		if(self.gameInfo.winner === "X"){
				self.gameInfo.winner = "X  wins!"
				 self.gameInfo.xScore++;
		}else if (self.gameInfo.winner === "O"){
				self.gameInfo.winner = "O  wins!"
				self.gameInfo.oScore++;
		}

		self.gameInfo.$save();	

	}



	///////////////////////////////////////////////////////////////
	//////////                SWITCH PREVENT           ////////////
	///////////////////////////////////////////////////////////////


	function setPlayer(){

		if(self.gameInfo.currentMove === "X"){
			self.localPlayer = "X";
			self.gameInfo.currentMove = "O";
		}else if(self.gameInfo.currentMove === "O"){
			self.localPlayer = "O";
			self.gameInfo.currentMove = "X";
		}

		self.gameInfo.$save();	

	}


	/////////////////////////////////////////////////////////////
	/////////               CLEAR BOARD                  ////////
	/////////////////////////////////////////////////////////////

	function clearBoard(){
		for(var j = 0; j < self.gameSquares.length; j++){
			self.gameSquares[j].move = '';
			self.gameSquares.$save(self.gameSquares[j]);
		}

		self.gameInfo.playerSwitch = true;
		self.gameInfo.count = 0;
		self.gameInfo.winner = '';
		self.gameInfo.$save();
		
	}



	/////////////////////////////////////////////////////////////
	/////////               SCORE RESET                  ////////
	/////////////////////////////////////////////////////////////

	function scoreReset(){
		self.gameInfo.oScore = 0;
		self.gameInfo.xScore = 0;
		clearBoard();
		self.gameInfo.$save();
	}


	/////////////////////////////////////////////////////////////
	///////               POST CHAT BOX                	 ////////
	/////////////////////////////////////////////////////////////

	function postComment(){
		var msg = self.msgInput;

		if(msg === "clearThisMofo"){
			clearBoard();
			self.msgInput = '';
		}else if(msg === "resetTheGame"){
			scoreReset();
			self.msgInput = '';

		}else{
			if(self.gameInfo.chatLog.length === 10){
				self.gameInfo.chatLog.splice(1, 1);
				self.gameInfo.chatLog.push({ post: msg });
				self.gameInfo.$save();
				self.msgInput = '';
			}else{
				self.gameInfo.chatLog.push({ post: msg });
				self.gameInfo.$save();
				self.msgInput = '';
			}
		}

		

	}


} /////         END MAIN CONTROLLER