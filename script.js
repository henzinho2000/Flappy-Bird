let activateScreen = {};

const globals = {};

const sprites = new Image();
sprites.src = "./sprites.png";

const soundHit = new Audio();
soundHit.src = "./sounds/hit.wav";

const soundPulo = new Audio();
soundPulo.src = "./sounds/pulo.wav";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function colliding(obj1, obj2) {
	if (obj1.y + obj1.height >= obj2.y || obj1.y <= 0) {
		return true;
	} else {
		return false;
	}
}
function setPlayer() {
	const player = {
		spriteY: 0,
		spriteX: 0,
		width: 33,
		height: 24,
		x: 10,
		jump: 4.6,
		up() {
			soundPulo.play();
			this.aceleration = -this.jump;
		},
		y: canvas.height / 2 - 24,
		weight: 0.25,
		aceleration: 0,
		gravity() {
			if (colliding(player, globals.ground)) {
				soundHit.play();
				setTimeout(() => {
					changeScreen(screens.init);
				}, 500);

				return;
			}

			this.aceleration += this.weight;
			this.y += this.aceleration;
		},
		spritesMoving: [
			{spriteX:0 , spriteY:0},
			{spriteX:0 , spriteY:26},
			{spriteX:0 , spriteY:52}
		],
		draw() {
			const {spriteX,spriteY} = this.spritesMoving[0];

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
	return player;
}

const introduction = {
	spriteY: 0,
	spriteX: 134,
	width: 174,
	height: 152,
	x: canvas.width / 2 - 87,
	y: canvas.height / 2 - 76,
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
function setGround() {
	const ground = {
		spriteY: 610,
		spriteX: 0,
		width: 224,
		height: 112,
		x: 0,
		y: canvas.height - 112,
		actualize() {
			const velocityMoviment = 1;
			const repete = this.width / 2;
			this.x -= velocityMoviment;

			if (this.x == -repete) {
				this.x = 0;
			}
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
	return ground;
}
const background = {
	spriteY: 0,
	spriteX: 390,
	width: 276,
	height: 204,
	x: 0,
	y: 252,
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

function changeScreen(newScreen) {
	activateScreen = newScreen;

	if (activateScreen.initializy) {
		activateScreen.initializy();
	}
}

const screens = {
	init: {
		initializy() {
			globals.player = setPlayer();
			globals.ground = setGround();
		},
		draw() {
			background.draw();
			globals.ground.draw();
			globals.player.draw();
			introduction.draw();
		},
		click() {
			changeScreen(screens.game);
			globals.player.gravity();
			globals.player.up();
		},
		actualize() {
			globals.ground.actualize();
		},
	},
};

screens.game = {
	draw() {
		background.draw();
		globals.ground.draw();
		globals.player.draw();
	},
	click() {
		globals.player.up();
	},
	actualize() {
		globals.player.gravity();
		globals.ground.actualize();
	},
};

function drawObjects() {
	activateScreen.draw();
	activateScreen.actualize();

	requestAnimationFrame(drawObjects);
}

canvas.addEventListener("click", () => {
	if (activateScreen.click) {
		activateScreen.click();
	}
});

changeScreen(screens.init);
drawObjects();
