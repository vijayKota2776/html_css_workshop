const colors = ['red', 'green', 'blue', 'yellow'];
const playerHand = [];
const cpuHand = [];
let discardPile = {};
let playerTurn = true;

function createCard() {
  return {
    color: colors[Math.floor(Math.random() * colors.length)],
    number: Math.floor(Math.random() * 10)
  };
}

function renderHand(hand, element, isPlayer = false) {
  element.innerHTML = isPlayer ? "Your Cards: " : `CPU Cards: ${hand.length}`;
  if (isPlayer) {
    hand.forEach((card, index) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = `card ${card.color}`;
      cardDiv.textContent = card.number;
      cardDiv.onclick = () => {
        if (playerTurn && (card.color === discardPile.color || card.number === discardPile.number)) {
          playerHand.splice(index, 1);
          discardPile = card;
          updateUI();
          checkWin();
          playerTurn = false;
          setTimeout(cpuPlay, 1000);
        } else {
          showMessage("❌ Can't play that card!");
        }
      };
      element.appendChild(cardDiv);
    });
  }
}

function updateUI() {
  renderHand(playerHand, document.getElementById("your-hand"), true);
  document.getElementById("cpu-count").textContent = cpuHand.length;

  const pile = document.getElementById("discard-pile");
  pile.textContent = discardPile.number;
  pile.className = "pile"; // Reset classes
  pile.classList.add(discardPile.color); // Add current card color
}

function drawCard(toHand) {
  const card = createCard();
  toHand.push(card);
  return card;
}

function cpuPlay() {
  let played = false;
  for (let i = 0; i < cpuHand.length; i++) {
    const card = cpuHand[i];
    if (card.color === discardPile.color || card.number === discardPile.number) {
      discardPile = card;
      cpuHand.splice(i, 1);
      played = true;
      break;
    }
  }
  if (!played) drawCard(cpuHand);
  updateUI();
  checkWin();
  playerTurn = true;
}

function showMessage(msg) {
  document.getElementById("message").textContent = msg;
  setTimeout(() => document.getElementById("message").textContent = "", 2000);
}

function checkWin() {
  if (playerHand.length === 0) {
    alert("🎉 You win!");
    location.reload();
  } else if (cpuHand.length === 0) {
    alert("😢 CPU wins!");
    location.reload();
  }
}

function startGame() {
  for (let i = 0; i < 5; i++) {
    drawCard(playerHand);
    drawCard(cpuHand);
  }
  discardPile = createCard();
  updateUI();

  document.getElementById("draw-pile").onclick = () => {
    if (playerTurn) {
      drawCard(playerHand);
      updateUI();
      playerTurn = false;
      setTimeout(cpuPlay, 1000);
    }
  };
}

startGame();