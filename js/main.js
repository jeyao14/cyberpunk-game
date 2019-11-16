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
	game.load.image('star', 'assets/img/run.png');
	game.load.image('floor', 'assets/img/floor.png');
	game.load.image('hitline', 'assets/img/hitline.png');
	game.load.audio('30bpmsong', 'assets/audio/30BPMMetronome.mp3');
	game.load.atlas('playerAtlas','assets/img/spritesheet.png','assets/img/sprites.json')
}

function create() {
	game.stage.backgroundColor = "#292633";
	floor = game.add.sprite(0,240,'floor');
	//temp = game.add.sprite(200,240,'playerAtlas','run');
	floor.anchor.x = 0;
	floor.anchor.y = 0;
	game.physics.enable(floor); // I cannot for the life of me remember how to basic collision for phaser 
	floor.body.immovable = true;
	player = new Player(game,100,180,'playerAtlas','run');
	keyboard = game.input.keyboard;
	inputs = [];
	for(let i = 0;i<8;i++){
		inputs[i] = keyboard.addKey(49 + i);
	}
	
	metronome = game.add.audio('30bpmsong');
	metronome.play();
	
	metronome.volume = 0;
	offsets = [];
	names = [];
	offsets [0] = 0;
	offsets [1] = -64;
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
	
	order_text = game.add.text(30, 20)
	order_text.setText("In order");
	order_text.addColor('#ffffff',0)
	
	offset_text = game.add.text(400, 20)
	offset_text.setText("Offset: "+offset);
	offset_text.addColor('#ffffff',0)
	
	volume_text = game.add.text(200, 20)
	volume_text.setText("Music: Off");
	volume_text.addColor('#ffffff',0)
	
	//rect = new Phaser.Rectangle(100,200,100,100)
	graphics = game.add.graphics(100,200)
	graphics.beginFill(0xFF0000,0.5)
	graphics.drawRect(-64,-20,384,32)
	graphics.endFill()
	graphics.beginFill(0x0FFFFF,0.5)
	graphics.drawRect(64,-20,128,32)
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
let offset = -0.23;
noteplace = 0;
place = 8;
nextTime = offset;
row = 0;
time = 0
let in_order = true;
function beat(){
	let bpm = 30; 
	let snap = 4;
	
	let i = note[row][noteplace]-1;
	//console.log(nextTime);
	//time += game.time.physicsElapsed
	// console.log(offset)
	if((game.time.now/1000)>=nextTime+offset){
		if(note[row][noteplace]!=0){ 
			new Obstacles(game,900,208+offsets[i],names[i],names[i])
		}
		noteplace++;
		if(noteplace>snap-1){
			noteplace = 0;		
		}
		nextTime = 1*place*((60/bpm)/snap) ;
		//console.log(nextTime);
		place++;
		//place = Math.floor(game.time.now/1000)/
		if(place % 4 == 0){
			//console.log(game.time.now+" "+nextTime+" "+place);
			//console.log(time);
			if (in_order)
				row++
			else
				row = Math.floor(Math.random()*8+1);
		}
		if(row>=8)
			row=0;
	}
}

function playHit(type){
	
}

function update() {	
	player.grounded = game.physics.arcade.collide(player, floor);
	
	beat();
	
	if(front_obstacle[0]!=null){
		if(front_obstacle[0]!=null){
			if(front_obstacle[0].body.x<=player.body.x-64){
				if(front_obstacle[0].missed==2&&front_obstacle[0].modified==false){ // handles misses for taps
					console.log("missed")
					player.hit = true;
					front_obstacle[0].missed=0
				}
				front_obstacle[0].queued = false;
				front_obstacle.shift();
			}
		}
	}
	if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
		graphics.alpha = 1 - (graphics.alpha)
		order_text.alpha = 1 - order_text.alpha
		offset_text.alpha = 1 - offset_text.alpha
		volume_text.alpha = 1 - volume_text.alpha
	}
	if(game.input.keyboard.justPressed(Phaser.Keyboard.EQUALS)){
		offset += 0.01
		offset = parseFloat(offset.toFixed(2))
		offset_text.setText("Offset: "+offset);
	}
	if(game.input.keyboard.justPressed(Phaser.Keyboard.UNDERSCORE)){
		offset -= 0.01
		offset = parseFloat(offset.toFixed(2))
		offset_text.setText("Offset: "+offset);
	}	
	if(game.input.keyboard.justPressed(Phaser.Keyboard.C)){
		in_order = !in_order
		if(in_order)
			order_text.setText("In order")
		else
			order_text.setText("Random")
	}
	if(game.input.keyboard.justPressed(Phaser.Keyboard.V)){
		metronome.volume = 1 - metronome.volume
		if(metronome.volume == 1)
			volume_text.setText("Music: On");
		else
			volume_text.setText("Music: Off");
	}
}
function render() {
    //game.debug.body(player);
	//game.debug.geom(rect,"#0FFFFF")
	
}

