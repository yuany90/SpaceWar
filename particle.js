function Particle(start, end, color, speedRate,
	colony, invadeColony){
	this.reset(start, end, color, speedRate, 
	colony, invadeColony);
}
Particle.prototype.reset = function (start, end, color, 
	speedRate, colony, invadeColony){
	if(start == undefined){
		start = {x:0, y:0};
	} 
	if(end == undefined){
		end = {x:0, y:0};
	} 
	if(color == undefined){
	    color = "#ffffff";
	}
	if(speedRate == undefined){
	    speedRate = 7;
	}
	this.x = start.x + Math.random() * 10 - 5;
	this.y = start.y + Math.random() * 10 - 5;
	this.prevx = this.x;
	this.prevy = this.y;
	this.start = start;
	this.end = end;
	this.middle = {x:(start.x + end.x)/2, y:(start.y + end.y)/2};
	this.easing = speedRate / Math.sqrt(
							  (this.end.x - this.start.x) 
							* (this.end.x - this.start.x) 
							+ (this.end.y - this.start.y) 
							* (this.end.y - this.start.y));
	this.vx = (this.end.x - this.start.x) * this.easing;
	this.vy = (this.end.y - this.start.y) * this.easing;
	this.radius = 2;
	this.color = color;
	if(invadeColony != undefined && colony != undefined){
		this.colony = colony;
		this.invadeColony = invadeColony;
	}
	this.isAnimated = true;
}

Particle.prototype.draw = function (ctx) {
  if( this.isAnimated ){
	ctx.save();
	// ctx.strokeStyle = this.color;
	// ctx.beginPath();
	// ctx.moveTo(this.prevx, this.prevy);
	// ctx.lineTo(this.x, this.y);
	// ctx.stroke();
	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
	ctx.fill()
	ctx.restore();
  }
}

Particle.prototype.move = function (ctx) {
  if( this.isAnimated ){
	// this.vx = (this.end.x - this.x) * this.easing;
	// this.vy = (this.end.y - this.y) * this.easing;
	this.prevx = this.x;
	this.prevy = this.y;
	this.x += this.vx;
	this.y += this.vy;
  }
}

Particle.prototype.reach = function(){
	if(Math.abs(this.x - this.end.x) <= 10 
	&& Math.abs(this.y - this.end.y) <= 10
	&& this.isAnimated){
	  return true; //reach
	} else {
	  return false;
	}
}

Particle.prototype.arrived = function(){
	if(this.reach()){
		this.isAnimated = false;
		if( this.invadeColony.country === this.colony.country ){
			this.invadeColony.population ++;
		} else if( this.invadeColony.population <= 0 ){
		    var index = this.invadeColony.country.ownColonies
			.indexOf(this.invadeColony);
			this.invadeColony.country.ownColonies.splice(index, 1);
			this.invadeColony.country = this.colony.country;
			this.invadeColony.countryIndex = this.colony.countryIndex;
			this.colony.country.ownColonies.push(this.invadeColony);
			this.invadeColony.population ++;
		} else {
			this.invadeColony.population --;
		}
	}
} 