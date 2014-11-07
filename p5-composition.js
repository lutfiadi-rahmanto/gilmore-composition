var sectors=[];
var colorSet1 = [
	{h: 0,s: 86,v: 92},
	{h: 10,s: 86,v: 92},
	{h: 20,s: 86,v: 92},
	{h: 30,s: 80,v: 92},
	{h: 40,s: 75,v: 92},
	{h: 50,s: 60,v: 81},
	{h: 60,s: 45,v: 81},
	{h: 96,s: 29,v: 81},
	{h: 155,s: 34,v: 75},
	{h: 176,s: 54,v: 67},
];

var colorSet2 = [
	{h: 1,s: 87,v: 94},
	{h: 4,s: 80,v: 89},
	{h: 5,s: 70,v: 87},
	{h: 7,s: 51,v: 77},
	{h: 13,s: 24,v: 63},
	{h: 203,s: 28,v: 57},
	{h: 191,s: 86,v: 55},
	{h: 189,s: 92,v: 43},
	{h: 196,s: 96,v: 35},
	{h: 200,s: 98,v: 25},
];

var timer;
var degree = 0;
var multiplier;
var displacement;
var hsv = 'h';
var whichSet = '1';
var isStop = false;

function setup() {

	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 360, 100, 100);
	noStroke();

	timer = new Timer(16);
  	timer.start();

	for(var i = 0; i < 6; i++){
		sectors[i] = new Sector(60, 30 + i * 60, 25, 12, colorSet1);
	}
}

function draw() {
  background(20);

  if (timer.isFinished()) {
    
    for(var i = 0; i < 6; i++){
    	if(whichSet=='1')
			sectors[i].multiplyHSV(hsv, colorSet1);
		else if(whichSet=='2')
			sectors[i].increaseHSV(hsv, colorSet2);
	}

    multiplier = (Math.sin(2 * Math.PI * degree / 360)/2) + 0.5;
    displacement360 = 360 * ((Math.sin(2 * Math.PI * degree / 360)/2) + 0.5);

    if(!isStop){
    	degree = degree + 0.66;	
    }
    
    
  }

  for(var i = 0; i < 6; i++){
		sectors[i].drawDiamonds();
	}

  sectors[0].drawSatellite();

  //Text
  textSize(14);
  fill(80);

  var HSVAnchor = 30;
  text("HSV : ", 10, HSVAnchor)
  switch(hsv){
  	case 'h':
  		text("Hue ", 54, HSVAnchor);
  		break;
  	case 's':
  		text("Saturation ", 54, HSVAnchor);
  		break;
  	case 'v':
  		text("Value ", 54, HSVAnchor);
  		break;
  }
  text("'h' - hue", 10, HSVAnchor + 18);
  text("'s' - saturation", 10, HSVAnchor + 36);
  text("'v' - value", 10, HSVAnchor + 54); 


  var colAnchor = 120;
  text("Color Set : ", 10, colAnchor)
  switch(whichSet){
  	case '1':
  		text("Set 1 ", 84, colAnchor);
  		break;
  	case '2':
  		text("Set 2 ", 84, colAnchor);
  		break;
  }
  text("'1' - Set 1", 10, colAnchor + 18);
  text("'2' - Set 2", 10, colAnchor + 36);

  text("Press 'p' to pause/continue", 10, 192)

}

var Sector = function(angle, disAngle, levelRad, level, colors){
	this.angle = angle;
	this.disAngle = disAngle;
	this.levelRad = levelRad;
	this.level = level;
	this.fences = [];
	this.floors = [];
	this.diamondC = [];
	this.colors = $.extend(true, [], colors);

	this.maxOfColors = {};

	for(var i = 0; i < level; i++){
		this.fences[i] = {};
		this.fences[i].y = (levelRad * i) * Math.cos((angle/2) * Math.PI / 180);
		this.fences[i].xl = -(levelRad * i) * Math.sin((angle/2) * Math.PI / 180);
		this.fences[i].xr = (levelRad * i) * Math.sin((angle/2) * Math.PI / 180);
		this.fences[i].l = this.fences[i].xr * 2; 

		this.floors[i] = [];
		for(var j = 0; j <= i; j++){
			this.floors[i][j] = {};
			if (i!=0)
				this.floors[i][j].x = this.fences[i].xl + j * this.fences[i].l / i;
			else
				this.floors[i][j].x = this.fences[i].xl;
			this.floors[i][j].y = this.fences[i].y;
		}
	}

	for(var i = 0; i < level-2; i++){
		this.diamondC[i] = [];
		for(var j = 0; j <= i; j++){
			this.diamondC[i][j] = {};
			this.diamondC[i][j].bottom = this.floors[i][j];
			this.diamondC[i][j].left = this.floors[i+1][j];
			this.diamondC[i][j].right = this.floors[i+1][j+1];
			this.diamondC[i][j].top = this.floors[i+2][j+1];
		}
	}
}

