function Scene(name, ctx, time, size){
	this.state = name;
	this.ctx = ctx;
	this.lastTime = time;
	this.currTime = time;
	this.size = size;
	// variables for showMenu function
	this.newGameColony = new Colony(
		{'type': 'menu',  'x': 233,  'y':319,  'country': 1, 'radius': 85});
	this.quitColony = new Colony(
		{'type': 'menu', 'x': 455,  'y':287,  'country': 2, 'radius': 65});
	this.menuParticles = [];
	for(var i = 0; i < 25; i++){
		var particle = new Particle(
		{x:Math.random()* this.size.w, y:Math.random()* this.size.h},
		{x:Math.random()* this.size.w, y:Math.random()* this.size.h},
		'#f0f903', 1);
		this.menuParticles.push(particle);
	}
	this.leaveMenuforGame = false;
	this.leaveMenuforQuit = false;
	this.gameLevel = 0;
	// variables for onGame function
	this.game = new Game(Map[this.gameLevel], this.size);
	
	this.globalOpacity = 1.0;
}

Scene.prototype.loadGame = function(){
	this.currTime = Date.now();
	var loadModule = "Loading module";
	var loadImage = "Loading image";
	this.ctx.fillStyle = "white";
	this.ctx.font = "18px Adair";
	this.ctx.fillText(loadModule, 20, 20);
	if (this.timeOut(500)) this.ctx.fillText(loadImage, 20, 40);
	if (this.timeOut(1000)) this.switchSence("showMenu");
}

Scene.prototype.showMenu = function(){
	this.currTime = Date.now();
	
	if( this.leaveMenuforGame || this.leaveMenuforQuit ){ // leave this scene
		
		this.newGameColony.clicked = false;
		this.quitColony.clicked = false;
		this.ctx.globalAlpha = this.globalOpacity;
		this.ctx.drawImage(logo, 0, 0);
		this.newGameColony.draw(this.ctx);
		this.quitColony.draw(this.ctx);
		this.ctx.drawImage(newgameIcon, 0, 0);
		this.ctx.drawImage(quitgameIcon, 0, 0);
		this.globalOpacity -= 0.03;
		
		if(this.globalOpacity <= 0.0){
			if(this.leaveMenuforGame){
				this.leaveMenuforGame = false;
				this.switchSence("onGame");
			}
			if(this.leaveMenuforQuit){
				this.leaveMenuforQuit = false;
				this.switchSence("quit");
			}
		}
		
	} else if(this.timeOut(1000)){
	
		this.ctx.globalAlpha = this.globalOpacity;
		this.ctx.drawImage(logo, 0, 0);
		this.newGameColony.draw(this.ctx);
		this.quitColony.draw(this.ctx);
		this.ctx.drawImage(newgameIcon, 0, 0);
		this.ctx.drawImage(quitgameIcon, 0, 0)
		// this.ctx.lineWidth = 6;
		
		this.leaveMenuforGame = this.newGameColony.clicked;
		this.leaveMenuforQuit = this.quitColony.clicked;
		
		for(var i = 0; i < 25; i++){
			this.menuParticles[i].move();
			this.menuParticles[i].draw(this.ctx);
			if(this.menuParticles[i].reach()){
				var start = {x: this.menuParticles[i].x, y: this.menuParticles[i].y};
				this.menuParticles[i].reset( start,
				{x:Math.random()* this.size.w, y:Math.random()* this.size.h},
				'#f0f903', 1
				);
			}
			if(this.leaveMenuforGame){
				this.leaveMenuforGame = this.leaveMenuforGame && this.newGameColony.boundary(
				{x:this.menuParticles[i].x, y: this.menuParticles[i].y});
			} 
			if(this.leaveMenuforQuit){
				this.leaveMenuforQuit = this.leaveMenuforQuit && this.quitColony.boundary(
				{x:this.menuParticles[i].x, y: this.menuParticles[i].y});
				
			}
		}

	} else { // enter this scene
	
		var second = (this.currTime - this.lastTime)/1000.0;
		//this.ctx.drawImage(logo, -600 + 600 * second , 0);
		this.ctx.globalAlpha = second;
		this.ctx.drawImage(logo, -60 + 60 * second , 0);
		// this.newGameColony.draw(this.ctx);
		// this.quitColony.draw(this.ctx);
		this.ctx.drawImage(newgameIcon, 0, 0);
		this.ctx.drawImage(quitgameIcon, 0, 0);
		
	}
}

Scene.prototype.onGame = function(){
	if(this.game.lastTime == 0) this.game.lastTime = Date.now();
	this.game.draw(this.ctx);
	if(this.game.exitGame){
		this.game.setup();
		this.switchSence("showMenu");
	} else if(this.game.nextGame){
		if(this.gameLevel < Map.length - 1){
			this.gameLevel ++; 
			this.game.map = Map[this.gameLevel];
			this.game.setup();
		} else {
			this.gameLevel = 0;
			this.game.map = Map[this.gameLevel];
			this.game.setup();
			this.switchSence("showMenu");
		}
	}
}

Scene.prototype.quit = function(){
	this.ctx.fillStyle = "#484848";
	this.ctx.font = "bold 50px Adair";
	this.ctx.fillText("Bye", this.size.w/2 - 25, this.size.h/2);
	//this.ctx.fillRect(0, 0, this.size.w, this.size.h);
}

Scene.prototype.updateLastTime = function(){
	this.lastTime = this.currTime;
}

Scene.prototype.timeOut = function(microSecond){
	if((this.currTime - this.lastTime) >= microSecond){
		return true;
	} else {
		return false;
	}
}

Scene.prototype.fadeOut = function(time){
	this.globalOpacity = time;
}

Scene.prototype.switchSence = function(name){
	this.updateLastTime();
	this.state = name;
	this.ctx.globalAlpha = 1.0; // default globalAlpha
	this.ctx.font = "bold 16px Lucida Sans"; // default font
}

Scene.prototype.draw = function(){
	if(this.state == "loadGame") this.loadGame();
	if(this.state == "showMenu") this.showMenu();
	if(this.state == "onGame") this.onGame();
	if(this.state == "quit") this.quit();
}

Scene.prototype.onMouseClick = function(m){
	if(this.state == "showMenu"){
		for(var i = 0; i < 25; i++){
				var start = {x: this.menuParticles[i].x, y: this.menuParticles[i].y};
				this.menuParticles[i].reset( start,
				{x: m.x, y: m.y},
				'#f0f903', 9
				);
		}
		if(!this.newGameColony.clicked)
			this.newGameColony.mouseListener('click', m);
		if(!this.quitColony.clicked)
			this.quitColony.mouseListener('click', m)
	} else if(this.state == "onGame"){
		this.game.onMouseClick(m);
	}
}

Scene.prototype.onMouseMove = function(m){
	if(this.state == "onGame"){
		this.game.onMouseMove(m);
	}
}