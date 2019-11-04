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
	}
	
	Phaser.Sprite.call(this, game, x, y, key);
	game.physics.enable(this);
	this.scale.setTo( (this.widthy/32) , (this.heighty/32) );
	this.type = type;
	this.collided = false;
	this.body.velocity.x = -500;
	if(this.type=='wallride'){
		this.alpha=0.5;
	}
	if(this.type=='hack'){
		this.tint = 0x003142;
	}
	if(this.type=='grind'){
		this.tint = 0x000000;
		this.body.checkCollision.left = false;
		this.body.checkCollision.right = false;
		this.body.checkCollision.down = false;
	}
	game.add.existing(this);	
}
Obstacles.prototype = Object.create(Phaser.Sprite.prototype);
Obstacles.prototype.constructor = Obstacles;

Obstacles.prototype.update = function(){
	
	if(this.type!='sidestep'&&this.type!='wallride'&&this.type!='grind')
		overlapping = game.physics.arcade.overlap(player, this, null, null, this) // just gonna note that I tried 2 different methods that were more complicated and didn't work, only to look through old code and see this built-in function.
	else{
		if(this.type=='sidestep'&&!player.side_stepping)
			overlapping = game.physics.arcade.overlap(player, this, null, null, this)
		

		if(this.type=='wallride'&&!player.wall_running)
			overlapping = game.physics.arcade.overlap(player, this, null, null, this)
	
	}
	if(this.type=='grind'){
		this.body.y = 208; // without this, the rail gets banished to the shadow realm. 
		
		player.grinding = game.physics.arcade.collide(player, this);
		if(!player.grinding){
			overlapping = game.physics.arcade.overlap(player, this, null, null, this)
		}
		game.physics.arcade.collide(this, floor);

		
	}
	
	if(this.type=='punch'&&player.punching==true){
		if(this.x-player.x>0&&this.x-player.x<64){
			this.kill()
			this.destroy()
		}
	}
	if(this.type=='hack'&&player.hacking==true){
		if(this.x-player.x>0&&this.x-player.x<64){
			this.kill()
			this.destroy()
		}
	}
	
	if(this.x<-300){
		this.kill();
		this.destroy();
		//console.log("destroyed");
	}
	if(overlapping&&!this.collided){
		objects_hit++;
		this.collided=true;
		text.setText("Objects hit: "+objects_hit);
	}
}
