let isGameActive = true; // Flag to track if the game is active

document.addEventListener("DOMContentLoaded", function () {
  const loadingOverlay = document.getElementById("loadingOverlay");

  // Tampilkan animasi loading
  loadingOverlay.classList.add("active");

  // Set timeout untuk menghapus kelas 'active' setelah 2 detik
  setTimeout(function () {
    loadingOverlay.classList.remove("active");
  }, 2000);
});

//fungsi direct ke halaman level
function startGame() {
  window.location.href = "levelSelection.html";
}

function goToHome() {
  window.location.href = "index.html"; // Adjust the URL to your main page
}

function redirectToGame(level) {
  const unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;

  // Check if the selected level is unlocked
  if (level > unlockedLevel) {
    alert("Level terkunci. Silakan selesaikan level sebelumnya.");
    window.location.href = "levelSelection.html";
    return;
  }

  // Redirect to the selected level
  window.location.href = `gameDisplay.html?level=${level}`;
}

// Function to unlock the next level after winning
function unlockNextLevel() {
  const currentLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;
  const nextLevel = currentLevel + 1;

  // Check if the next level is within the total level count (e.g., 7 levels)
  if (nextLevel <= 7) {
    localStorage.setItem("unlockedLevel", nextLevel);
  }
}

// Modify the proceedToNextLevel function to use localStorage for the next level
function proceedToNextLevel() {
  const currentLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;
  const nextLevel = selectedLevel + 1;

  if (nextLevel > 7) {
    // Jika sudah mencapai level terakhir
    alert("Permainan telah selesai!");
  } else if (nextLevel <= currentLevel) {
    // Jika level berikutnya belum terbuka
    alert("Selamat, Anda telah menyelesaikan level ini! Lanjutkan ke level berikutnya.");

    // Redirect to the unlocked level
    window.location.href = `gameDisplay.html?level=${nextLevel}`;
  } else {
    // Jika bukan level terakhir, redirect ke level berikutnya
    window.location.href = `gameDisplay.html?level=${nextLevel}`;
  }
}

// Display the initial unlocked level in localStorage
if (!localStorage.getItem("unlockedLevel")) {
  localStorage.setItem("unlockedLevel", 1);
}

function restartGame() {
  // Redirect to the same level to restart the game
  window.location.href = `gameDisplay.html?level=${selectedLevel}`;
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const selectedLevel = parseInt(urlParams.get("level")) || 1;

const levelTitle = document.getElementById("level-num");
levelTitle.textContent = selectedLevel;

let firstCard = null;
let secondCard = null;
let cardsMatched = 0;
let boxCount = 4 + (selectedLevel - 1) * 2; // Adjusted box count for each level

//fungsi untuk display gamenya
function displayGame() {
  const boxContainer = document.getElementById("box-container");

  if (boxContainer) {
    boxContainer.innerHTML = "";

    const cardImages = Array.from({ length: 19 }, (v, i) => i + 1); // Generate an array of numbers from 1 to 20

    // Ensure that the pairs are not consecutive
    const pairs = [];
    let currentIndex = Math.floor(Math.random() * cardImages.length);
    while (pairs.length < boxCount) {
      pairs.push(cardImages[currentIndex]);
      pairs.push(cardImages[currentIndex]);
      currentIndex =
        (currentIndex +
          Math.floor(Math.random() * (cardImages.length - 1)) +
          1) %
        cardImages.length;
    }

    shuffleArray(pairs); // Shuffle the pairs

    for (let i = 0; i < boxCount; i++) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.style.backgroundImage = `url('assets/card/20.jpeg')`; // Set the card back image
      card.addEventListener("click", () => onCardClick(card, pairs[i]));
      boxContainer.appendChild(card);
    }
  }
}

function onCardClick(card, cardNumber) {
  if (!isGameActive || !card.style.backgroundImage.includes("20.jpeg")) {
    // Card is already revealed, do nothing
    return;
  }

  card.style.backgroundImage = `url('assets/card/${cardNumber}.jpeg')`;

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    checkMatch(cardNumber); // Pass cardNumber as a parameter to checkMatch
  }
}

function stopRandomSong() {
  if (randomSongAudio && isSongPlaying) {
    randomSongAudio.pause();
    isSongPlaying = false;
  }
}

