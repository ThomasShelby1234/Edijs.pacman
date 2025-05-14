window.onload = function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");
  
    const blockSize = 22;
    const ROWS = 18;
    const COLS = 18;
  
    let mapTemplate = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,2,2,1,2,2,2,2,1,2,2,2,2,2,1,2,1],
      [1,2,1,2,1,2,1,1,2,1,2,1,1,2,1,1,2,1],
      [1,2,1,2,2,2,1,2,2,2,2,2,1,2,2,2,2,1],
      [1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1],
      [1,2,2,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
      [1,2,1,1,1,1,2,2,2,1,1,2,2,2,1,1,2,1],
      [1,2,2,2,1,2,2,1,2,2,2,2,1,2,2,1,2,1],
      [1,1,1,2,1,1,2,1,1,1,1,1,1,1,2,1,1,1],
      [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,1],
      [1,2,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1],
      [1,2,2,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
      [1,2,1,1,1,1,2,2,2,1,1,2,2,2,1,1,2,1],
      [1,2,2,2,1,2,2,1,2,2,2,2,1,2,2,1,2,1],
      [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
  
    let map;
    let pacman;
    let ghosts;
    let score;
    let gameOver;
    let lastScore = localStorage.getItem("lastScore") || 0;
    let loop;
    let ghostStep = 0;
  
    function resetGame() {
      map = mapTemplate.map(row => row.slice());
      pacman = { x: 1, y: 1 };
      ghosts = [
        { x: COLS - 2, y: 1 },
        { x: 1, y: ROWS - 2 }
      ];
      score = 0;
      gameOver = false;
      ghostStep = 0;
    }
  
    function drawBlock(x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }
  
    function drawMap() {
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (map[y][x] === 1) drawBlock(x, y, "blue");
          else if (map[y][x] === 2) drawBlock(x, y, "orange");
          else drawBlock(x, y, "black");
        }
      }
    }
  
    function drawCharacters() {
      drawBlock(pacman.x, pacman.y, "yellow");
      ghosts.forEach(g => drawBlock(g.x, g.y, "red"));
    }
  
    function drawScore() {
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText("Punkti: " + score, 10, canvas.height - 10);
      ctx.fillText("Iepriekšējie: " + lastScore, 140, canvas.height - 10);
    }
  
    function moveGhosts() {
      ghosts.forEach(g => {
        const directions = [
          { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
        ];
        const validMoves = directions
          .map(d => ({ x: g.x + d.x, y: g.y + d.y, dir: d }))
          .filter(p => map[p.y] && map[p.y][p.x] !== 1);
  
        if (validMoves.length > 0) {
          validMoves.sort((a, b) => {
            let distA = Math.abs(a.x - pacman.x) + Math.abs(a.y - pacman.y);
            let distB = Math.abs(b.x - pacman.x) + Math.abs(b.y - pacman.y);
            return distA - distB;
          });
  
          g.x = validMoves[0].x;
          g.y = validMoves[0].y;
        }
      });
    }
  
    function updateGame() {
      if (map[pacman.y][pacman.x] === 2) {
        map[pacman.y][pacman.x] = 0;
        score++;
      }
  
      ghosts.forEach(g => {
        if (pacman.x === g.x && pacman.y === g.y) {
          gameOver = true;
        }
      });
  
      const hasRemainingPoints = map.some(row => row.includes(2));
      if (!hasRemainingPoints) {
        gameOver = true;
      }
    }
  
    function gameLoop() {
      if (gameOver) {
        localStorage.setItem("lastScore", score);
        lastScore = score;
        clearInterval(loop);
        alert("Spēle beigusies! Punkti: " + score + "\nIepriekšējie: " + lastScore);
        restartBtn.style.display = "inline-block";
        return;
      }
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMap();
      drawCharacters();
      drawScore();
      updateGame();
  
      ghostStep++;
      if (ghostStep % 2 === 0) moveGhosts();
    }
  
    document.addEventListener("keydown", e => {
      if (gameOver) return;
      let newX = pacman.x;
      let newY = pacman.y;
      if (e.key === "ArrowUp") newY--;
      if (e.key === "ArrowDown") newY++;
      if (e.key === "ArrowLeft") newX--;
      if (e.key === "ArrowRight") newX++;
      if (map[newY] && map[newY][newX] !== 1) {
        pacman.x = newX;
        pacman.y = newY;
      }
    });
  
    startBtn.addEventListener("click", () => {
      startBtn.style.display = "none";
      restartBtn.style.display = "none";
      resetGame();
      loop = setInterval(gameLoop, 100);
    });
  
    restartBtn.addEventListener("click", () => {
      restartBtn.style.display = "none";
      resetGame();
      loop = setInterval(gameLoop, 100);
    });
  };
  