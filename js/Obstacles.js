function Obstacles(game, x, y, key,type) {	
	this.widthy = 32; // phaser has prebuilt height and width -_-
	this.heighty = 32;
	if(type=='jump'){
		this.widthy = 32;
		this.heighty = 32;
	}
	if(type=='duck'){
		this.widthy = 32;
		this.heighty = 32;
	}
	if(type=='sidestep'){
		this.heighty = 192;	
	}
	if(type=='punch'){
		this.heighty = 192;
	}
	 if(type=='longjump'){
		 this.widthy = 160;
	 }
	if(type=='grind'){
		this.widthy = 256;
		height = 64;
		
	}
	if(type=='wallride'){
		this.widthy = 160
		this.heighty = 160
	}
	if(type=='hack'){
		this.heighty = 192;
		this.widthy = 192
	}
	this.started = false;
	this.ended = false;
	this.missed = 2; // 0 for hit, 1 for missed timing, 2 for no hit
	Phaser.Sprite.call(this, game, x, y, key);
	game.physics.enable(this);
	this.scale.setTo( (this.widthy/32) , (this.heighty/32) );
	this.type = type;
	this.collided = false;
	this.body.velocity.x = -500;
	// if(this.type=='wallride'){
		// this.alpha=0.5;
	// }
	// if(this.type=='hack'){
		// this.tint = 0x003142;
	// }
	if(this.type=='grind'){
		//this.tint = 0x000000;
		this.body.checkCollision.left = false;
		this.body.checkCollision.right = false;
		this.body.checkCollision.down = false;
	}
	this.modified = false;
	if(this.type=='wallride'||this.type=='grind'||this.type=='longjump'||this.type=='hack')
		this.modified = true;
	
	if(this.modified)
		this.alpha=0.5;
	
	front_obstacle.push(this);

	game.add.existing(this);	
	
}
Obstacles.prototype = Object.create(Phaser.Sprite.prototype);
Obstacles.prototype.constructor = Obstacles;

Obstacles.prototype.update = function(){
	if(this.x<-300){
		this.kill();
		this.destroy();
		if(this.missed == 2){
			console.log("missed")
		}
	}

	if(this.started&&player.holding&&game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
		if(this.x+this.width<=player.x){
			this.ended = true
			console.log(this.type + " hold successful")
			this.missed = 0;
		}
	}else if (this.started&&!this.ended){
		if(!player.holding||!game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
			console.log(this.type + " hold dropped");
			this.missed = 1;
		}
	}
}
