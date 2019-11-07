function Player(game, x, y, key) {	
	Phaser.Sprite.call(this, game, x, y, key);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.scale.setTo(2); // just because the star is small
	game.physics.enable(this);
	this.default_gravity = 5800;
	this.body.gravity.y = this.default_gravity; // apparently this little star is Goku
	
	this.grounded = false;
	
	// duck handling stuff
	this.duckTime = 0;
	this.duckNext = 0;
	this.duckDuration = 0.5;
	this.duckCoolDown = this.duckDuration+0.2;
	//
	
	// phase/sidestep handling
	this.phaseTime = 0;
	this.phaseNext = 0;
	this.phaseDuration = 0.5;
	this.phaseCoolDown = this.phaseDuration+0.2;
	//
	
	this.punchTime = 0;
	this.punchNext = 0;
	this.punchDuration = 0.2;
	this.punchCoolDown = this.punchDuration+0.3;
	this.fist = game.add.sprite(this.body.x + 64,this.body.y,'block');
	this.fist.alpha = 0;
	
	this.side_stepping = false;
	this.wall_running = false;
	this.punching = false;
	this.hacking = false;
	this.grinding;
	
	this.hit = false;
	this.hitTime = 1;
	this.hitTimeTracker = 0;
	game.add.existing(this);
	
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	this.movement();
	this.hurt();
}

Player.prototype.hurt = function(){
	if(this.hit){
		this.hitTimeTracker = game.time.now + this.hitTime * 1000;
		this.hit = false;
	}
	if(this.hitTimeTracker > game.time.now){
		// animation stuffs
		this.alpha= Math.abs(Math.sin((game.time.now/100)*Math.PI)); // normalizes it so that it happens every second if the number is 1000. 500 is every 2 seconds and so on.
	}else{
		this.alpha = 1;
	}
	// if(front_obstacle[0]!=null){
		// if(front_obstacle[0].modified)
			// console.log("hey");
		// else
			// console.log("yo");
	// }
}

Player.prototype.movement = function(){
	if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
	//if(front_obstacle[0]!=null&&front_obstacle[0].modified){
		//console.log("hi")
		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)&&this.grounded){ // long jump
		
			this.body.velocity.y = -1500;
		}
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)&&this.grounded){ // long jump
		
			this.body.velocity.y = -1800;
			this.wall_running = true;
			this.tint = 0x000000
		}else if(this.grounded){
			this.wall_running = false;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)&&this.grounded){ // long jump
		
			this.body.velocity.y = -1000;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){ // punch
			this.hacking = true;
		}else{	
			this.hacking = false;
			
		}
	}else{
	
		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)&&this.grounded){ // jump
		
			this.body.velocity.y = -1100;
		}
		if(this.duckNext<game.time.now&&game.input.keyboard.isDown(Phaser.Keyboard.DOWN)&&this.grounded){ // duck
			this.duckTime = game.time.now + (this.duckDuration*1000);
			this.duckNext = game.time.now + (this.duckCoolDown*1000);
		}
		if(this.duckTime>game.time.now){
			this.body.setSize(24, 11, 0, 11);
		}else{
		
			this.body.setSize(24, 22, 0, 0);
		}
		
		if(this.phaseNext<game.time.now&&game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)){ // side step
		
			this.side_stepping = true;
			this.phaseTime = game.time.now + (this.phaseDuration*1000);
			this.phaseNext = game.time.now + (this.phaseCoolDown*1000);
			
			this.tint = 0x000000
		}
		if(this.phaseTime<game.time.now){
			this.side_stepping = false;
			this.tint = 0xffffff
			//console.log(this.phaseTime)
		}
		
		if(this.punchNext<game.time.now&&game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){ // punch
			this.punchTime = game.time.now + (this.punchDuration*1000);
			this.punchNext = game.time.now + (this.punchCoolDown*1000);
		}
		if(this.punchTime>game.time.now){
			this.punching = true;
			this.fist.alpha = 1;
		}else{
			this.punching = false;
			this.fist.alpha = 0;
		}
	}

	// Special cases 
	if(this.wall_running&&!this.grounded){
		this.tint = 0x000000;
	}else if(!this.side_stepping){
		this.tint = 0xffffff
	}
	if(this.grinding){
		this.body.gravity.y = 0;
	}else{
		this.body.gravity.y = 5800;
	}

	
}