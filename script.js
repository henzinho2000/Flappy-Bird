const buttonSound = document.querySelector("#sound");
let sound = true;

buttonSound.addEventListener("click", () => {
	if (sound) {
		buttonSound.className = "fa-solid fa-volume-xmark";
		sound = false;
	} else {
		buttonSound.className = "fa-solid fa-volume-high";
		sound = true;
	}
});


let activateScreen = {};

const globals = {};

const sprites = new Image();
sprites.src = "./sprites.png";

const soundHit = new Audio();
soundHit.src = "./sounds/hit.wav";

const soundPulo = new Audio();
soundPulo.src = "./sounds/pulo.wav";

const soundPoint = new Audio();
soundPoint.src = "./sounds/ponto.wav";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let frames = 0;
let total = 0;

function setPontuation() {
	const pontuation = {
		points: 0,
		draw(x = 10, y = 35, px = 45, fill = "white") {
			context.font = `${px}px Pixelify Sans`;
			context.textAlign = "right";
			context.fillStyle = fill;
			context.fillText(this.points, canvas.width - x, y);
		},
	};
	return pontuation;
}
function setVersion() {
	const version = {
		version: "v-1.211",
		draw(x = 10, y = canvas.height - 10, px = 20, fill = "grey") {
			context.font = `${px}px Pixelify Sans`;
			context.textAlign = "right";
			context.fillStyle = fill;
			context.fillText(this.version, canvas.width - x, y);
		},
	};
	return version;
}

function setGameOver() {
	const gameOver = {
		spriteX: 134,
		spriteY: 153,
		width: 226,
		height: 200,
		x: canvas.width / 2 - 113,
		y: 153,
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
			if (total < globals.pontuation.points) {
				total = globals.pontuation.points;
				globals.pontuation.draw(70, 245, 25, "orange");
				context.fillText(total, canvas.width - 70, 285);
			} else {
				globals.pontuation.draw(70, 245, 25);
				context.fillStyle = "orange";
				context.fillText(total, canvas.width - 70, 285);
			}
		},
	};
	return gameOver;
}
function colliding(obj1, obj2) {
	if (obj1.y + obj1.height >= obj2.y + 7 || obj1.y <= 15) {
		return true;
	} else {
		return false;
	}
}

function setPipe() {
	const pipe = {
		width: 52,
		height: 400,

		ground: {
			spriteX: 0,
			spriteY: 168,
		},
		sky: {
			spriteX: 52,
			spriteY: 168,
		},
		draw() {
			this.pairs.forEach((par) => {
				const pipeSkyX = par.x;
				const pipeSkyY = par.y;

				const pipeDistance = 110;

				context.drawImage(
					sprites,
					this.sky.spriteX,
					this.sky.spriteY,
					this.width,
					this.height,
					pipeSkyX,
					pipeSkyY,
					this.width,
					this.height
				);

				const pipeGroundX = par.x;
				const pipeGroundY = this.height + pipeDistance + par.y;

				context.drawImage(
					sprites,
					this.ground.spriteX,
					this.ground.spriteY,
					this.width,
					this.height,
					pipeGroundX,
					pipeGroundY,
					this.width,
					this.height
				);

				par.pipeSky = {
					x: pipeSkyX,
					y: this.height + pipeSkyY,
				};
				par.pipeGround = {
					x: pipeGroundX,
					y: pipeGroundY,
				};
			});
		},
		pairs: [],
		CollidingWithPlayer(par) {
			const headPlayer = globals.player.y;
			const bodyPlayer = globals.player.x;
			const footPlayer = globals.player.y + globals.player.height;

			if (globals.player.x + globals.player.width >= par.x + 18) {
				if (headPlayer <= par.pipeSky.y + 14) {
					if (bodyPlayer <= par.pipeSky.x + this.width) {
						return true;
					}
				}
				if (footPlayer >= par.pipeGround.y + 10) {
					if (bodyPlayer <= par.pipeGround.x + this.width) {
						return true;
					}
				}
			}
			return false;
		},
		actualize() {
			const passedFrames = frames % 100 === 0;
			if (passedFrames) {
				this.pairs.push({
					x: canvas.width,
					y: -Math.floor(Math.random() * 200 + 150),
					point: false,
				});
			} else if (frames % -100 === 0) {
				this.pairs.push();
			}

			this.pairs.forEach((par) => {
				par.x -= 2;
				if (this.CollidingWithPlayer(par)) {
					if (sound) {
						soundHit.play();
					}
					changeScreen(screens.gameOver);
					return;
				}
				if (par.x + this.width <= 0) {
					this.pairs.shift();
				}
				if (par.x - globals.player.x <= 0) {
					if (par.point == false) {
						if (sound) {
							soundPoint.play();
						}
						globals.pontuation.points++;
						par.point = true;
					}
				}
			});
		},
	};
	return pipe;
}

