function $id(id){return document.getElementById(id)}

var grid;
var overlay;
var counter;
var points = 0;
var arr = [	[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1],
			[0,-1] ];

var fieldSize = 4;
var cellSize = 64;
var gameOver = false;
var scaling = true;

function onload() {
	window.onresize = OnResize;
	grid = $id("grid");
	overlay = $id("overlay");
	counter = $id("counter");
	randomBlk();
	randomBlk();
	SetCounter();
	OnResize();

	var ham = new Hammer(document.body);

	ham.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

	ham.on("swipeleft", function (ev) {
	    Move(Direction.Left)
	});
	ham.on("swiperight", function (ev) {
	    Move(Direction.Right)
	});
	ham.on("swipeup", function (ev) {
	    Move(Direction.Up)
	});
	ham.on("swipedown", function (ev) {
	    Move(Direction.Down)
	});
}

function OnResize() {
	if (scaling) {
		var scale = Math.max((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) / 330, 1);
		grid.style["transform"] = "scale(" + scale + "," + scale + ")";
		grid.style["-webkit-transform"] = "scale(" + scale + "," + scale + ")";
		grid.style["-moz-transform"] = "scale(" + scale + "," + scale + ")";
		grid.style["-o-transform"] = "scale(" + scale + "," + scale + ")";
		grid.style.marginLeft = (window.innerWidth - (256 * scale)) / 2 + "px";
		overlay.style["transform"] = "scale(" + scale + "," + scale + ")";
		overlay.style["-webkit-transform"] = "scale(" + scale + "," + scale + ")";
		overlay.style["-moz-transform"] = "scale(" + scale + "," + scale + ")";
		overlay.style["-o-transform"] = "scale(" + scale + "," + scale + ")";
		overlay.style.marginLeft = (window.innerWidth - (256 * scale)) / 2 + "px";
	}
}

function reset() {
	gameOver = false;
	$id("overlay").style.display = "none";
	arr = [[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1]];
	grid.innerHTML = "";
	points = 0;
	SetCounter();
	randomBlk();
	randomBlk();
}

function keydown(e) {
	var evtobj = window.event? event : e;
	var unicode = evtobj.charCode? evtobj.charCode : evtobj.keyCode;
	switch (unicode) {
		case 0x57:
		case 38: //up
			if (canMoveV())
				Move(Direction.Up);
		break;
		case 0x53:
		case 40: //down
			if (canMoveV())
				Move(Direction.Down);
		break;
		case 0x41:
		case 37: //left
			if (canMoveH())
				Move(Direction.Left);
		break;
		case 0x44:
		case 39: //right
			if (canMoveH())
				Move(Direction.Right);
		break;
	}
}

var Direction = { Left:0, Up:1, Right:2, Down:3 }

function SetCounter() {
	counter.innerHTML = "Points: " + points;
}

function GridRemove(index) {
	points += parseInt(grid.childNodes[index].innerHTML) * 2;
	SetCounter();
	grid.removeChild(grid.childNodes[index]);
	for (var i = 0; i < arr.length; i++) {
		if (arr[i][1] > index) {
			arr[i][1] = arr[i][1] - 1;
		}
	}
}

