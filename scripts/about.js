document.addEventListener("DOMContentLoaded", () => {
     // Attach event listeners to audio control buttons
      const playButton = document.querySelector('.play-button');
      const pauseButton = document.querySelector('.pause-button');
      const muteButton = document.querySelector('.mute-button');
      const replayButton = document.querySelector('.replay-button');

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
});