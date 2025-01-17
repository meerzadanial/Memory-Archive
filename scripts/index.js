document.addEventListener("DOMContentLoaded", () => {
    const aboutButton = document.getElementById("about-button");
    const posterButton = document.getElementById("poster-button");
    const adsButton = document.getElementById("ads-button");

    // Attach event listeners to audio control buttons
    const playButton = document.querySelector('.play-button');
    const pauseButton = document.querySelector('.pause-button');
    const muteButton = document.querySelector('.mute-button');
    const replayButton = document.querySelector('.replay-button');

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
    const songTitleElement = document.getElementById('song-title');

    // Array of audio files with titles
    const audioFiles = [
        { file: "Blue Archive OST 113. Usagi Flap.mp3", title: "Usagi Flap" },
        { file: "Blue Archive OST 1. Constant Moderato.mp3", title: "Constant Moderato" },
        { file: "Blue Archive OST 59.mp3", title: "RE Aoharu" },
        { file: "Blue Archive OST 11. Connected Sky.mp3", title: "Connected Sky" }
    ];

    // Check localStorage for the saved song index or shuffle a song on first load
    const savedSongIndex = localStorage.getItem('currentSongIndex');
    const savedAudioTime = localStorage.getItem('audioTime');
    const isMuted = localStorage.getItem('audioMuted') === 'true';
    const isPlaying = localStorage.getItem('audioPlaying') === 'true';

    // Shuffle and set the song if it's the first time loading the page
    if (savedSongIndex === null) {
        const randomIndex = Math.floor(Math.random() * audioFiles.length);
        const randomSong = audioFiles[randomIndex];
        audio.src = `audio/${randomSong.file}`;
        songTitleElement.textContent = randomSong.title;
        localStorage.setItem('currentSongIndex', randomIndex); // Save the current song index
    } else {
        const savedSong = audioFiles[savedSongIndex];
        audio.src = `audio/${savedSong.file}`;
        songTitleElement.textContent = savedSong.title;
    }

    // Set the audio state based on localStorage (mute, play/pause, and time)
    if (savedAudioTime) {
        audio.currentTime = savedAudioTime;
    }

    if (isMuted) {
        audio.muted = true;
    }

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

    // Shuffle the next song after the current one ends
    audio.addEventListener('ended', () => {
        const randomIndex = Math.floor(Math.random() * audioFiles.length);
        const randomSong = audioFiles[randomIndex];
        audio.src = `audio/${randomSong.file}`;
        songTitleElement.textContent = randomSong.title;
        localStorage.setItem('currentSongIndex', randomIndex); // Save the new current song index
        audio.play(); // Start playing the new song
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
