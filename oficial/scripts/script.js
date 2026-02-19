// script.js - Funcionalidad básica de JavaScript para el portafolio

// Configuración de Web Audio API - Inicializar temprano
let audioContext;
let audioContextStarted = false;

function initAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('AudioContext created:', audioContext.state);
    } catch (e) {
        console.warn('Web Audio API not supported:', e);
    }
}

function startAudioContext() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            audioContextStarted = true;
            console.log('AudioContext resumed and started');
        }).catch(error => {
            console.warn('Failed to resume AudioContext:', error);
        });
    } else if (audioContext) {
        audioContextStarted = true;
        console.log('AudioContext already running');
    }
}

// Inicializar AudioContext al cargar la página
initAudioContext();

// Inicializar toda la funcionalidad dependiente del DOM cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired - JavaScript is running');
    console.log('Current URL:', window.location.href);
    console.log('User agent:', navigator.userAgent);

    // Manejador del formulario de contacto con EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('Form found, attaching listener');

        // Inicializar EmailJS (reemplaza 'TU_PUBLIC_KEY' con tu clave pública de EmailJS)
        (function () {
            emailjs.init('auvt6mm-PRjUX0bsB'); // Reemplaza esta línea con tu clave pública
        })();

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Form submit event triggered');

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Por favor, completa todos los campos del formulario.');
                return false;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            // Enviar correo usando EmailJS
            // Reemplaza 'TU_SERVICE_ID' y 'TU_TEMPLATE_ID' con los valores de tu cuenta EmailJS
            emailjs.send('service_xsxtcmo', 'template_n7oqz9h', {
                from_name: name,
                from_email: email,
                message: message,
                to_email: 'dvdlpzfnts@gmail.com'
            })
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('¡Gracias por tu mensaje, ' + name + '! Te contactaré pronto.');
                    contactForm.reset();
                })
                .catch(function (error) {
                    console.log('FAILED...', error);
                    alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo o contáctame directamente en dvdlpzfnts@gmail.com');
                })
                .finally(function () {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });

            return false;
        });
    } else {
        console.log('Contact form not found');
    }

    // Desplazamiento suave para el botón de contacto
    const contactBtn = document.querySelector('a[href="#contact"].btn');
    if (contactBtn) {
        console.log('Contact button found:', contactBtn);
        contactBtn.addEventListener('click', function (e) {
            console.log('Contact button clicked');
            e.preventDefault();
            const target = document.getElementById('contact');
            if (target) {
                console.log('Scrolling to contact section');
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.warn('Contact section not found');
            }
        });
    } else {
        console.warn('Contact button not found');
    }

    // Animación de fade-in al hacer scroll (Intersection Observer para rendimiento)
    const observerOptions = {
        threshold: 0.1, // Activa cuando el 10% de la sección es visible
        rootMargin: '0px 0px -50px 0px' // Ajuste para activar antes de que llegue al viewport
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up'); // Agrega clase para animación
            }
        });
    }, observerOptions);

    // Observar todas las secciones para animación
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Función para personalización fácil (ejemplo: cambiar nombre dinámicamente)
// Puedes llamar a esta función desde la consola o integrar con un CMS
function updatePortfolio(name, bio, skills) {
    // Ejemplo de personalización
    document.querySelector('.navbar-brand').textContent = name;
    document.querySelector('.hero-section h1').textContent = `Hola, soy ${name}`;
    // Agrega más lógica según necesites
}

