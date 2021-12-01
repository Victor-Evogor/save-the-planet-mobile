
let canvas=document.getElementById("canvas");
let ctx=canvas.getContext("2d");
console.log(devicePixelRatio);
 
canvas.width="1000";canvas.height="1000";
let arrowLeft=document.getElementById("left");
let arrowRight=document.getElementById("right");
let scoreBoard=document.getElementById("score-board");
let lives=document.getElementById("lives");
let score=document.getElementById("score");
let fire=document.getElementById("fire");
let restartMenu=document.getElementById("restart-menu");
let finalScore=document.getElementById("final-score");
let highscoreDisplay=document.getElementById("highscore-display");
let points;
let health;
let hippoSpawnFlag=1;
let frame;
let cycle;
let frameController;
let spawnRate;
let gameOn=1;

let bullets;
let bulletSpeed=25;
let shotWidth=38;
let shotHeight=150;
let spawningRegion={x:900,y:200};
let hippos;

let width=900;
let height=1100;
let step=5;
let hippoHeight=130.54622651773798;
let hippoWidth=150.81571962076532;
let hippoCostume=0;
if (localStorage.highscore==undefined)
localStorage.setItem("highscore", 0);

let thumbnail=new Image();
thumbnail.src="res/thumbnail.png";
thumbnail.onload = function(e) {
				ctx.drawImage(thumbnail, 0, 0,canvas.width,canvas.height);
};



let rocketShipImg= new Image();
rocketShipImg.src="res/rocket-ship.png";

let rocketShip={img:rocketShipImg,x:0,y:830,height:200,width:150};

let back=new Image();
back.src="res/Nebula.png";


let shot= new Image();
shot.src="res/laser.png";

let hippoImage= new Image();
hippoImage.src="res/Hippo1-a.svg";

let hippoImage2= new Image();
hippoImage2.src="res/Hippo1-b.svg";

let hippoImageLeft=new Image();
hippoImageLeft.src="res/Hippo1-a(left).svg";

let hippoImage2Left=new Image();
hippoImage2Left.src="res/Hippo1-b(left).svg";

function clear() {
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
}

function drawRocketShip() {
				ctx.drawImage(rocketShip.img,rocketShip.x,rocketShip.y,rocketShip.width,rocketShip.height);
				
}

function play() {
				cycle=0;
				frame=0;
				frameController=0;
				points=0;
				spawnRate=5;
				health=5;
				gameOn=1;
				restartMenu.style.display="none";
				bullets=[];
				hippos=[];
				clear();
			scoreBoard.style.display="block";
			lives.style.display="flex";	document.getElementById("play").style.display="none";
			
			spawnHippo();
				ctx.drawImage(back,0,0,1000,1000);
				drawRocketShip();
				arrowLeft.addEventListener("click", ()=>{if (!(rocketShip.x<10)) move(-50);});
				arrowRight.addEventListener("click", ()=>{if (!(rocketShip.x>(ctx.canvas.width-200))) move(50);});
				fire.addEventListener("click",shoot)
				requestAnimationFrame(tick);
				
}

function  move(x){
				rocketShip.x+=x;
}



function shoot(){
	bullets.push({x:rocketShip.x+60,y:rocketShip.y-90});
}

function incrementBullets(){
 let i=0;
	bullets.map(function (bull){
		bull.y-=bulletSpeed;
		if (bull.y<0) {
						bullets.shift()
		}
	})
	
}

function renderBullets(){
	bullets.map(function (bull){
		ctx.drawImage(shot,bull.x,bull.y,shotWidth,shotHeight);
		incrementBullets();
	})
}

function random(start=0,end=10){
	/* Generate a random number between start and end, inclusive, Max end difgit = 99999*/
	
	let res;
	while (true){
		res=Math.floor(Math.random()*100000);
		if(res>=start&&res<=end){
			break;
		}
	}
	return res;
}

/* Hippo Script */

function spawnHippo(){
/* Add a hippo to the hippos*/
if(hippoSpawnFlag===1){
hippos.push(
	{x:random(0,spawningRegion.x),y:random(0, spawningRegion.y),to:{x: random (0,width),y:random(0,height)},dir:'R'}
	);
	}
}



function moveHippos(){
	hippos.map(
		function (hippo){
			if(hippo.x>hippo.to.x){
		hippo.x-=step;
		   if (hippo.x<hippo.to.x){
		  hippo.to.x=random(0,width)
  	}
	}
	if (hippo.x<hippo.to.x){
		hippo.x+=step;
		if (hippo.x>hippo.to.x){
		hippo.to.x=random(0,width);
	}
	}
			
			if(hippo.y>hippo.to.y){
		hippo.y-=step;
		if (hippo.y<hippo.to.y){
		hippo.to.y=random(0,height);
	}
	}
	if (hippo.y<hippo.to.y){
		hippo.y+=step;
		if (hippo.y>hippo.to.y){
		hippo.to.y=random(0,height);
	}
	}
	
	if(hippo.x===hippo.to.x){
		hippo.to.x=random (0,width);
	}

if (hippo.y===hippo.to.y){
		hippo.to.y=random (0, height);
	}
			
		}
)}

