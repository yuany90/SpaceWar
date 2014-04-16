function Game(map, size){

  this.map = map;
  this.size = size;
  this.setup();
 
}

Game.prototype.setup = function(){
  this.colonies = [];
  this.countriesIndex = [];
  this.countries = [];
  this.particles = [];
  this.userCountry = null;
  
  this.lastTime = 0;
  this.victory = false;
  this.lose = false;
  this.exitGame = false;
  this.nextGame = false;
  this.ratio = 0;
  this.iconDegree = 0;
  this.pause = false;
  
  for(var i = 0; i < this.map.length; i++){
	var colony = new Colony(this.map[i]);
	var index = this.map[i].country;
	if( this.countriesIndex.indexOf(index) == -1 ){
		this.countriesIndex.push(index);
		
	}
	this.colonies.push(colony);
  }
  
  for(var i = 0; i < this.countriesIndex.length; i++){
    var index = this.countriesIndex[i];
	var country = new Country(index);
	country.allColonies = this.colonies;
	country.ownColonies = [];
	for(var j = 0; j < this.colonies.length; j++){
		if(this.colonies[j].countryIndex == index){
		   country.ownColonies.push(this.colonies[j]);
		   this.colonies[j].country = country;
		}
	}
	this.countries.push(country);
  }
  
  this.userCountry = this.countries[0];
}

Game.prototype.onMouseMove = function(m){
	// check if colony is selected
	if(this.pause) return;
	for(var i = 0; i < this.userCountry.ownColonies.length; i++){
	  var userColony = this.userCountry.ownColonies[i];
	  if( userColony.mouseListener('move', m) 
		 && userColony.enableSelect){
			  userColony.sendArmy = true;
		  }
	}
	// if(!select){
		// for(var i = 0; i < this.userCountry.ownColonies.length; i++){
			// this.userCountry.ownColonies[i].enableSelect = true;
		// }
	// }
	// After invasion, the colony enableSelect was false,
	// check to see whether to set it to true or not
	if(this.userCountry.invadeColony != null){  
	  var mouseIn = 
	   this.userCountry.invadeColony.mouseListener('move', m);
	  if( !mouseIn ){
	   this.userCountry.invadeColony.enableSelect = true;
	  }
	}
	
}

Game.prototype.onMouseClick = function(m){
	
	if(this.pause){
		if(m.x >= this.size.w/2 - 37 && 
		m.x <= this.size.w/2 + 37 && m.y >= this.size.h/2 - 37 
		&& m.y <= this.size.h/2 + 37)
		this.pause = false;
		return;
	}
	if(m.x <= this.size.w - 20 && m.x >= this.size.w - 60
	&& m.y <= 50 && m.y >= 10) {
		this.pause = true;
		return;
	} 

	if(m.x <= this.size.w - 60 && m.x >= this.size.w - 100
	&& m.y <= 50 && m.y >= 10){
		this.setup();
		return;
	}
	if(m.x <= this.size.w - 100 && m.x >= this.size.w - 140
	&& m.y <= 50 && m.y >= 10){
		this.exitGame = true;
		return;
	}
	var on = false;
	for(var i = 0; i < this.colonies.length; i++){
	  if(this.colonies[i].mouseListener('click', m)){
		on = true;
		this.userCountry.invade = true;
		this.userCountry.invadeColony = this.colonies[i];
		//alert(this.userCountry.invadeColony);
		this.userCountry.invadeColony.enableSelect = false;
		break;
	  }
	}
	if(!on){ // no colony is clicked, cancel transferring army
	  for(var i=0; i < this.userCountry.ownColonies.length; i++){
		 this.userCountry.ownColonies[i].sendArmy = false;
	  }
	}
}

Game.prototype.interval = function(microSecond){
	delta = Date.now() - this.lastTime;
	if(delta > microSecond){
		this.lastTime = Date.now();
		return true;
	} else {
		return false;
	}
}