// Prueba de Velocidad de Escritura - Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
        "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell.",
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
        "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
        "All happy families are alike; each unhappy family is unhappy in its own way. This is the opening line of Anna Karenina."
    ];

    let currentText = '';
    let startTime;
    let timerInterval;
    let isTestActive = false;
    let charIndex = 0;
    let correctChars = 0;
    let totalChars = 0;

    const textDisplay = document.getElementById('text-display');
    const typingInput = document.getElementById('typing-input');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultsDiv = document.getElementById('results');
    const wpmSpan = document.getElementById('wpm');
    const accuracySpan = document.getElementById('accuracy');
    const timeSpan = document.getElementById('time');

    // Solo configurar prueba de escritura si los elementos existen (es decir, en la página typing.html)
    if (textDisplay && typingInput && startBtn && resetBtn) {
        function initTest() {
            currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
            displayText();
            typingInput.value = '';
            typingInput.disabled = false;
            startBtn.disabled = true;
            resetBtn.disabled = false;
            resultsDiv.style.display = 'none';
            charIndex = 0;
            correctChars = 0;
            totalChars = 0;
            isTestActive = true;
            startTime = Date.now();
            timerInterval = setInterval(updateTime, 1000);
        }

        function displayText() {
            let html = '';
            for (let i = 0; i < currentText.length; i++) {
                let className = '';
                if (i < charIndex) {
                    className = (i < correctChars || currentText[i] === typingInput.value[i]) ? 'correct' : 'incorrect';
                } else if (i === charIndex) {
                    className = 'current';
                }
                html += `<span class="${className}">${currentText[i]}</span>`;
            }
            textDisplay.innerHTML = html;
        }

        function updateTime() {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timeSpan.textContent = elapsed + 's';
        }

        function calculateResults() {
            const timeInMinutes = (Date.now() - startTime) / 60000;
            const wpm = Math.round((correctChars / 5) / timeInMinutes);
            const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
            wpmSpan.textContent = wpm;
            accuracySpan.textContent = accuracy + '%';
            resultsDiv.style.display = 'block';
        }

        typingInput.addEventListener('input', (e) => {
            if (!isTestActive) return;
            const input = e.target.value;
            totalChars = input.length;
            charIndex = input.length;
            correctChars = 0;
            for (let i = 0; i < input.length; i++) {
                if (input[i] === currentText[i]) {
                    correctChars++;
                }
            }
            displayText();
            if (input.length === currentText.length) {
                isTestActive = false;
                clearInterval(timerInterval);
                calculateResults();
                typingInput.disabled = true;
                startBtn.disabled = false;
            }
        });

        startBtn.addEventListener('click', initTest);

        resetBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            isTestActive = false;
            typingInput.disabled = true;
            startBtn.disabled = false;
            resetBtn.disabled = true;
            textDisplay.innerHTML = '';
            typingInput.value = '';
            resultsDiv.style.display = 'none';
        });

        // Estado inicial
        typingInput.disabled = true;
        resetBtn.disabled = true;
    }
});


