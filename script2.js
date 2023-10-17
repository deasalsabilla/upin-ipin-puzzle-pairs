let randomSongAudio = null;
let isSongPlaying = false;
const songs = [
  "lagu1.mp3",
  "lagu2.mp3",
  "lagu3.mp3",
  "lagu4.mp3",
  "lagu5.mp3",
  "lagu6.mp3",
  "lagu7.mp3",
];

function playRandomSong() {
  if (!isSongPlaying) {
    isSongPlaying = true;

    // Play a random song
    const randomIndex = Math.floor(Math.random() * songs.length);
    randomSongAudio = new Audio("assets/sound/" + songs[randomIndex]);
    randomSongAudio.addEventListener("ended", function () {
      isSongPlaying = false; // Reset the flag after the song ends
      playRandomSong(); // Play another random song after this one ends
    });
    randomSongAudio.play();
  }
}

document.addEventListener("click", playRandomSong);
