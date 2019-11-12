function Player(game, x, y, key) {	
	Phaser.Sprite.call(this, game, x, y, key);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.scale.setTo(2); // just because the star is small
	game.physics.enable(this);
	
	this.hitline = game.add.sprite(128+x,y,'hitline');
	
	game.add.existing(this);
	
	this.up = game.input.keyboard.isDown(Phaser.Keyboard.UP) ;
	this.down = game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ;
	this.lefty = game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ; // built-in phaser stuff strikes again
	this.righty = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ;
	this.hold_up = game.input.keyboard.isDown(Phaser.Keyboard.UP) ;
	this.hold_down = game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ;
	this.hold_lefty = game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ; // built-in phaser stuff strikes again
	this.hold_righty = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ;
	
	this.holding = false;
	
	this.delayTimer = 0; 
	this.delay = 0.5
	
	// I'll finish removing these last few physic components later
	this.default_gravity = 5800;
	this.body.gravity.y = this.default_gravity; // apparently this little star is Goku
	
	this.grounded = false;
	/* Physics system
	
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
	*/
	
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	this.movement();
	//this.hurt();
}

Player.prototype.hurt = function(){
	/*
	if(this.hit){
		this.hitTimeTracker = game.time.now + this.hitTime * 1000;
		this.hit = false;
	}
	if(this.hitTimeTracker > game.time.now){
		// animation stuffs
		this.alpha= Math.abs(Math.sin((game.time.now/100)*Math.PI)); // normalizes it so that it happens every second if the number is 1000. 500 is every 2 seconds and so on.
	}else{
		this.alpha = 1;
	}*/
	// if(front_obstacle[0]!=null){
		// if(front_obstacle[0].modified)
			// console.log("hey");
		// else
			// console.log("yo");
	// }
}
function nullCheck(){
	return front_obstacle[0]!=null
}
Player.prototype.hitCheck = function(type){
	if(nullCheck()&&Math.abs(this.hitline.x-front_obstacle[0].x)<64){
		if(nullCheck()&&front_obstacle[0].type==type){
			front_obstacle[0].queued = false;
			front_obstacle[0].missed = 0;
			front_obstacle.shift();
			console.log("hit");
			
		}		
	}else if(nullCheck()&&Math.abs(this.hitline.x-front_obstacle[0].x)<192){
		if(nullCheck()&&front_obstacle[0].type==type){
			front_obstacle[0].missed = 1;
			front_obstacle[0].queued = false;
			front_obstacle.shift();
			console.log("missed");
		}
	}
}
Player.prototype.movement = function(){
	this.up = game.input.keyboard.justPressed(Phaser.Keyboard.UP) ;
	this.down = game.input.keyboard.justPressed(Phaser.Keyboard.DOWN) ;
	this.lefty = game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) ;
	this.righty = game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) ;
	this.hold_up = game.input.keyboard.isDown(Phaser.Keyboard.UP) ;
	this.hold_down = game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ;
	this.hold_lefty = game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ;
	this.hold_righty = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ;
	if(nullCheck()&&this.delayTimer<game.time.now){
		if(this.up||this.down||this.lefty||this.righty){
			this.delayTimer = game.time.now + this.delay*1000
			if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
				if(this.hold_up){ // long jump
					if(Math.abs(this.hitline.x-front_obstacle[0].x)<64){
						
						if(nullCheck()&&front_obstacle[0].type=="longjump"){
							front_obstacle[0].started = true;
							this.holding = true;
						
						}
					}
				}else 
				if(this.hold_lefty){ // wall run
					if(nullCheck()&&front_obstacle[0].type=="wallride"){
							front_obstacle[0].started = true;
							this.holding = true;
						
						}
				}else
				if(this.hold_down){ // grind
					if(nullCheck()&&front_obstacle[0].type=="grind"){
						front_obstacle[0].started = true;
						this.holding = true;
					
					}
				}else
				if(this.hold_righty){ // hack
					if(nullCheck()&&front_obstacle[0].type=="hack"){
						front_obstacle[0].started = true;
						this.holding = true;
					
					}
				}
			}else{
			
				if(this.up){ // jump
					this.hitCheck("jump");
				}
				if(this.down){ // duck
					this.hitCheck("duck");
				}
				if(this.lefty){ // side step
					this.hitCheck("sidestep");
				}
				if(this.righty){ // punch
					this.hitCheck("punch");
				}
			}
		}
	}
	if(nullCheck()&&front_obstacle[0].started&&!this.hold_lefty&&!this.hold_up&&!this.hold_down&&!this.hold_righty){
		this.holding = false;
	}
	/* Physics system
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

	*/
}