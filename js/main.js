var game = new Phaser.Game(800, 400, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update, render:render });
var player;
var held = []; // doing this because I legit forgot how to phaser
var objects_hit = 0;
for(let i = 0; i <8; i++)
	held[i] = false;
var front_obstacle = [];
function preload() {
	game.load.image('block', 'assets/img/block.png');
	game.load.image('jump', 'assets/img/jump.png');
	game.load.image('duck', 'assets/img/duck.png');
	game.load.image('sidestep', 'assets/img/sidestep.png');
	game.load.image('punch', 'assets/img/punch.png');
	game.load.image('longjump', 'assets/img/jump.png');
	game.load.image('grind', 'assets/img/duck.png');
	game.load.image('wallride', 'assets/img/sidestep.png');
	game.load.image('hack', 'assets/img/punch.png');
	game.load.image('star', 'assets/img/star.png');
	game.load.image('floor', 'assets/img/floor.png');
	game.load.image('hitline', 'assets/img/hitline.png');
	game.load.audio('30bpmsong', 'assets/audio/30BPMMetronome.mp3');
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
	
	//metronome = game.add.audio('30bpmsong');
	//metronome.play();
	
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
	
	//rect = new Phaser.Rectangle(100,200,100,100)
	graphics = game.add.graphics(100,200)
	graphics.beginFill(0xFF0000,0.5)
	graphics.drawRect(-64,0,384,32)
	graphics.endFill()
	graphics.beginFill(0x0FFFFF,0.5)
	graphics.drawRect(64,0,128,32)
	graphics.endFill()
	
	//rect.alpha = 0.5;
	window.graphics = graphics;
}

let note = [
	[1,0,0,0],
	[2,0,0,0],
	[3,0,0,0],
	[4,0,0,0],
	[5,0,0,0],
	[6,0,0,0],
	[7,0,0,0],
	[8,0,0,0],
]
let offset = 0.210;
noteplace = 0;
place = 0;
nextTime = offset;
row = 0;
function beat(){
	let bpm = 60; 
	let snap = 4;
	

	let i = note[row][noteplace]-1;
	if((game.time.now/1000)>=nextTime){
		if(note[row][noteplace]!=0){ 
			new Obstacles(game,900,208+offsets[i],names[i],names[i])
		}
		noteplace++;
		if(noteplace>snap-1){
			noteplace = 0;		
		}
		nextTime = (game.time.now/1000)+ offset+ ((60/bpm)/snap) ;
		place++;
		if(place % 4 == 0)
			row++
		// row +=3;
		if(row>=8)
			row=0;
	}

	/*
	if( (game.time.now/100) % 10 == 0 ){
		//console.log();
		row ++;
		if(row>8)
			row=0;
		
	}*/
	//}
}

function playHit(type){
	
	
}


function update() {	
	player.grounded = game.physics.arcade.collide(player, floor);
	// for(let i = 0;i<inputs.length;i++){
		// if(inputs[i].isDown&&!held[i]){ 
			// new Obstacles(game,900,208+offsets[i],'block',names[i])
			// held[i] = true;
		// }
		// if (inputs[i].isUp){
			// held[i] = false;
		// }
	// }
	beat();
	
	if(front_obstacle[0]!=null){
		//console.log(front_obstacle[0].type);
		if(front_obstacle[0]!=null){
			if(front_obstacle[0].body.x<=player.body.x-64){
				if(front_obstacle[0].missed==2&&front_obstacle[0].modified==false){ // handles misses for taps
					console.log("missed")
					front_obstacle[0].missed=0
				}
				front_obstacle[0].queued = false;
				front_obstacle.shift();
			}
		}
	}
	if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
		graphics.alpha = 1 - (graphics.alpha)
		//console.log(graphics.alpha);
	}
}
function render() {
    //game.debug.body(player);
	//game.debug.geom(rect,"#0FFFFF")
	
}

