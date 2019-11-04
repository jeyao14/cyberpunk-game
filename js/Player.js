function Player(game, x, y, key) {	
	Phaser.Sprite.call(this, game, x, y, key);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.scale.setTo(2); // just because the star is small
	game.physics.enable(this);
	this.body.gravity.y = 5800; // apparently this little star is Goku
	this.grounded = false;
	
	// Ground work for future stuff
	this.phaseTime = 0;
	this.phaseDuration = 2;
	//
	this.side_stepping = false;
	this.wall_running = false;
	this.punching = false;
	this.hacking = false;
	this.grinding;
	game.add.existing(this);
	
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	this.movement();
}

Player.prototype.movement = function(){
	if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
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
		if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)&&this.grounded){ // duck
		
			this.body.setSize(24, 11, 0, 11);
		}else{
		
			this.body.setSize(24, 22, 0, 0);
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){ // side step
		
			this.side_stepping = true;
			this.tint = 0x000000
		}else{
			this.side_stepping = false;
			this.tint = 0xffffff
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){ // punch
			
			this.punching = true;
		}else{
			this.punching = false;
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