Sector.prototype.drawDiamonds = function(){

	push();
  	translate(windowWidth/2, windowHeight/2);
  	rotate(Math.PI * this.disAngle/180);

	for(var i = 0; i < this.diamondC.length; i++){
		for(var j = 0; j < this.diamondC[i].length; j++){
			fill(this.colors[i].h, this.colors[i].s, this.colors[i].v);
			quad(this.diamondC[i][j].bottom.x, this.diamondC[i][j].bottom.y,
			     this.diamondC[i][j].left.x, this.diamondC[i][j].left.y,
			     this.diamondC[i][j].top.x, this.diamondC[i][j].top.y,
			     this.diamondC[i][j].right.x, this.diamondC[i][j].right.y
				);
		}
	}

	pop();
}	

Sector.prototype.drawSatellite = function(){

	var satWidth = 0.8 * (this.levelRad) * Math.sin((this.angle/2) * Math.PI / 180);
	var satHeight = 0.8 * (this.levelRad) * Math.cos((this.angle/2) * Math.PI / 180);

	for(var i = 0; i < this.colors.length; i++){
		push();
		translate(windowWidth/2, windowHeight/2);
		rotate(-Math.PI * (90 + this.colors[i].h)/180);
		translate(0, this.levelRad * this.level);
		fill(this.colors[i].h, this.colors[i].s, this.colors[i].v);
		quad(0, satHeight, -satWidth, 0, 0, -satHeight, satWidth, 0);
		pop();
	}
}

Sector.prototype.increaseHSV = function(hsv, colorSet){
	for(var i = 0; i < this.colors.length; i++){
		this.colors[i].h = colorSet[i].h;
		this.colors[i].s = colorSet[i].s;
		this.colors[i].v = colorSet[i].v;
		switch(hsv){
			case 'h':
				this.colors[i].h = (colorSet[i].h + displacement360)%360;
				break;
			case 's':
				this.colors[i].s = (colorSet[i].s + displacement360)%360;
				break;
			case 'v':
				this.colors[i].v = (colorSet[i].v + displacement360)%360;
				break;
		}
	}
}

Sector.prototype.multiplyHSV = function(hsv, colorSet){

	this.maxOfColors.h = Math.max.apply(Math,(colorSet).map(function(o){return o.h;}))
	this.maxOfColors.s = Math.max.apply(Math,(colorSet).map(function(o){return o.s;}))
	this.maxOfColors.v = Math.max.apply(Math,(colorSet).map(function(o){return o.v;}))

	for(var i = 0; i < this.colors.length; i++){
		this.colors[i].h = colorSet[i].h;
		this.colors[i].s = colorSet[i].s;
		this.colors[i].v = colorSet[i].v;
		switch(hsv){
			case 'h':
				this.colors[i].h = colorSet[i].h * multiplier * 360 / this.maxOfColors.h;
				break;
			case 's':
				this.colors[i].s = colorSet[i].s * multiplier * 100 / this.maxOfColors.s;
				break;
			case 'v':
				this.colors[i].v = colorSet[i].v * multiplier * 100 / this.maxOfColors.v;
				break;
		}
	}
}

function keyTyped() {
	console.log(key);
	if(key=='h' || key =='s' || key == 'v'){
		hsv=key;
		degree=0;
	}
	else if(key=='1' || key == '2'){
		whichSet=key;
		degree=0;
	}
	else if(key=='p')
		isStop = !isStop;
}