function renderHippos(){
ctx.save();

	hippos.map(
		function (hippo){
		hippo.dir=(hippo.x>hippo.to.x)?'L':'R';
		
		if(hippoCostume===0){
		if(hippo.dir=='R'){	ctx.drawImage(hippoImage,hippo.x,hippo.y,hippoHeight,hippoWidth);
	}	else{ ctx.drawImage(hippoImageLeft,hippo.x,hippo.y,hippoHeight,hippoWidth);
		
		}
		}
		else{
		if(hippo.dir=='R') ctx.drawImage(hippoImage2,hippo.x,hippo.y,hippoHeight,hippoWidth);
		else ctx.drawImage(hippoImage2Left,hippo.x,hippo.y,hippoHeight,hippoWidth);
		
		 }
		}
		
)
ctx.restore();
}

//spawnHippo();

function touchingBullets(){
	let result;
	let index=0
	 hippos.forEach(function (hippo){
		for (i of bullets){
			if(rectsColliding(hippo,i,hippoWidth,shotWidth,hippoHeight,shotHeight)){
				  result= true;
				  
	hippoSpawnFlag=0;			  
	deleteHippoAt(index);
	hippoSpawnFlag=1;
				  points++;
				 
				}  
   
		}index++;
		return false;
	});
	
	return result;
}

function updateScore() {
				score.innerHTML=points;
				finalScore.innerHTML=points
				highscoreDisplay.innerHTML=localStorage.highscore;
}

function generateHippos() {
				if (frame===0) {
								cycle=cycle+1;
				}
				
				if(points>10&&points<20) {
								spawnRate=4;
				}
				
				if(points>20&&points<30) {
								spawnRate=3;
				}
				
				if(points>30&&points<50) {
								spawnRate=2;
				}
				
				if(points>50) {
								spawnRate=1;
				}
				
				if(cycle===spawnRate) {
								spawnHippo();
								cycle=0;
				}
}

function deleteHippoAt(index){
				hippos=hippos.slice(0,index).concat(hippos.slice(index+1,hippos.length+1));
}

function hippoAnimation() {
				
				hippoCostume=1-hippoCostume;
				setTimeout(hippoAnimation,500);
}
hippoAnimation();


				
function touchingSpaceship(){
	let centerOfSpaceship={x:rocketShip.x+rocketShip.width/2, y:rocketShip.y+rocketShip.height/2};
	
	let hippoCenter;
	
	let index=0;
	
	hippos.forEach(function (hippo){
	hippoCenter={x: hippo.x+hippoWidth/2,y:hippo.y+hippoHeight/2};
		if(rectsColliding(hippo,rocketShip,hippoWidth,rocketShip.width,hippoHeight,rocketShip.height)){
			health--;
			deleteHippoAt(index);
		}
		index++;
}
);
}

function displayLives () {		
				lives.innerHTML="";
								for(let i=0; i<health; i++){
											lives.innerHTML+="<i class=\"fas fa-heart\"></i>"	;
								}
}
let v=setInterval((function () {
				frameController=0;
								
}),1000);
function calculateFrameRate(){
				if(!(frameController===0))
				frame++;else frame=0;
				frameController=1;
}

function touchingEarth(){
	let index=0;
	hippos.forEach(function (hippo){
		if(hippo.y+hippoHeight>=1000){
			health--;
			deleteHippoAt(index);
		}
		index++;
	})
}

function calculateHighscore(){
	if (points>localStorage.highscore){
		localStorage.highscore=points;
	}
	
}

function died() {
				if (health===0) {
								gameOn=undefined;
							console.log("gameOver")
	restartMenu.style.display="block";
	
				}
				
}

function tick() {
				if (gameOn==1){
				clear();
		  	ctx.drawImage(back,0,0,1000,1000);
				drawRocketShip();
				renderBullets();
				renderHippos();
				moveHippos();
				touchingBullets();
				updateScore();
				touchingSpaceship();
				displayLives();
				calculateFrameRate();
				generateHippos();
				calculateHighscore();
				touchingEarth();
				died();
				requestAnimationFrame(tick);	
				
				}else if(gameOn===0){
								requestAnimationFrame(tick);
				}else{
								"...Uhhh"
				}
}

function rectsColliding(r1,r2,r1width,r2width,r1height,r2height){

 return (Math.abs((r1.x+r1width/2)-(r2.x+r2width/2))<=(r1width/2+r2width/2))&&(Math.abs((r1.y+r1height/2)-(r2.y+r2height/2))<=(r1width/2+r2width/2));
}
