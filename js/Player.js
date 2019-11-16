function Player(game, x, y, atlas,key) {	
	Phaser.Sprite.call(this, game, x, y,atlas, key);
	this.x = -200
	this.y = -200
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.scale.setTo(0.1422222); // just because the star is small
	game.physics.enable(this);
	this.x = x // super jank, I know. Prevents a frame of big character from appearing.
	this.y = y
	this.hitline = game.add.sprite(128+x,y,'hitline');
	
	game.add.existing(this);
	

	this.animations.add('punch',[0]);
	this.animations.add('sidestep',[1]);
	this.animations.add('jump',[2]);
	this.animations.add('slide',[3]);
	this.animations.add('idle',[4]);
	
	this.original_height = y;
	
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
	
	this.hit = false;
	this.hitTimeTracker = 0
	this.hitTime = 0.5
	
	this.body.setSize(700, 600, this.body.width/2, this.body.height/2+130);
	
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	this.movement();
	this.hurt();
}

Player.prototype.hurt = function(){
	if(this.hit){
		console.log("hi")
		this.hitTimeTracker = game.time.now + this.hitTime * 1000;
		this.hit = false;
		
	}
	
	if(this.hitTimeTracker > game.time.now){
		console.log("hi")
		// animation stuffs
		this.alpha= Math.abs(Math.sin((game.time.now/100)*Math.PI)); // normalizes it so that it happens every second if the number is 1000. 500 is every 2 seconds and so on.
	}else{
		this.alpha = 1;
	}
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
			this.hit = true;
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
	
	if(this.hold_up&&game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)&&this.y<this.original_height+10){
		this.y += 0.5
	}
	if(nullCheck()&&front_obstacle[0].started&&!this.hold_lefty&&!this.hold_up&&!this.hold_down&&!this.hold_righty){
		this.holding = false;
	}
	
	//console.log(this.holding)
	if(this.delayTimer<game.time.now){
		this.animations.play("idle")
		this.y = this.original_height+10;
		//console.log("hey")
		if(nullCheck()){
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
						this.animations.play("jump");
						this.y = this.original_height-50
						
					}else 
					if(this.hold_lefty){ // wall run
						if(nullCheck()&&front_obstacle[0].type=="wallride"){
							front_obstacle[0].started = true;
							this.holding = true;
						}
						this.y = this.original_height-35;
						this.animations.play("run")
					}else
					if(this.hold_down){ // grind
						if(nullCheck()&&front_obstacle[0].type=="grind"){
							front_obstacle[0].started = true;
							this.holding = true;
							this.y = this.original_height-20;
						}
						this.y = this.original_height-25;
						this.animations.play("slide")
					}else
					if(this.hold_righty){ // hack
						if(nullCheck()&&front_obstacle[0].type=="hack"){
							front_obstacle[0].started = true;
							this.holding = true;		
						}
						this.animations.play("punch")
					}	
				}else{
					if(this.up){ // jump
						this.hitCheck("jump");
						this.animations.play("jump");
						this.y = this.original_height-25;
					}
					if(this.down){ // duck
						this.hitCheck("duck");
						this.animations.play("slide")
					}
					if(this.lefty){ // side step
						this.hitCheck("sidestep");
						this.animations.play("sidestep")
					}
					if(this.righty){ // punch
						this.hitCheck("punch");
						this.animations.play("punch")
					}
				}
			}
		}
	}	
	if((this.hold_lefty||this.hold_up||this.hold_down||this.hold_righty)&&game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
		this.delayTimer = game.time.now + 100
	}
}