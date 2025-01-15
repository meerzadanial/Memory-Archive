document.addEventListener("DOMContentLoaded", () => {
    const aboutButton = document.getElementById("about-button");
    const posterButton = document.getElementById("poster-button");
    const adsButton = document.getElementById("ads-button");

    // Attach event listeners to audio control buttons
    const playButton = document.querySelector('.play-button');
    const pauseButton = document.querySelector('.pause-button');
    const muteButton = document.querySelector('.mute-button');
    const replayButton = document.querySelector('.replay-button');
    const shuffleButton = document.querySelector('.shuffle-button');

    // Event listeners for buttons on the landing page
    aboutButton.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = aboutButton.href;
    });

    posterButton.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = posterButton.href;
    });

    adsButton.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = adsButton.href;
    });

    // Audio player functions
    const audio = document.getElementById('audio');

    // Restore audio state from localStorage
    const savedAudioTime = localStorage.getItem('audioTime');
    const isMuted = localStorage.getItem('audioMuted') === 'true';
    const isPlaying = localStorage.getItem('audioPlaying') === 'true';

    if (savedAudioTime) {
        audio.currentTime = savedAudioTime;
    }

    // Set the mute state based on localStorage (Don't mute automatically on load)
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
        localStorage.setItem('audioMuted', audio.muted);
    });

    // Toggle play/pause
    function togglePlay() {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    // Toggle mute
    function toggleMute() {
        audio.muted = !audio.muted;
        localStorage.setItem('audioMuted', audio.muted); // Save mute state
    }

    // Restart the audio
    function restartAudio() {
        audio.currentTime = 0; // Reset to the beginning
        audio.play(); // Start playing again
    }

    // Toggle between play and pause
    playButton.addEventListener('click', togglePlay);
    pauseButton.addEventListener('click', togglePlay);

    // Toggle mute
    muteButton.addEventListener('click', toggleMute);

    // Restart audio
    replayButton.addEventListener('click', restartAudio);

    // Array of audio files
    const audioFiles = [
        "ブルーアーカイブ Blue Archive OST 113. Usagi Flap.mp3",
        "ブルーアーカイブ Blue Archive OST 1. Constant Moderato.mp3",
        "ブルーアーカイブ Blue Archive OST 59.mp3",
        "ブルーアーカイブ Blue Archive OST 11. Connected Sky.mp3" // Add your song file names here
    ];

    // Function to pick a random song from the array
    function shuffleAndPlay() {
        const randomSong = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        audio.src = `audio/${randomSong}`;
        audio.play(); // Start playing the shuffled song
    }

    // Shuffle button functionality
    shuffleButton.addEventListener('click', shuffleAndPlay);

    // Initially pick a random song
    shuffleAndPlay();
});