function playWinSound() {
  // Pause the random song
  stopRandomSong();

  // Disable the event listener for playing random song
  document.removeEventListener("click", playRandomSong);

  const winAudio = new Audio("assets/sound/menang.mp3");
  winAudio.autoplay = true;

  // Lock the game when the game is won
  isGameActive = false;
  clearInterval(timerInterval);
}

function checkMatch(cardNumber) {
  const firstCardNumber = parseInt(
    firstCard.style.backgroundImage.split("/").pop().split(".")[0]
  );
  const secondCardNumber = parseInt(
    secondCard.style.backgroundImage.split("/").pop().split(".")[0]
  );

  if (firstCardNumber === secondCardNumber) {
    // Match found
    firstCard = null;
    secondCard = null;
    cardsMatched += 2;
    if (cardsMatched === boxCount) {
      // Display the win modal
      const winModal = document.getElementById("winModal");
      winModal.style.display = "flex"; // Display the modal

      // Center the modal both horizontally and vertically
      winModal.style.justifyContent = "center";
      winModal.style.alignItems = "center";
      gameWon = true;
      playWinSound();

      // Unlock the next level after winning
      unlockNextLevel();
    }
  } else {
    // Not a match, hide the cards after a short delay
    setTimeout(() => {
      firstCard.style.backgroundImage = `url('assets/card/20.jpeg')`;
      secondCard.style.backgroundImage = `url('assets/card/20.jpeg')`;
      firstCard = null;
      secondCard = null;
    }, 1000);
  }
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Call displayGame after the page has loaded
window.onload = displayGame;

// time function
const timerElement = document.getElementById("timer");
let totalSeconds = selectedLevel * 20; // Initial time in seconds based on level
let gameWon = false; // Flag to track if the game is won

function playLoseSound() {
  const audio = new Audio("assets/sound/kalah.mp3");
  audio.autoplay = true;

  stopRandomSong();

  // Set a timeout to stop the win sound after 5 seconds
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 5000);
}

function updateTimer() {
  // Check if the timer element exists
  if (timerElement) {
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      playLoseSound(); // Play the losing sound

      // Display "00:00" when time's up
      timerElement.innerText = "00:00";

      const kalah = document.getElementById("kalah");
      kalah.style.display = "flex";
      kalah.style.justifyContent = "center";
      kalah.style.alignItems = "center";

      // Lock the game when time's up
      isGameActive = false;
    } else {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      // Display the timer in the format MM:SS
      timerElement.innerText = `${padZero(minutes)}:${padZero(seconds)}`;
      totalSeconds--;
    }
  } else {
    console.error("Timer element not found.");
  }
}

// Update the timer every second
const timerInterval = setInterval(updateTimer, 1000);

// Function to pad single-digit numbers with a leading zero
function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

function showCredit() {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  popup.innerHTML = `
    <p>Nama Kelompok:</p>
    <ol>
      <li>Dea Salsabilla</li>
      <li>Andini Salma S</li>
      <li>Afi Qur'aini A S</li>
      <li>Hasna Yustika S</li>
      <li>M Ali Amrozi</li>
    </ol>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 4000);
}

//menang kalah pop up
function showModal(modalId) {
  var modal = document.getElementById(modalId);
  modal.style.display = "block";
}

// Function to close the modal
function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  modal.style.display = "none";
}

// You can call these functions in your game logic
// For example, if the game is won:
if (gameWon) {
  showModal("winModal");
}

// If the game is lost:
if (isGameLost) {
  showModal("kalah");
}

function showhelp() {
  const popup = document.createElement("div");
  popup.classList.add("popup-help");

  popup.innerHTML = `
    <p>Petunjuk Bermain:</p>
    <ol>
      <li>Silahkan Klik tombol play untuk masuk ke pilih level</li>
      <li>Lalu mainkan level satu terlebih dahulu agar dapat membuka level selanjutnya</li>
      <li>Jika pemain mengalami kekalahan pemain dapat mengeklik tombol ulang untuk kembali memainkan game</li>
      <li>Jika Pemain memenangkan game pemain dapat mengeklik tombol lanjut untuk memainkan level selanjutnya</li>
      <li>Jika semua level sudah dimainkan, otomatis permainan akan berhenti dilevel 7 dan pemain dapat memainkan level-level sebelumnya</li>
    </ol>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 4000);
}