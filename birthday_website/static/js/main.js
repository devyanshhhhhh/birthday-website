document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const birthday = new Date('2025-07-28T00:00:00');
    const birthdaySongFilename = 'until_i_found_you.mp3';

    // --- LYRICS DATA (Updated for Spotify version) ---
    const lyrics = [
        { time: 11, text: "Georgia, wrap me up in all your..." },
        { time: 17.5, text: "I want you in my arms" },
        { time: 23, text: "Oh, let me hold you" },
        { time: 27, text: "I'll never let you go again, like I did" },
        { time: 33.5, text: "Oh, I used to say..." },
        { time: 37.5, text: "'I would never fall in love again until I found her'" },
        { time: 43.5, text: "I said, 'I would never fall unless it's you I'm fallin' into'" },
        { time: 51, text: "I was lost within the darkness, but then I found her" },
        { time: 58, text: "I found you" },
        { time: 68, text: "Georgia, pulled me in, I asked to love her" },
        { time: 76.5, text: "Once again, you fell, I caught you" },
        { time: 83, text: "I'll never let you go again, like I did" },
        { time: 91, text: "Oh, I used to say..." },
        { time: 94, text: "'I would never fall in love again until I found her'" },
        { time: 101, text: "I said, 'I would never fall unless it's you I'm fallin' into'" },
        { time: 108.5, text: "I was lost within the darkness, but then I found her" },
        { time: 114.5, text: "I found you" },
        { time: 136.5, text: "'I would never fall in love again until I found her'" },
        { time: 144, text: "I said, 'I would never fall unless it's you I'm fallin' into'" },
        { time: 151, text: "I was lost within the darkness, but then I found her" },
        { time: 157.5, text: "I found you" },
    ];

    // --- SVG Icons for Play/Pause Button ---
    const playIcon = `<svg class="play-icon" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>`;
    const pauseIcon = `<svg class="pause-icon" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>`;

    // --- DOM ELEMENTS ---
    const bodyEl = document.querySelector('body');
    const beforeBirthdayView = document.getElementById('before-birthday');
    const birthdaySurpriseView = document.getElementById('birthday-surprise');
    const countdownEl = document.getElementById('countdown');
    const music = document.getElementById('background-music');
    const bottomControls = document.getElementById('bottom-controls');
    const lyricsContainer = document.getElementById('lyrics-container');
    const playSurpriseButton = document.getElementById('play-surprise-button');
    const playPauseButton = document.getElementById('play-pause-button');
    const letterContainer = document.getElementById('letter-container');
    
    const slideshowContainer = document.getElementById('slideshow-container');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    const slideshowData = JSON.parse(bodyEl.dataset.slideshow);

    let countdownInterval;
    let currentSlideIndex = 0;
    let currentLyricIndex = -1;

    // --- MAIN LOGIC ---
    function initializeApp() {
        const now = new Date();
        // For testing, uncomment the line below
        // if (true) {
        if (now >= birthday) {
            music.querySelector('source').src = `/static/music/${birthdaySongFilename}`;
            music.load();
            showBirthdaySurprise();
        } else {
            showCountdown();
        }
    }

    // --- COUNTDOWN VIEW ---
    function showCountdown() {
        birthdaySurpriseView.style.display = 'none';
        countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    function updateCountdown() {
        const now = new Date();
        const diff = birthday - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            window.location.reload();
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownEl.innerHTML = `${d}d ${h}h ${m}m ${s}s`;
    }

    // --- BIRTHDAY VIEW ---
    function showBirthdaySurprise() {
        beforeBirthdayView.style.display = 'none';
        birthdaySurpriseView.style.display = 'block';

        playSurpriseButton.addEventListener('click', startSurprise, { once: true });
        playPauseButton.addEventListener('click', togglePlayPause);
    }

    function startSurprise() {
        playSurpriseButton.style.display = 'none';
        
        slideshowContainer.style.visibility = 'visible';
        letterContainer.style.visibility = 'visible';
        bottomControls.style.visibility = 'visible';

        music.play();
        playPauseButton.innerHTML = pauseIcon;
        
        music.addEventListener('timeupdate', updateLyrics);

        if (slides.length > 0) {
            displaySlide(currentSlideIndex);
        }
    }

    function togglePlayPause() {
        if (music.paused) {
            music.play();
            playPauseButton.innerHTML = pauseIcon;
        } else {
            music.pause();
            playPauseButton.innerHTML = playIcon;
        }
    }

    // --- LYRICS LOGIC ---
    function updateLyrics() {
        const currentTime = music.currentTime;
        // LYRICS DEBUGGER: Open the console (F12) to see the song's current time
        console.log("Current Song Time:", currentTime);

        const lyricIndex = lyrics.findIndex((lyric, index) => {
            const nextLyric = lyrics[index + 1];
            return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
        });

        if (lyricIndex !== -1 && lyricIndex !== currentLyricIndex) {
            lyricsContainer.textContent = lyrics[lyricIndex].text;
            currentLyricIndex = lyricIndex;
        }
    }

    // --- SLIDESHOW LOGIC (with fade) ---
    function displaySlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        displaySlide(currentSlideIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        displaySlide(currentSlideIndex);
    });

    // --- START THE APP ---
    initializeApp();
});