Game.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.size.w - 120, 30);
	ctx.drawImage(quitIcon, -20, -20, 40, 40);
	ctx.translate(40, 0);
	ctx.drawImage(restartIcon, -20, -20, 40, 40);
	ctx.translate(40, 0);
	ctx.rotate(this.iconDegree*Math.PI);
	ctx.drawImage(pauseIcon, -20, -20, 40, 40);
	ctx.restore();
	
	this.callFunc(this.colonies, 'draw', ctx);
	this.callFunc(this.particles, 'draw', ctx);
	if (this.lose){
		ctx.drawImage( extinct, 
		this.size.w/2 - extinct.width * this.ratio/2,
		this.size.h/2 - extinct.height * this.ratio/2,  
		extinct.width * this.ratio, 
		extinct.height * this.ratio);
	} else if (this.victory){
		ctx.drawImage( dominant, 
		this.size.w/2 - dominant.width * this.ratio/2,
		this.size.h/2 - dominant.height * this.ratio/2,  
		dominant.width * this.ratio, 
		dominant.height * this.ratio);
	}
	
	if(this.pause){
		ctx.save();
		ctx.fillStyle = 'rgba(' + '255, 255, 255, 0.3)';
		ctx.fillRect(0,0,this.size.w, this.size.h);
		ctx.drawImage(playIcon, 260, 200);
		ctx.restore();
	} else {
		this.iconDegree += 0.01;
		if(this.interval(500)){
			this.callFunc(this.countries, 'ai');
			this.callFunc(this.colonies, 'develop');
		}
		this.callFunc(this.countries, 'invade');
		this.callFunc(this.colonies, 'transferArmy');

		if(this.particles.length > 0){
			this.callFunc(this.particles, 'move');
			this.callFunc(this.particles, 'arrived');
		}
	
		if (this.lose){
			this.ratio += 0.02;
			if(this.ratio >= 1.5) this.exitGame = true;
			
		} else if (this.victory){
			this.ratio += 0.02;
			if(this.ratio >= 1.5) this.nextGame = true;
		} else {
			this.checkstate();
		}
	}
	
}
  
Game.prototype.callFunc = function( objects, method, arguments){
	for(var i = 0; i< objects.length; i++ ){
		if(method == 'draw') objects[i].draw(arguments);
		if(method == 'develop') objects[i].develop();
		if(method == 'ai') objects[i].ai();
		if(method == 'move') objects[i].move();
		if(method == 'arrived') objects[i].arrived();
		if(method == 'invade') this.invade(objects[i]);
		if(method == 'callArmy') this.callArmy(objects[i]);
		if(method == 'transferArmy') this.transferArmy(objects[i]);
	}
}

Game.prototype.invade = function(country){
	if(country.invade && country.ownColonies.length > 0){
		this.callFunc(country.ownColonies, 'callArmy')
		country.invade = false;
	}
}
  
Game.prototype.callArmy = function(colony){
  if(colony.sendArmy){
	if(colony === colony.country.invadeColony){
		colony.army = 0;
	} else {
		colony.army = Math.floor(colony.population/2);
	}
  }
}

Game.prototype.transferArmy = function(colony){
  if(colony.army > 0){
	colony.army --;
	colony.population --;
	var particlesIndex = 0;
	
	var invadeColony = colony.country.invadeColony;
	while( particlesIndex < this.particles.length){
		if( !this.particles[particlesIndex].isAnimated ){
			this.particles[particlesIndex].reset(
				colony.location, 
				invadeColony.location, 
				colony.colorList[0], speed,
				colony, invadeColony);
			return;
		}
		particlesIndex++;
	}
	if(particlesIndex >= this.particles.length){
		var particle = new Particle(
			colony.location, 
			invadeColony.location, 
			colony.colorList[0], speed, 
			colony, invadeColony);
		this.particles.push(particle);
	}
  } 

Game.prototype.checkstate = function(){
	var usercountryIndex = this.userCountry.country;
	var victory = true;
	for(var i = 0; i < this.colonies.length; i++){
		if (this.colonies[i].countryIndex != usercountryIndex
		 && this.colonies[i].countryIndex != 0) {
			victory = false;
			break;
		}
	}
	this.victory = victory;
	if(this.userCountry.ownColonies.length <= 0){
		this.lose = true;
	}
}
  
Game.prototype.victory = function(){

}

Game.prototype.lose = function(){
}
}