function Move(direction) {
	var rand = false;
	if (direction == Direction.Right || direction == Direction.Down) {
		var offset;
		var v;
		var w;

		if (direction == Direction.Right || direction == Direction.Left) {
			offset = 4;
			v = 4;
			w = 1;
		}
		else {
			offset = 1;
			v = 1;
			w = 4;
		}

		for (var y = 0; y < 4; y++) {
			for (var x = 2; x >= 0; x--) {
				// 0 2 => 2 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w + offset][0] == 0) {
					var obj = grid.childNodes[arr[x * v + y * w][1]];
					if (direction == Direction.Right)
						obj.style.left = parseInt(obj.style.left) + cellSize + "px";
					else
						obj.style.top = parseInt(obj.style.top) + cellSize + "px";
					arr[x * v + y * w + offset][0] = arr[x * v + y * w][0];
					arr[x * v + y * w + offset][1] = arr[x * v + y * w][1];
					arr[x * v + y * w][0] = 0;
					arr[x * v + y * w][1] = -1;
					if (x < 2)
						x += 2;
					rand = true;
				}
			}
			for (var x = 2; x >= 0; x--) {
				// 2 2 => 4 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w][0] == arr[x * v + y * w + offset][0]) {
					arr[x * v + y * w + offset][0] = arr[x * v + y * w + offset][0] * 2;
					var obj = grid.childNodes[arr[x * v + y * w + offset][1]];
					obj.innerHTML = arr[x * v + y * w + offset][0];
					obj.className = "blk b" + arr[x * v + y * w + offset][0];
					
					GridRemove(arr[x * v + y * w][1]);
					arr[x * v + y * w][0] = 0;
					arr[x * v + y * w][1] = -1;
					x--;
					rand = true;
				}
			}
			for (var x = 2; x >= 0; x--) {
				// 0 2 => 2 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w + offset][0] == 0) {
					var obj = grid.childNodes[arr[x * v + y * w][1]];
					if (direction == Direction.Right || direction == Direction.Left) {
						obj.style.left = parseInt(obj.style.left) + cellSize + "px";
						arr[x * v + y * w + offset][0] = arr[x * v + y * w][0];
						arr[x * v + y * w + offset][1] = arr[x * v + y * w][1];
						arr[x * v + y * w][0] = 0;
					}
					else {
						obj.style.top = parseInt(obj.style.top) + cellSize + "px";
						arr[x * v + y * w + offset][0] = arr[x * v + y * w][0];
						arr[x * v + y * w + offset][1] = arr[x * v + y * w][1];
						arr[x * v + y * w][0] = 0;
					}
					arr[x * v + y * w][1] = -1;
					if (x < 2)
						x += 2;
					rand = true;
				}
			}
		}
	}
	else {
		var offset;
		var v;
		var w;

		if (direction == Direction.Right || direction == Direction.Left) {
			offset = 4;
			v = 4;
			w = 1;
		}
		else {
			offset = 1;
			v = 1;
			w = 4;
		}

		for (var y = 0; y < 4; y++) {
			for (var x = 1; x < 4; x++) {
				// 0 2 => 2 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w - offset][0] == 0) {
					var obj = grid.childNodes[arr[x * v + y * w][1]];
					if (direction == Direction.Left)
						obj.style.left = parseInt(obj.style.left) - cellSize + "px";
					else
						obj.style.top = parseInt(obj.style.top) - cellSize + "px";
					arr[x * v + y * w - offset][0] = arr[x * v + y * w][0];
					arr[x * v + y * w - offset][1] = arr[x * v + y * w][1];
					arr[x * v + y * w][0] = 0;
					arr[x * v + y * w][1] = -1;
					if (x > 1)
						x -= 2;
					rand = true;
				}
			}
			for (var x = 1; x < 4; x++) {
				// 2 2 => 4 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w][0] == arr[x * v + y * w - offset][0]) {
					arr[x * v + y * w - offset][0] = arr[x * v + y * w - offset][0] * 2;
					var obj = grid.childNodes[arr[x * v + y * w - offset][1]];
					obj.innerHTML = arr[x * v + y * w - offset][0];
					obj.className = "blk b" + arr[x * v + y * w - offset][0];

					GridRemove(arr[x * v + y * w][1]);
					arr[x * v + y * w][0] = 0;
					arr[x * v + y * w][1] = -1;
					x--;
					rand = true;
				}
			}
			for (var x = 1; x < 4; x++) {
				// 0 2 => 2 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w - offset][0] == 0) {
					var obj = grid.childNodes[arr[x * v + y * w][1]];
					if (direction == Direction.Right || direction == Direction.Left) {
						obj.style.left = parseInt(obj.style.left) - cellSize + "px";
						arr[x * v + y * w - offset][0] = arr[x * v + y * w][0];
						arr[x * v + y * w - offset][1] = arr[x * v + y * w][1];
						arr[x * v + y * w][0] = 0;
					}
					else {
						obj.style.top = parseInt(obj.style.top) - cellSize + "px";
						arr[x * v + y * w - offset][0] = arr[x * v + y * w][0];
						arr[x * v + y * w - offset][1] = arr[x * v + y * w][1];
						arr[x * v + y * w][0] = 0;
					}
					arr[x * v + y * w][1] = -1;
					if (x > 1)
						x -= 2;
					rand = true;
				}
			}
		}
	}
	if (rand)
		randomBlk();
	if (!canMove()) {
		gameOver = true;
		$id("gameover").innerText = "Game Over";
		$id("start").innerText = "Restart";
		$id("overlay").style.display = "block";
	}
}

function canMove() {
	for (var i = 0; i < fieldSize; ++i) {
		for	(var j = 0; j < fieldSize; ++j) {
			if (arr[i + j*4][0] == 0)
				return true;
		}
	}
	
	for (var i = 0; i < fieldSize; ++i) {
		for	(var j = 0; j < fieldSize - 1; ++j) {
			if (arr[i + j*4][0] == arr[i + j*4 + 4][0])
				return true;
		}
	}
	
	for (var i = 0; i < fieldSize - 1; ++i) {
		for	(var j = 0; j < fieldSize; ++j)
		{
			if (arr[i + j*4][0] == arr[i + 1 + j*4][0])
				return true;
		}
	}
	return false;
}

function canMoveH() {
	for (var i = 0; i < fieldSize; ++i) {
		for	(var j = 0; j < fieldSize; ++j) {
			if (arr[i + j*4][0] == 0)
				return true;
		}
	}
	for (var i = 0; i < fieldSize; ++i) {
		for	(var j = 0; j < fieldSize - 1; ++j)
		{
			if (arr[i + j*4][0] == arr[i + j*4 + 4][0])
				return true;
		}
	}
}

function canMoveV() {
	for (var i = 0; i < fieldSize; ++i) {
		for	(var j = 0; j < fieldSize; ++j) {
			if (arr[i + j*4][0] == 0)
				return true;
		}
	}
	for (var i = 0; i < fieldSize - 1; ++i) {
		for	(var j = 0; j < fieldSize; ++j) {
			if (arr[i + j*4][0] == arr[i + 1 + j*4][0])
				return true;
		}
	}
}

function randomBlk() {
	if (grid.childNodes.length < 16) {
		//count available
		var n = 0;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][0] == 0)
				n++;
		}
		//choose one
		var z = Math.floor(Math.random() * n);
		n = 0;
		//set
		for (var i  =0; i < arr.length; i++) {
			if (arr[i][0] == 0) {
				if (n == z) {
					var obj = document.createElement("div");
					if (Math.random() < 0.9) {
						obj.innerHTML = "2";
						obj.className = "blk b2";
						arr[i][0] = 2;
					}
					else {
						obj.innerHTML = "4";
						obj.className = "blk b4";
						arr[i][0] = 4;
					}
					obj.style.left = Math.floor(i / fieldSize) * cellSize + "px";
					obj.style.top = (i - Math.floor(i / fieldSize) * fieldSize) * cellSize + "px";
					grid.appendChild(obj);
					arr[i][1] = grid.childNodes.length - 1;
				}
				n++;
			}
		}
	}
}
