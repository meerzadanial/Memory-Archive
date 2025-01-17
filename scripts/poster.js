document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.querySelector('.play-button');
    const pauseButton = document.querySelector('.pause-button');
    const muteButton = document.querySelector('.mute-button');
    const replayButton = document.querySelector('.replay-button');

    const audio = document.getElementById('audio');
    const songTitleElement = document.getElementById('song-title'); // Song title element

    // Array of audio files with titles
    const audioFiles = [
        { file: "Blue Archive OST 113. Usagi Flap.mp3", title: "Usagi Flap" },
        { file: "Blue Archive OST 1. Constant Moderato.mp3", title: "Constant Moderato" },
        { file: "Blue Archive OST 59.mp3", title: "RE Aoharu" },
        { file: "Blue Archive OST 11. Connected Sky.mp3", title: "Connected Sky" }
    ];

    // Restore audio state from localStorage
    const savedAudioTime = localStorage.getItem('audioTime');
    const isMuted = localStorage.getItem('audioMuted') === 'true';
    const isPlaying = localStorage.getItem('audioPlaying') === 'true';
    const savedSongIndex = parseInt(localStorage.getItem('currentSongIndex'), 10); // Last played song index

    // Check if the song is already set in localStorage (i.e., the user played a song before)
    if (!isNaN(savedSongIndex)) {
        // If there's a saved song, don't shuffle, just load and play the saved song
        const savedSong = audioFiles[savedSongIndex];
        audio.src = `audio/${savedSong.file}`;
        songTitleElement.textContent = savedSong.title;
    } else {
        // If no song is saved, shuffle and play a random song
        shuffleAndPlay();
    }

    // Restore the time position and other states
    if (savedAudioTime) {
        audio.currentTime = savedAudioTime;
    }

    // Set the mute state based on localStorage
    if (isMuted) {
        audio.muted = true;
    }

    // Play or pause based on the previous state
    if (isPlaying) {
        audio.play();
    } else {
        audio.pause();
    }

    // Save audio state on time update, pause, and mute
    audio.addEventListener('timeupdate', () => {
        localStorage.setItem('audioTime', audio.currentTime);
    });

    audio.addEventListener('pause', () => {
        localStorage.setItem('audioPlaying', false);
    });

    audio.addEventListener('play', () => {
        localStorage.setItem('audioPlaying', true);
    });

    audio.addEventListener('volumechange', () => {
        localStorage.setItem('audioMuted', audio.muted); // Save mute state
    });

    // Function to pick a random song from the array and play it
    function shuffleAndPlay() {
        const randomSong = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        audio.src = `audio/${randomSong.file}`;
        songTitleElement.textContent = randomSong.title; // Update the title
        localStorage.setItem('currentSongIndex', audioFiles.indexOf(randomSong)); // Save the current song index
        audio.play(); // Start playing the shuffled song
    }

    // Event listener to play the next random song after the current one ends
    audio.addEventListener('ended', () => {
        shuffleAndPlay(); // Automatically pick and play a new random song
    });

    // Attach event listeners to buttons
    playButton.addEventListener('click', () => {
        audio.play();
    });

    pauseButton.addEventListener('click', () => {
        audio.pause();
    });

    muteButton.addEventListener('click', () => {
        audio.muted = !audio.muted;
        localStorage.setItem('audioMuted', audio.muted); // Save mute state
    });

    replayButton.addEventListener('click', () => {
        audio.currentTime = 0; // Reset to the beginning
        audio.play(); // Start playing again
    });
});