const introduction = {
	spriteY: 0,
	spriteX: 134,
	width: 174,
	height: 152,
	x: canvas.width / 2,
	y: canvas.height / 2,
	draw() {
		context.drawImage(
			sprites,
			this.spriteX,
			this.spriteY,
			this.width,
			this.height,
			this.x - this.width / 2,
			this.y - this.height / 2,
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
		y: canvas.height - 82,
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
	y: 282,
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

function setPlayer() {
	const player = {
		spriteX: 0,
		spriteY: 0,
		width: 33,
		height: 24,
		x: canvas.width / 2,
		jump: 6,
		up() {
			if (sound) {
				soundPulo.play();
			}
			this.aceleration = -this.jump;
		},
		y: canvas.height / 2 - 24,
		weight: 0.28,
		aceleration: 0,
		rotation: 0,
		gravity() {
			if (colliding(player, globals.ground)) {
				if (sound) {
					soundHit.play();
				}
				changeScreen(screens.gameOver);
				return;
			}

			this.aceleration += this.weight;
			this.y += this.aceleration;

			// Ajusta a rotação com base na aceleração
			if (this.aceleration < 0) {
				// Subindo: rotaciona para cima
				this.rotation = Math.max(this.rotation - 0.02, -Math.PI / 5); // Limite de -45 graus
			} else {
				// Caindo: rotaciona para baixo
				this.rotation = Math.min(this.rotation + 0.02, Math.PI); // Limite de 45 graus
			}
		},
		moving: [
			{ spriteX: 0, spriteY: 0 },
			{ spriteX: 0, spriteY: 26 },
			{ spriteX: 0, spriteY: 52 },
		],
		actualFrame: 0,
		actualizeFrame() {
			const intervalOfTime = 8;
			const passedInterval = frames % intervalOfTime;
			if (passedInterval == intervalOfTime - 1) {
				const baseIndex = 1;
				const index = baseIndex + this.actualFrame;
				const baseRepeat = this.moving.length;
				this.actualFrame = index % baseRepeat;
			}
		},
		draw() {
			this.actualizeFrame();
			this.spriteX = this.moving[this.actualFrame].spriteX;
			this.spriteY = this.moving[this.actualFrame].spriteY;

			context.save(); // Salva o estado atual do canvas
			context.translate(this.x, this.y); // Move o ponto de rotação para o centro do sprite
			context.rotate(this.rotation); // Aplica a rotação
			context.drawImage(
				sprites,
				this.spriteX,
				this.spriteY,
				this.width,
				this.height,
				-this.width / 2, // Ajusta para o centro do sprite
				-this.height / 2,
				this.width * 1.1,
				this.height * 1.1
			);
			context.restore(); // Restaura o estado do canvas
		},
	};
	return player;
}
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
			globals.pipe = setPipe();
			globals.version = setVersion();
		},
		draw() {
			background.draw();
			globals.ground.draw();
			introduction.draw();
			globals.version.draw();
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
	initializy() {
		globals.pontuation = setPontuation();
	},
	draw() {
		background.draw();
		globals.pipe.draw();
		globals.ground.draw();
		globals.player.draw();
		globals.pontuation.draw();
		globals.version.draw();
	},
	click() {
		globals.player.up();
	},
	actualize() {
		globals.pipe.actualize();
		globals.player.gravity();
		globals.ground.actualize();
	},
};
screens.gameOver = {
	initializy() {
		globals.gameOver = setGameOver();
	},
	draw() {
		globals.gameOver.draw();
	},
	actualize() {
		globals.gameOver.draw();
	},
	click() {
		changeScreen(screens.init);
	},
};

let lastFrameTime = 0; // Guarda o último tempo de quadro
const targetFPS = 80; // FPS desejado
const frameInterval = 1000 / targetFPS; // Intervalo entre os quadros em milissegundos

function drawObjects() {
	const currentTime = performance.now(); // Tempo atual em milissegundos
	const deltaTime = currentTime - lastFrameTime; // Diferença de tempo entre os quadros

	if (deltaTime >= frameInterval) {
		lastFrameTime = currentTime; // Atualiza o último tempo de quadro

		activateScreen.draw();
		activateScreen.actualize();

		frames++;
	}

	requestAnimationFrame(drawObjects);
}

window.addEventListener("keydown", () => {
	if (activateScreen.click) {
		activateScreen.click();
	}
});
canvas.addEventListener("click", () => {
	if (activateScreen.click) {
		activateScreen.click();
	}
});

changeScreen(screens.init);
drawObjects();
