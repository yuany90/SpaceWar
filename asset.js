var countryColor = 
	[
		["#ebebeb", "#e1f1f1", 0.6, "gray"],
		["#f0f903", "#6deae9", 1.0, "black"],
		["#8ac127", "#bbe282", 1.0, "black"],
		["#ff9a9a", "#ffd8b2", 1.0, "black"],
		["#d288ed", "#dda6f5", 1.0, "black"]
	];
		
var typeEnum = 
	[
		{'radius':25, 'initial':3,  'maxPopulation':50},
		{'radius':35, 'initial':7,  'maxPopulation':100},
		{'radius':45, 'initial':10, 'maxPopulation':150}
	];
	
var Map = 
[
	[
		{'type': 0, 'x': 400, 'y':324, 'country': 1},
		{'type': 0, 'x': 232, 'y':117, 'country': 2},
		{'type': 0, 'x': 200, 'y':300, 'country': 0},
		{'type': 0, 'x': 400, 'y':231, 'country': 0},
		{'type': 0, 'x': 161, 'y':170, 'country': 0},
		
	],
	[
		{'type': 0, 'x': 75,  'y':75,  'country': 1},
		{'type': 0, 'x': 500, 'y':400, 'country': 2},
		{'type': 0, 'x': 400, 'y':340, 'country': 0},
		{'type': 0, 'x': 161, 'y':170, 'country': 0},
		{'type': 0, 'x': 500, 'y':240, 'country': 0},
		{'type': 0, 'x': 300, 'y':390, 'country': 0},
		{'type': 0, 'x': 300, 'y':90,  'country': 0},
		{'type': 0, 'x': 112, 'y':340, 'country': 0},
		{'type': 0, 'x': 400, 'y':140, 'country': 0},
		{'type': 1, 'x': 300, 'y':240, 'country': 3}
	],
]

var background = new Image();
	background.src = "background.jpg";
	
var logo = new Image();
	logo.src = 'logo.png';
	
var newgameIcon = new Image();
	newgameIcon.src = 'newgame.png';
	
var quitgameIcon = new Image();
	quitgameIcon.src = 'quit.png';

var extinct = new Image();
	extinct.src = 'extinct.png';
	
var dominant = new Image();
	dominant.src = 'dominant.png';
	
var pauseIcon = new Image();
	pauseIcon.src = 'icon.png';
	
var playIcon = new Image();
	playIcon.src = 'play_button.png';
	
var restartIcon = new Image();
	restartIcon.src = 'restart.png';
	
var quitIcon = new Image();
	quitIcon.src = 'quitIcon.png';
	
var speed = 7;
