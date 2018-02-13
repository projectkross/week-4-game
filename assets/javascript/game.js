// Variables
var characters =  [
		{name: "Frieza", health:130, attack:10, counter:15},
		{name: "Vegeta", health:110, attack:25, counter:5},
		{name: "Goku", health:160, attack:15, counter:10},
		{name: "Goku-Black", health:200, attack:5, counter:25}
	]

var images = []; // full pic array
var enemies = []; // enemies left pic array
var enemiesVal =[]; // position of enemies in array vs value

var charSelect = false; // false = user hasn't chosen
var enemySelect = false; // false = enemy hasn't been chosen

var userVal; // value of clicked image

var character;
var characterHP;
var initialAP;
var characterAP;

var enemy;
var enemyHP;
var enemyAtk;

// Functions

function starting() { 
	$("#fightText").hide();
	$("#attackbtn").hide();
	$("#resetbtn").hide();

	for(var i = 0; i < characters.length; i++){ // display pictures
		var currentChar = characters[i].name
		images.push('<figure value="' + i + '" class="' + currentChar + '">' + // char container
			"<figcaption>" + currentChar + "</figcaption>" + // char name display
			'<img class="' + currentChar + '" src="assets/images/' + currentChar + '.png" height="250">' + // char img
			'<figcaption>' + characters[i].health + "</figcaption>" + '</figure>'); // char health display

		enemies = images.slice(); // copied images array to keep track of which enemy images to show
		enemiesVal.push("" + i + ""); // keeps track of indexes for enemies array

		$("#availableChar").append(images[i]); // add all char images for user to choose
		
	}
	choice();
}

function choice() { // runs when user needs to select
	$("figure").on("click", function() { // user chooses char by clicking figure
		userVal = $(this).attr("value") // obtains char value
		userId = $(this).attr("class") // obtains char class (name)

		if(charSelect === false){ // runs when char not selected
			$("#userChar").html("<h2>Your Character</h2>" + images[userVal]);
			$("#enemiesLeft").html("<h2>Enemies Available to Attack</h2>");
			$("#availableChar").empty();

			splice(userVal); // removes userChoice from enemies array
			charChoice(userVal); // adds char info
			charSelect = true; // changes charSelect to true so this doesn't run again

			choice(); 
		}

		else if (enemySelect === false && userId != character) { // runs when enemy not selected, prevents user duplicate
			$("#defender").html("<h2>Defender</h2>" + images[userVal]); 
			$("#battle").empty(); // clear previous battle info
			$("#enemiesLeft").empty().html("<h2>Enemies Available to Attack</h2>");
			$("#fightText").show();
			$("#attackbtn").show();
			$("#resetbtn").show();
			
			var enemyPosition = enemiesVal.indexOf(userVal); // finds position of enemy in array
			splice(enemyPosition); // empties enemies left and appends remaining enemies
			
			enemyChoice(userVal); // adds enemy info
			
			enemySelect = true; // changes enemySelect to true so this doesn't run again until enemy is dead
		}		
	}) 
} 

function splice(num){ // removes choices from enemies array & adds it to enemiesLeft
	enemies.splice(num,1);
	enemiesVal.splice(num,1);

	for(var i = 0; i < enemies.length; i++){
		$("#enemiesLeft").append(enemies[i]);
	}	
}

function charChoice(value){
	character = characters[value].name;
	characterHP = characters[value].health;
	initialAP = characters[value].attack;
	characterAP = characters[value].attack;
}

function enemyChoice(value){
	enemy = characters[value].name;
	enemyHP = characters[value].health;
 	enemyAtk = characters[value].counter;
}

function gameOver(){ // checks if game is over (win or lose)
	if (characterHP <= 0){ // lose
		$("#battle").empty().html(enemy + " has killed you! GAME OVER.");
		$("#enemiesLeft").empty().html("");
	}
	else if (enemyHP <= 0){ // win game/battle
		if(enemies.length === 0){
			$("#defender").empty().html("<h2>Defender</h2>");
			$("#battle").html("You defeated " + enemy + "! You win!");
			$("#enemiesLeft").empty();
		} 
		else if (enemyHP <= 0 && characterHP <=0){ // Draw... maybe?
			$("#defender").empty().html("<h2>Defender</h2>");
			$("#battle").html("Draw!");
 		}
		else {
			$("#defender").empty().html("<h2>Defender</h2>");
			$("#battle").append($("<div>" + "You defeated " + enemy + "! Choose another enemy to fight." + "</div>"));
			enemySelect = false;
			choice();
		}
	}
}



$("#attackbtn").on('click', function(){
	if(characterHP > 0 && enemyHP > 0){
		enemyHP -= characterAP; //Attk dmg 
		characterHP -= enemyAtk; //Hp value
		//Looks for current enemy at play and selects next "sibling" value of health  
		$("img." + enemy).next('figcaption').text(enemyHP); // decrease enemyHP text
		$("#battle").html("You attacked " + enemy + " for " + characterAP + " damage!");
		//Looks for current player selected and goes to "sibling" which is health 
		$("img." + character).next('figcaption').text(characterHP); // decrease charHP text
		$("#battle").append($("<div>" + enemy + " attacked you back for " + enemyAtk + " damage!" + "</div>"))

		characterAP += initialAP;
		gameOver();
	}
})

$("#resetbtn").on('click', function(){
	if(charSelect === true){ // only runs if there was a char selected
		$("#availableChar").html("<h2>Start by choosing a character!</h2>");
		$("#userChar").empty(); // remove last game
		$("#enemiesLeft").empty();
		$("#defender").empty();
		$("#battle").empty();

		characterHP = 0;
		enemyHP = 0;
		images = []; 
		enemies = [];
		enemiesVal =[]

		charSelect = false;
		enemySelect = false;
		starting();
	}
})

starting();



