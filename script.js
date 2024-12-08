const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const player = {
	spriteY: 0,
	spriteX: 0,
	width: 33,
	height: 24,
	x: 10,
	y: canvas.height /2 -12,
	weight: 0.5,
	aceleration: 0,
	gravity() {
		this.aceleration += this.weight;
		this.y += this.aceleration;
	},
	draw() {
		context.drawImage(
			sprites,
			this.spriteX,
			this.spriteY,
			this.width,
			this.height,
			this.x,
			this.y,
			this.width,
			this.height
		);
	},
};

const introduction = {
	spriteY: 0,
	spriteX: 134,
	width: 174,
	height: 152,
	x: (canvas.width/2) - 87,
	y: canvas.height/2 - 76,
	draw() {
		context.drawImage(
			sprites,
			this.spriteX,
			this.spriteY,
			this.width,
			this.height,
			this.x,
			this.y,
			this.width,
			this.height
		);
	},
};

const ground = {
	spriteY: 610,
	spriteX: 0,
	width: 224,
	height: 112,
	x: 0,
	y: canvas.height - 112,
	draw() {
		context.drawImage(
			sprites,
			this.spriteX,
			this.spriteY,
			this.width,
			this.height,
			this.x,
			this.y,
			this.width,
			this.height
		);
		context.drawImage(
			sprites,
			this.spriteX,
			this.spriteY,
			this.width,
			this.height,
			this.x + this.width,
			this.y,
			this.width,
			this.height
		);
	},
};
const background = {
	spriteY: 0,
	spriteX: 390,
	width: 276,
	height: 204,
	x: 0,
	y: ground.y - ground.height,
	draw() {
		context.fillStyle = "#70c5ce";
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.drawImage(
			sprites,
			this.spriteX,
			this.spriteY,
			this.width,
			this.height,
			this.x,
			this.y,
			this.width,
			this.height
		);
		context.drawImage(
			sprites,
			this.spriteX,
			this.spriteY,
			this.width,
			this.height,
			this.x + this.width,
			this.y,
			this.width,
			this.height
		);
	},
};

let activateScreen = {};

function changeScreen(newScreen){
	activateScreen = newScreen;
}

const screens = {
	init:{
		draw(){
			background.draw();
			ground.draw();
			player.draw();
			introduction.draw();	
		},
		click(){
			changeScreen(screens.game);
		},
		actualize(){

		}
	}
}

screens.game = {
	draw(){
		background.draw();
		ground.draw();
		player.draw();
	},
	actualize(){
		player.gravity();
	}
}


function drawObjects() {
	activateScreen.draw();
	activateScreen.actualize();

	requestAnimationFrame(drawObjects);
}

window.addEventListener("click",()=>{
	if(activateScreen.click){
		activateScreen.click();	
	}
})

changeScreen(screens.init);
drawObjects();