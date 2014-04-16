
function main() {
			// var video = document.getElementById('video');
			// video.width = window.innerWidth;
			// video.height = window.innerHeight;
  var canvas = document.getElementById('canvas'),
	  ctx = canvas.getContext('2d'),
	  mouse = {'x':0, 'y':0 },
	  numCountries = 3,
	  colonies = [],
	  countries = [],
	  particles = [],
	  scene = new Scene("loadGame", ctx, Date.now(), {'w': canvas.width, 'h': canvas.height});
  var userCountry, colony, country, particle;
	
  userCountry = countries[1];
  
  function setMouseCoord(event){
	var x, y, 
	body_scrollLeft = document.body.scrollLeft,
	element_scrollLeft = document.documentElement.scrollLeft,
	body_scrollTop = document.body.scrollTop,
	element_scrollTop = document.documentElement.scrollTop,
	offsetLeft = canvas.offsetLeft,
	offsetTop = canvas.offsetTop;
	if (event.pageX || event.pageY) {
	  x = event.pageX;
	  y = event.pageY;
	} else {
	  x = event.clientX + body_scrollLeft + element_scrollLeft;
	  y = event.clientY + body_scrollTop + element_scrollTop;
	}
	x -= offsetLeft;
	y -= offsetTop;
	mouse.x = x;
	mouse.y = y;
  }

  window.addEventListener('mousemove', function (event) {
	setMouseCoord(event);
	scene.onMouseMove(mouse);
  }, false);

  canvas.addEventListener('click', function (event) {
    setMouseCoord(event);
    scene.onMouseClick(mouse);
  }, false);
  
  var lastTime = 0, currTime, delta, perFrame = 800;
  (function drawFrame () {
	window.requestAnimationFrame(drawFrame, canvas);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#ffffff';
	ctx.globalAlpha = 1.0;
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	scene.draw();
  }());
};

window.onload = main;