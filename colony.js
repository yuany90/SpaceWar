function Colony (map) {
  if (map.type == undefined) { 
	this.type = 0; 
  } else {
    this.type = map.type;
  }
  if (map.x == undefined){ map.x = 45;}
  if (map.y == undefined){ map.y = 45;}
  this.location = {x:map.x, y:map.y};
  if (map.country == undefined){ 
     this.countryIndex = 0;
  } else {
     this.countryIndex = map.country;
  }
  this.colorList = countryColor[this.countryIndex]; 
  if (map.radius == undefined){
    this.baseRadius = typeEnum[this.type].radius;
    this.radius = this.baseRadius;
  } else {
    this.baseRadius = map.radius;
	this.radius = map.radius;
  }
  
  this.scaleX = 1;
  this.scaleY = 1;
  if (this.type != "menu"){
    this.initalPopulation = typeEnum[this.type].initial;
    this.maxPopulation = typeEnum[this.type].maxPopulation;
	this.population = this.initalPopulation;
  }
  
  this.lineWidth = 0;
  this.army = 0;
  
  this.selected = false;
  this.clicked = false;
  this.sendArmy = false;
  this.enableSelect = true;
  
  
}

Colony.prototype.draw = function (ctx) {
  ctx.save();
  
  ctx.translate(this.location.x, this.location.y);
  ctx.scale(this.scaleX, this.scaleY);
  ctx.lineWidth = this.lineWidth;
  this.colorList = countryColor[this.countryIndex];
  
  if((this.sendArmy || this.type == "menu")&& this.countryIndex == 1){
	var gradient = ctx.createRadialGradient(0, 0, this.radius,
	0, 0, this.radius + 30);
	gradient.addColorStop(0, this.colorList[1]);
	gradient.addColorStop(1, 'rgba(' + '0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    //x, y, radius, start_angle, end_angle, anti-clockwise
    ctx.arc(0, 0, this.radius + 30, 0, (Math.PI * 2), true);
    ctx.closePath();
    ctx.fill();
  }
  
  
  ctx.globalAlpha *= this.colorList[2];
  ctx.fillStyle = this.colorList[1];
  ctx.beginPath();
  //x, y, radius, start_angle, end_angle, anti-clockwise
  ctx.arc(0, 0, this.radius, 0, (Math.PI * 2), true);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = this.colorList[0];
  ctx.beginPath();
  //x, y, radius, start_angle, end_angle, anti-clockwise
  ctx.arc(0, 0, Math.floor(this.radius*4.0/5), 0, (Math.PI * 2), true);
  ctx.closePath();
  ctx.fill();
  
  if(this.type != "menu"){
	var fillText = this.population.toString();
	ctx.fillStyle = this.colorList[3];
	ctx.fillText(fillText, -fillText.length * 5, 6);
  }
  
  
  ctx.restore();
};

Colony.prototype.develop = function(){
    if(this.countryIndex == 0){
	  if(this.population < this.initial){
	    this.population ++;
	  } else if(this.population > this.initial){
	    this.population --;
	  }
	} else {
	  if(this.population < this.maxPopulation){
		this.population ++;
	  } else if(this.population > this.maxPopulation){
		this.population --;
	  }
	}
}
Colony.prototype.size = function(){
	this.baseRadius =  Math.floor(typeEnum[this.type].radius 
		+ this.population/this.maxPopulation*10);
	if(this.radius < this.baseRadius){
	   this.radius +=0.5;
	} else if(this.radius > this.baseRadius){
	   this.radius -=0.5;
	}
}

Colony.prototype.boundary = function( l ){
	if( (l.x - this.location.x) * (l.x - this.location.x) + 
		(l.y - this.location.y) * (l.y - this.location.y)
		<= this.radius * this.radius ){
		return true;
	} else {
		return false;
	}
}

Colony.prototype.mouseListener = function(method, mouse){
    var value = this.boundary(mouse);
	if( method == "move" && this.country == 1){ // only self colony can be selected
	    this.selected = value;
		this.sendArmy = value;
	} else if( method == "click"){
	    this.clicked = value;
	}
	return value;
}