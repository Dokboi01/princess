document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // TAB NAVIGATION
    // -------------------------------------------------------------------------
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }

            // Custom handler for games / scratch canvas resize
            if (tabId === 'games') {
                initScratchCard();
            }
        });
    });

    // -------------------------------------------------------------------------
    // FLOATING HEART BACKGROUND PARTICLES
    // -------------------------------------------------------------------------
    const particlesContainer = document.getElementById('particlesContainer');
    const heartSymbols = ['💖', '❤️', '💕', '🌸', '✨', '🎈'];
    
    function createFloatingHeart() {
        if (!particlesContainer) return;
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        // Random horizontal position, sizes, and delays
        heart.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 1.5 + 0.8;
        heart.style.fontSize = `${size}rem`;
        heart.style.animationDuration = Math.random() * 5 + 6 + 's';
        
        particlesContainer.appendChild(heart);
        
        // Clean up
        setTimeout(() => {
            heart.remove();
        }, 11000);
    }
    
    setInterval(createFloatingHeart, 600);

    // -------------------------------------------------------------------------
    // COUNTDOWN TIMER (Count up since start of her Birthday)
    // -------------------------------------------------------------------------
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Birthday starts today July 11, 2026 (local time)
    const birthdayStart = new Date('2026-07-11T00:00:00');

    function updateCountdown() {
        const now = new Date();
        let diff = now - birthdayStart;

        if (diff < 0) {
            // If before birthday, count down instead
            diff = Math.abs(diff);
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.innerText = String(days).padStart(2, '0');
        hoursEl.innerText = String(hours).padStart(2, '0');
        minutesEl.innerText = String(minutes).padStart(2, '0');
        secondsEl.innerText = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // -------------------------------------------------------------------------
    // CONFETTI ANIMATION SYSTEM
    // -------------------------------------------------------------------------
    const confettiCanvas = document.getElementById('confettiCanvas');
    const ctx = confettiCanvas.getContext('2d');
    let confettiActive = false;
    let confettiParticles = [];
    const confettiColors = ['#ff6584', '#ffb7b2', '#ffd166', '#a8dadc', '#e8c4ff', '#ffffff'];

    function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfettiCanvas);
    resizeConfettiCanvas();

    class Confetti {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = Math.random() * -confettiCanvas.height - 20;
            this.size = Math.random() * 6 + 6;
            this.speed = Math.random() * 5 + 3;
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 4 - 2;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        }
        update() {
            this.y += this.speed;
            this.angle += this.spin;
            // Wobble horizontal path
            this.x += Math.sin(this.y / 30) * 1.2;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    function triggerConfetti() {
        confettiActive = true;
        confettiParticles = [];
        for (let i = 0; i < 150; i++) {
            confettiParticles.push(new Confetti());
        }
        animateConfetti();
        // Stop generating new ones after 5 seconds
        setTimeout(() => {
            confettiActive = false;
        }, 5000);
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        confettiParticles.forEach((p, index) => {
            p.update();
            p.draw();
            // Recycle or remove particle
            if (p.y > confettiCanvas.height) {
                if (confettiActive) {
                    confettiParticles[index] = new Confetti();
                } else {
                    confettiParticles.splice(index, 1);
                }
            }
        });

        if (confettiParticles.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }

    const celebrateBtn = document.getElementById('celebrateBtn');
    celebrateBtn.addEventListener('click', () => {
        triggerConfetti();
        // Play click sound or celebration effect
        createFloatingCelebrationHearts();
    });

    function createFloatingCelebrationHearts() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.innerText = '💖';
                heart.style.left = (Math.random() * 80 + 10) + 'vw';
                heart.style.fontSize = `${Math.random() * 2 + 1.5}rem`;
                heart.style.animationDuration = '4s';
                particlesContainer.appendChild(heart);
                setTimeout(() => heart.remove(), 4500);
            }, i * 150);
        }
    }

    // -------------------------------------------------------------------------
    // MEMORIES SYSTEM
    // -------------------------------------------------------------------------
    const memoryGrid = document.getElementById('memoryGrid');
    const addMemoryBtn = document.getElementById('addMemoryBtn');
    const memoryModal = document.getElementById('memoryModal');
    const cancelMemoryBtn = document.getElementById('cancelMemoryBtn');
    const memoryForm = document.getElementById('memoryForm');
    const memImageInput = document.getElementById('memImage');

    let memories = JSON.parse(localStorage.getItem('princess_memories')) || [];

    function renderMemories() {
        // Clear all except the first two hardcoded ones (or render them all dynamically)
        // Let's replace the grid content completely with saved ones, falling back to seed if empty
        if (memories.length === 0) {
            // Seed a couple of default ones
            memories = [
                {
                    title: 'Our First Date',
                    date: '2024-10-14',
                    desc: 'Where the magic all started. I was so nervous but you were absolutely stunning!',
                    image: '',
                    gradientClass: 'romantic-gradient'
                },
                {
                    title: 'Beautiful Sunsets',
                    date: '2025-01-08',
                    desc: 'Chasing sunsets together and holding your warm hand. Best feeling ever.',
                    image: '',
                    gradientClass: 'sweet-gradient'
                }
            ];
            localStorage.setItem('princess_memories', JSON.stringify(memories));
        }

        memoryGrid.innerHTML = '';
        memories.forEach((mem, index) => {
            const polaroid = document.createElement('div');
            polaroid.className = 'polaroid';
            
            // Random styling rotation between -3 and 3 degrees
            const rotate = (Math.random() * 6 - 3).toFixed(1);
            polaroid.style.setProperty('--rot', `${rotate}deg`);

            let imageHtml = '';
            if (mem.image) {
                imageHtml = `<img src="${mem.image}" alt="${mem.title}">`;
            } else {
                const grad = mem.gradientClass || 'custom-gradient';
                imageHtml = `<div class="placeholder-img ${grad}">${mem.title} ✨</div>`;
            }

            polaroid.innerHTML = `
                <div class="polaroid-img-wrapper">
                    ${imageHtml}
                </div>
                <div class="polaroid-caption">
                    <h3>${mem.title}</h3>
                    <p class="date">${formatDate(mem.date)}</p>
                    <p class="desc">${mem.desc}</p>
                </div>
            `;
            
            memoryGrid.appendChild(polaroid);
        });
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    }

    addMemoryBtn.addEventListener('click', () => {
        memoryModal.classList.add('active');
    });

    cancelMemoryBtn.addEventListener('click', () => {
        memoryModal.classList.remove('active');
        memoryForm.reset();
    });

    memoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('memTitle').value;
        const date = document.getElementById('memDate').value;
        const desc = document.getElementById('memDesc').value;
        
        const saveMemory = (imgData = '') => {
            memories.push({
                title,
                date,
                desc,
                image: imgData,
                gradientClass: 'custom-gradient'
            });
            localStorage.setItem('princess_memories', JSON.stringify(memories));
            renderMemories();
            memoryModal.classList.remove('active');
            memoryForm.reset();
            triggerConfetti();
        };

        if (memImageInput.files && memImageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                saveMemory(event.target.result);
            };
            reader.readAsDataURL(memImageInput.files[0]);
        } else {
            saveMemory();
        }
    });

    renderMemories();

    // -------------------------------------------------------------------------
    // GAMES MODULE
    // -------------------------------------------------------------------------
    // Switching sub-tabs in Play Zone
    const gameTabBtns = document.querySelectorAll('.game-tab-btn');
    const gameContainers = document.querySelectorAll('.game-container');

    gameTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gameId = btn.getAttribute('data-game');
            gameTabBtns.forEach(b => b.classList.remove('active'));
            gameContainers.forEach(gc => gc.classList.remove('active'));

            btn.classList.add('active');
            const targetContainer = document.getElementById(`game-${gameId}`);
            if (targetContainer) {
                targetContainer.classList.add('active');
            }

            if (gameId === 'scratch') {
                initScratchCard();
            }
        });
    });

    // --- GAME 1: RELATIONSHIP QUIZ ---
    const quizQuestions = [
        {
            q: "Where was our very first date?",
            a: ["Coffee shop", "An elegant park walk", "The cinema", "A romantic restaurant"],
            correct: 0,
            success: "Yes! That coffee was the sweetest of my life! ☕",
            fail: "Oops! Good guess, but it was actually at that lovely coffee shop! 😉"
        },
        {
            q: "What is my absolute favorite thing about you?",
            a: ["Your stunning smile", "Your kind & caring heart", "Your adorable laugh", "All of the above (and infinitely more!)"],
            correct: 3,
            success: "Exactly! I couldn't pick just one even if I tried! 🥰",
            fail: "Aww, though true, the absolute correct answer is ALL OF THE ABOVE! ❤️"
        },
        {
            q: "Who said 'I love you' first?",
            a: ["I did!", "You did!", "We said it at the same exact time!", "It remains a mystery..."],
            correct: 1,
            success: "Haha yes! I couldn't wait another second to say it! 💘",
            fail: "Nice try! I actually blurted it out first because I was so in love! 😘"
        },
        {
            q: "What is our favorite cozy activity together?",
            a: ["Binge-watching shows", "Cooking up a new recipe", "Late-night drives & talking", "Cuddling up and relaxing"],
            correct: 3,
            success: "Yes! Being wrapped in your warm hugs is my favorite place on Earth. 🧸",
            fail: "Though we love that, cuddling up in blankets is my absolute favorite! 🥰"
        },
        {
            q: "If I could take you anywhere in the world right now, where would it be?",
            a: ["A tropical sunny beach", "A cozy cabin in the snowy mountains", "A romantic trip to Paris", "Anywhere, as long as it's with you"],
            correct: 3,
            success: "Yes! The place doesn't matter at all, as long as you're right by my side! ✈️💖",
            fail: "A cozy spot indeed, but really anywhere in the universe with you is perfect! 💫"
        }
    ];

    let currentQ = 0;
    let quizScore = 0;

    const quizIntro = document.getElementById('quiz-intro');
    const quizPlay = document.getElementById('quiz-play');
    const quizResult = document.getElementById('quiz-result');
    const startQuizBtn = document.getElementById('startQuizBtn');
    const restartQuizBtn = document.getElementById('restartQuizBtn');
    const questionNum = document.getElementById('questionNum');
    const progressFill = document.getElementById('progressFill');
    const questionText = document.getElementById('questionText');
    const quizOptions = document.getElementById('quizOptions');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');

    startQuizBtn.addEventListener('click', startQuiz);
    restartQuizBtn.addEventListener('click', startQuiz);

    function startQuiz() {
        currentQ = 0;
        quizScore = 0;
        quizIntro.classList.add('hidden');
        quizResult.classList.add('hidden');
        quizPlay.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        const qData = quizQuestions[currentQ];
        questionNum.innerText = `Question ${currentQ + 1} of ${quizQuestions.length}`;
        progressFill.style.width = `${((currentQ + 1) / quizQuestions.length) * 100}%`;
        questionText.innerText = qData.q;
        quizOptions.innerHTML = '';

        qData.a.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerText = opt;
            btn.addEventListener('click', () => selectAnswer(idx));
            quizOptions.appendChild(btn);
        });
    }

    function selectAnswer(selectedIdx) {
        const qData = quizQuestions[currentQ];
        const buttons = quizOptions.querySelectorAll('.quiz-option-btn');
        
        // Disable choices
        buttons.forEach(btn => btn.disabled = true);
        
        const isCorrect = (selectedIdx === qData.correct);
        if (isCorrect) {
            quizScore++;
            buttons[selectedIdx].style.borderColor = "#baffc9";
            buttons[selectedIdx].style.background = "rgba(186, 255, 201, 0.2)";
        } else {
            buttons[selectedIdx].style.borderColor = "#ffb3ba";
            buttons[selectedIdx].style.background = "rgba(255, 179, 186, 0.2)";
            buttons[qData.correct].style.borderColor = "#baffc9";
        }

        // Create alert note
        const msg = document.createElement('p');
        msg.style.marginTop = '1rem';
        msg.style.fontWeight = 'bold';
        msg.style.color = isCorrect ? '#baffc9' : '#ffb3ba';
        msg.innerText = isCorrect ? qData.success : qData.fail;
        quizPlay.appendChild(msg);

        setTimeout(() => {
            msg.remove();
            currentQ++;
            if (currentQ < quizQuestions.length) {
                showQuestion();
            } else {
                showQuizResults();
            }
        }, 3000);
    }

    function showQuizResults() {
        quizPlay.classList.add('hidden');
        quizResult.classList.remove('hidden');
        
        let feedback = "";
        if (quizScore === quizQuestions.length) {
            feedback = "Perfect! You know us perfectly! You are literally my soulmate! 💍💖";
            triggerConfetti();
        } else if (quizScore >= 3) {
            feedback = "So close! You know us super well. I love you to the moon and back! 🌙✨";
        } else {
            feedback = "No worries, cute! It just means we need to go on way more dates to catch up! 😉💕";
        }

        resultTitle.innerText = `You scored ${quizScore}/${quizQuestions.length}!`;
        resultText.innerText = feedback;
    }

    // --- GAME 2: CUPID'S MATCH MEMORY CARD GAME ---
    const matchEmojis = ['💖', '🌹', '🍫', '🧸', '💍', '👩&zwj;❤️&zwj;👨', '💌', '🎈'];
    let cardDeck = [...matchEmojis, ...matchEmojis];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    const memoryBoard = document.getElementById('memoryBoard');
    const movesCount = document.getElementById('movesCount');
    const resetMatchBtn = document.getElementById('resetMatchBtn');

    resetMatchBtn.addEventListener('click', resetMatchGame);

    function initMatchGame() {
        memoryBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        movesCount.innerText = moves;

        // Shuffle deck
        cardDeck.sort(() => Math.random() - 0.5);

        cardDeck.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;

            card.innerHTML = `
                <div class="card-face card-back">💘</div>
                <div class="card-face card-front">${emoji}</div>
            `;

            card.addEventListener('click', flipCard);
            memoryBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
            return;
        }

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesCount.innerText = moves;
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.emoji === card2.dataset.emoji;

        if (isMatch) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            flippedCards = [];
            matchedPairs++;
            
            if (matchedPairs === matchEmojis.length) {
                setTimeout(() => {
                    alert(`Congratulations! You matched all pairs in ${moves} moves! 🎉💖`);
                    triggerConfetti();
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }

    function resetMatchGame() {
        initMatchGame();
    }

    initMatchGame();

    // --- GAME 3: SECRET SCRATCH CARD ---
    const scratchCanvas = document.getElementById('scratchCanvas');
    const scratchCtx = scratchCanvas.getContext('2d');
    let isDrawing = false;
    let scratchedPercent = 0;
    const resetScratchBtn = document.getElementById('resetScratchBtn');

    resetScratchBtn.addEventListener('click', initScratchCard);

    function initScratchCard() {
        if (!scratchCanvas) return;
        
        // Reset properties
        isDrawing = false;
        scratchedPercent = 0;
        
        // Clear canvas and draw top silver cover
        scratchCtx.globalCompositeOperation = 'source-over';
        
        // Silver Gradient
        const grad = scratchCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
        grad.addColorStop(0, '#cfd2cd');
        grad.addColorStop(0.5, '#a6a2a2');
        grad.addColorStop(1, '#7e7f83');
        scratchCtx.fillStyle = grad;
        scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        // Add instructions text on top of scratch cover
        scratchCtx.fillStyle = '#1b1322';
        scratchCtx.font = 'bold 16px Outfit';
        scratchCtx.textAlign = 'center';
        scratchCtx.textBaseline = 'middle';
        scratchCtx.fillText('Scratch here for a surprise! ✨', scratchCanvas.width / 2, scratchCanvas.height / 2);

        // Setup composite to erase
        scratchCtx.globalCompositeOperation = 'destination-out';
    }

    function scratch(e) {
        if (!isDrawing) return;
        
        const rect = scratchCanvas.getBoundingClientRect();
        
        // Touch or Mouse position
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        scratchCtx.beginPath();
        scratchCtx.arc(x, y, 18, 0, Math.PI * 2);
        scratchCtx.fill();
        
        checkScratchProgress();
    }

    function checkScratchProgress() {
        const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const pixels = imgData.data;
        let transparent = 0;
        
        // Check transparent pixels (alpha is 0)
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparent++;
            }
        }
        
        const percent = (transparent / (pixels.length / 4)) * 100;
        if (percent > 45) {
            // Reveal entire canvas
            scratchCanvas.style.transition = 'opacity 0.6s ease';
            scratchCanvas.style.opacity = '0';
            setTimeout(() => {
                scratchCanvas.style.display = 'none';
            }, 600);
            triggerConfetti();
        }
    }

    // Canvas Events
    scratchCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        scratch(e);
    });
    scratchCanvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => isDrawing = false);

    scratchCanvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        scratch(e);
    });
    scratchCanvas.addEventListener('touchmove', scratch);
    window.addEventListener('touchend', () => isDrawing = false);

    initScratchCard();

    // -------------------------------------------------------------------------
    // WISH WALL SYSTEM
    // -------------------------------------------------------------------------
    const wishBoard = document.getElementById('wishBoard');
    const wishText = document.getElementById('wishText');
    const postWishBtn = document.getElementById('postWishBtn');
    const colorDots = document.querySelectorAll('.color-dot');

    let activeColor = '#ffb3ba'; // default pink
    let wishes = JSON.parse(localStorage.getItem('princess_wishes')) || [];

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            activeColor = dot.getAttribute('data-color');
        });
    });

    function renderWishes() {
        wishBoard.innerHTML = '';
        wishes.forEach((w, index) => {
            const note = document.createElement('div');
            note.className = 'sticky-note';
            note.style.backgroundColor = w.color;
            
            // Random slight rotation
            const rotate = (Math.random() * 4 - 2).toFixed(1);
            note.style.setProperty('--rot', `${rotate}deg`);

            note.innerHTML = `
                <button class="delete-sticky" data-index="${index}">×</button>
                <div class="sticky-text">${escapeHtml(w.text)}</div>
                <div class="sticky-date">${formatDate(w.date)}</div>
            `;

            wishBoard.appendChild(note);
        });

        // Add delete handlers
        document.querySelectorAll('.delete-sticky').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                wishes.splice(index, 1);
                localStorage.setItem('princess_wishes', JSON.stringify(wishes));
                renderWishes();
            });
        });
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    postWishBtn.addEventListener('click', () => {
        const text = wishText.value.trim();
        if (!text) return;

        wishes.push({
            text,
            color: activeColor,
            date: new Date().toISOString()
        });

        localStorage.setItem('princess_wishes', JSON.stringify(wishes));
        wishText.value = '';
        renderWishes();
        triggerConfetti();
    });

    renderWishes();

    // -------------------------------------------------------------------------
    // PROCEDURAL MUSIC SYSTEM (Using Web Audio API)
    // -------------------------------------------------------------------------
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const trackStatus = document.querySelector('.track-status');
    let audioCtx = null;
    let isPlaying = false;
    let musicInterval = null;

    // Soft melody notes (frequencies) in a romantic key (C Major / A Minor or E Major)
    // Progression: Cmaj7 - Am7 - Fmaj7 - G7
    const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
        [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
        [174.61, 261.63, 349.23, 440.00], // Fmaj7 (F3, C4, F4, A4)
        [196.00, 293.66, 392.00, 493.88]  // G7 (G3, D4, G4, B4)
    ];

    let currentChordIdx = 0;
    let noteIdx = 0;

    function playNote(freq, time, duration) {
        if (!audioCtx) return;
        
        // Synth osc
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle'; // Soft tone
        osc.frequency.setValueAtTime(freq, time);
        
        // Soft volume envelope
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.12, time + 0.05); // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration); // Release
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(time);
        osc.stop(time + duration);
    }

    function stepMelody() {
        if (!audioCtx) return;
        
        const now = audioCtx.currentTime;
        const currentChord = chords[currentChordIdx];
        
        // Pick an arpeggio note or chord tone
        const baseNote = currentChord[noteIdx % currentChord.length];
        
        // Play base arpeggio note
        playNote(baseNote, now, 0.4);
        
        // Add a high sweet melody note every alternate beat
        if (noteIdx % 2 === 0) {
            const highMelody = [523.25, 587.33, 659.25, 783.99]; // C5, D5, E5, G5
            const randHighNote = highMelody[Math.floor(Math.random() * highMelody.length)];
            playNote(randHighNote, now + 0.15, 0.25);
        }

        noteIdx++;
        if (noteIdx % 8 === 0) {
            currentChordIdx = (currentChordIdx + 1) % chords.length;
        }
    }

    function toggleMusic() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (isPlaying) {
            // Pause
            clearInterval(musicInterval);
            trackStatus.innerText = 'Paused';
            musicToggleBtn.innerText = '▶';
            isPlaying = false;
        } else {
            // Resume/Play
            audioCtx.resume();
            musicInterval = setInterval(stepMelody, 300); // 100 BPM arpeggio
            trackStatus.innerText = 'Playing';
            musicToggleBtn.innerText = '❚❚';
            isPlaying = true;
        }
    }

    musicToggleBtn.addEventListener('click', toggleMusic);
});
