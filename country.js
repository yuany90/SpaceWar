function Country(country){
  this.country = country;
  this.invade = false;
  this.invadeColony = null;
  this.ownColonies = [];
  this.selectColony = null;
  this.allColonies = null;
}

Country.prototype.ai = function (){
  var time = Math.floor(Math.random() * 2);
  if(time > 0) return;
  if(this.ownColonies.length > 0 && this.country > 1){
    var select = 1;
    var i = Math.floor( Math.random() * this.ownColonies.length );
	var max = 6;
	for(i = 0; i < this.ownColonies.length; i++){
		if(this.ownColonies[i].population > max){
			max = this.ownColonies[i].population;
			this.selectColony = this.ownColonies[i];
			this.selectColony.sendArmy = true;
		}
	}
	// if ( this.ownColonies[i].population > 10 ){
	  // this.selectColony = this.ownColonies[i];
	  // this.ownColonies[i].sendArmy = true;
	  // select --;
	// }
    if(this.selectColony != null){
	  i = Math.floor( Math.random() * this.allColonies.length );
	  var min = 999;
	  for(i = 0; i < this.allColonies.length; i++){
		if(this.allColonies[i].population < min && 
		this.allColonies[i].countryIndex != this.country){
			min = this.allColonies[i].population;
			this.invadeColony = this.allColonies[i];
		}
	  }
	  if(this.invadeColony === this.selectColony ||
	  this.invadeColony.population >= (this.selectColony.population) ||
	  this.selectColony.army > 0){
		this.invade = false;
		this.selectColony.sendArmy = false;
	  } else {
		this.invade = true;
	  }
	}
  }
}