// Implementación del Juego Snake - Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');

    // Solo configurar juego de serpiente si el canvas existe (es decir, en la página game.html)
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Funciones de sonido
        function playSound(frequency, duration, type = 'sine') {
            if (!audioContext || !audioContextStarted) {
                console.log('AudioContext not ready for sound playback');
                return;
            }
            try {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = type;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
                console.log('Game sound played:', frequency, 'Hz');
            } catch (error) {
                console.warn('Failed to play game sound:', error);
            }
        }

        // Constantes del juego
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        const BLOCK_SIZE = 20;
        let FPS = 10;

        // Colores
        const BLACK = '#000000';
        const WHITE = '#FFFFFF';
        const GREEN = '#00FF00';
        const RED = '#FF0000';

        // Variables del juego
        let snake = [];
        let food = {};
        let foodAlpha = 1;
        let direction = { x: 0, y: -BLOCK_SIZE };
        let score = 0;
        let level = 1;
        let highScore = localStorage.getItem('snake_high_score') || 0;
        let gameRunning = false;
        let gameInterval;
        let particles = [];
        let gridOffset = 0;

        // Clase de Partícula
        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = (Math.random() - 0.5) * 4;
                this.life = 30;
                this.color = color;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life--;
            }

            draw(ctx) {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.life / 30;
                ctx.fillRect(this.x, this.y, 2, 2);
                ctx.globalAlpha = 1;
            }
        }

        // Inicializar juego
        function initGame() {
            snake = [{ x: Math.floor(WIDTH / 2 / BLOCK_SIZE) * BLOCK_SIZE, y: Math.floor(HEIGHT / 2 / BLOCK_SIZE) * BLOCK_SIZE }];
            direction = { x: 0, y: -BLOCK_SIZE };
            score = 0;
            level = 1;
            FPS = 10;
            particles = [];
            generateFood();
            gameRunning = true;
            gameInterval = setInterval(gameLoop, 1000 / FPS);
        }

        // Generar comida
        function generateFood() {
            let validPosition = false;
            while (!validPosition) {
                food = {
                    x: Math.floor(Math.random() * (WIDTH / BLOCK_SIZE)) * BLOCK_SIZE,
                    y: Math.floor(Math.random() * (HEIGHT / BLOCK_SIZE)) * BLOCK_SIZE
                };
                validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
            }
            foodAlpha = 0;
        }

        // Bucle del juego
        function gameLoop() {
            if (!gameRunning) return;

            moveSnake();
            checkCollision();
            checkFood();

            // Actualizar animaciones
            if (foodAlpha < 1) foodAlpha += 0.05;
            particles = particles.filter(p => p.life > 0);
            particles.forEach(p => p.update());
            gridOffset += 0.5;

            draw();
        }

        // Mover serpiente
        function moveSnake() {
            const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
            snake.unshift(head);
            snake.pop();
        }

        // Verificar colisiones
        function checkCollision() {
            const head = snake[0];

            // Colisión con paredes
            if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {
                gameOver();
                return;
            }

            // Colisión consigo misma
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver();
                    return;
                }
            }
        }

        // Verificar comida
        function checkFood() {
            const head = snake[0];
            if (head.x === food.x && head.y === food.y) {
                snake.push({ ...snake[snake.length - 1] });
                score += 10;
                // Crear partículas
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(food.x + BLOCK_SIZE / 2, food.y + BLOCK_SIZE / 2, RED));
                }
                playSound(800, 0.1);
                if (score % 50 === 0) {
                    level++;
                    FPS += 2;
                    clearInterval(gameInterval);
                    gameInterval = setInterval(gameLoop, 1000 / FPS);
                    // Partículas para subir de nivel
                    for (let i = 0; i < 20; i++) {
                        particles.push(new Particle(WIDTH / 2, HEIGHT / 2, GREEN));
                    }
                    playSound(1000, 0.3);
                }
                generateFood();
            }
        }

        // Fin del juego
        function gameOver() {
            gameRunning = false;
            clearInterval(gameInterval);
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snake_high_score', highScore);
            }
            playSound(200, 0.5);
            // Partículas para fin del juego
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle(WIDTH / 2, HEIGHT / 2, WHITE));
            }
            setTimeout(() => {
                alert(`Game Over! Score: ${score}, High Score: ${highScore}`);
            }, 500);
        }

        // Dibujar juego
        function draw() {
            // Limpiar canvas con fondo degradado
            const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(1, '#111111');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            // Agregar patrón de cuadrícula animado sutil
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + Math.sin(gridOffset * 0.1) * 0.05})`;
            ctx.lineWidth = 1;
            for (let x = 0; x <= WIDTH; x += BLOCK_SIZE) {
                ctx.beginPath();
                ctx.moveTo(x + Math.sin(gridOffset * 0.01 + x * 0.01) * 2, 0);
                ctx.lineTo(x + Math.sin(gridOffset * 0.01 + x * 0.01) * 2, HEIGHT);
                ctx.stroke();
            }
            for (let y = 0; y <= HEIGHT; y += BLOCK_SIZE) {
                ctx.beginPath();
                ctx.moveTo(0, y + Math.sin(gridOffset * 0.01 + y * 0.01) * 2);
                ctx.lineTo(WIDTH, y + Math.sin(gridOffset * 0.01 + y * 0.01) * 2);
                ctx.stroke();
            }

            // Dibujar serpiente con sombra y resplandor
            ctx.shadowColor = GREEN;
            ctx.shadowBlur = 10;
            ctx.fillStyle = GREEN;
            snake.forEach(segment => {
                ctx.fillRect(segment.x, segment.y, BLOCK_SIZE, BLOCK_SIZE);
                // Agregar borde de resplandor
                ctx.strokeStyle = '#00FF00';
                ctx.lineWidth = 2;
                ctx.strokeRect(segment.x, segment.y, BLOCK_SIZE, BLOCK_SIZE);
            });

            // Dibujar comida con sombra y resplandor
            ctx.shadowColor = RED;
            ctx.shadowBlur = 15;
            ctx.globalAlpha = foodAlpha;
            ctx.fillStyle = RED;
            ctx.fillRect(food.x, food.y, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(food.x, food.y, BLOCK_SIZE, BLOCK_SIZE);
            ctx.globalAlpha = 1;

            // Dibujar partículas
            particles.forEach(p => p.draw(ctx));

            // Restablecer sombra
            ctx.shadowBlur = 0;

            // Dibujar texto con sombra
            ctx.fillStyle = WHITE;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 3;
            ctx.font = '16px Arial';
            ctx.fillText(`Score: ${score}`, 10, 20);
            ctx.fillText(`Level: ${level}`, 10, 40);
            ctx.fillText(`High: ${highScore}`, 10, 60);
            ctx.shadowBlur = 0;
        }

        // Manejar entrada de teclado
        document.addEventListener('keydown', (e) => {
            if (!gameRunning) return;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    if (direction.y === 0) direction = { x: 0, y: -BLOCK_SIZE };
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (direction.y === 0) direction = { x: 0, y: BLOCK_SIZE };
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (direction.x === 0) direction = { x: -BLOCK_SIZE, y: 0 };
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (direction.x === 0) direction = { x: BLOCK_SIZE, y: 0 };
                    break;
            }
        });

        // Iniciar juego cuando se hace clic en el botón
        const startGameBtn = document.getElementById('start-game');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                if (!gameRunning) {
                    initGame();
                }
            });
        }
    }
});