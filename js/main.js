var game = new Phaser.Game(800, 400, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update, render:render });
var player;
var held = []; // doing this because I legit forgot how to phaser
var objects_hit = 0;
for(let i = 0; i <8; i++)
	held[i] = false;
function preload() {
	game.load.image('block', 'assets/img/block.png');
	game.load.image('star', 'assets/img/star.png');
	game.load.image('floor', 'assets/img/floor.png');
}

function create() {
	game.stage.backgroundColor = "#292633";
	floor = game.add.sprite(0,240,'floor');
	floor.anchor.x = 0;
	floor.anchor.y = 0;
	game.physics.enable(floor); // I cannot for the life of me remember how to basic collision for phaser 
	floor.body.immovable = true;
	player = new Player(game,100,200,'star');
	keyboard = game.input.keyboard;
	inputs = [];
	for(let i = 0;i<8;i++){
		inputs[i] = keyboard.addKey(49 + i);
	}
	offsets = [];
	names = [];
	offsets [0] = 0;
	offsets [1] = -32;
	offsets [2] = -160;
	offsets [3] = -160;
	offsets [4] = 0;
	offsets [5] = 0;
	offsets [6] = -128;
	offsets [7] = -160;
	names[0] = 'jump';
	names[1] = 'duck';
	names[2] = 'sidestep';
	names[3] = 'punch';
	names[4] = 'longjump';
	names[5] = 'grind';
	names[6] = 'wallride';
	names[7] = 'hack';
	text = game.add.text(600, 20)
	text.setText("Objects hit: "+objects_hit);
	text.addColor('#ffffff',0)
}

function update() {	
	player.grounded = game.physics.arcade.collide(player, floor);
	for(let i = 0;i<inputs.length;i++){
		if(inputs[i].isDown&&!held[i]){ 
			new Obstacles(game,900,208+offsets[i],'block',names[i])
			held[i] = true;
		}
		if (inputs[i].isUp){
			held[i] = false;
		}
	}
}
function render() {
    game.debug.body(player);
}

