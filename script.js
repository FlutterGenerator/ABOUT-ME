document.addEventListener('DOMContentLoaded', function() {
    const loader = document.querySelector('.loader');
    const header = document.getElementById('header');
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    const backToTop = document.getElementById('backToTop');
    const bgMusic = document.getElementById('bgMusic');
    const soundToggle = document.getElementById('soundToggle');
    const typingElement = document.querySelector('.typing');

    const words = [
        "Kang Turu",
        "Reverse Engineer",
        "Ethical Hacker",
        "Web Designer",
        "Software Developer"
    ];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function initializeAudio() {
        if (!bgMusic || !soundToggle) return;
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        }).catch((error) => {
            console.log("Autoplay prevented:", error);
            soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        });
    }

    let isMusicPlaying = true;
    if (soundToggle && bgMusic) {
        soundToggle.addEventListener('click', () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                bgMusic.play();
                soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            isMusicPlaying = !isMusicPlaying;
        });
    }

    document.addEventListener('click', function initClickHandler() {
        initializeAudio();
        document.removeEventListener('click', initClickHandler);
    }, { once: true });

    window.addEventListener('load', () => {
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }, 1000);
        }
    });

    function typeAnimation() {
        if (!typingElement) return;
        const currentWord = words[wordIndex];
        const shouldDelete = isDeleting;
        let typeSpeed = isDeleting ? 50 : 100;

        if (shouldDelete) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        typeSpeed += Math.random() * 50 - 25;
        setTimeout(typeAnimation, typeSpeed);
    }

    setTimeout(typeAnimation, 1000);

    function handleScroll() {
        if (header) {
            header.classList.toggle('sticky', window.scrollY > 50);
        }
        if (backToTop) {
            backToTop.classList.toggle('active', window.scrollY > 300);
        }

        const sections = document.querySelectorAll('section');
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 60) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
        scrollTimeout = requestAnimationFrame(handleScroll);
    });

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (nav) nav.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
            }
        });
    });

    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#3498db' },
                shape: { type: 'circle' },
                opacity: { value: 0.5 },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#3498db',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    out_mode: 'out'
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }

    document.addEventListener('visibilitychange', () => {
        if (!bgMusic) return;
        if (document.hidden) {
            if (isMusicPlaying) bgMusic.pause();
        } else {
            if (isMusicPlaying) bgMusic.play();
        }
    });

    window.addEventListener('beforeunload', () => {
        if (isMusicPlaying && bgMusic) {
            bgMusic.pause();
        }
    });

    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error(`Error: ${msg}\nURL: ${url}\nLine: ${lineNo}`);
        return false;
    };

    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(cb) { window.setTimeout(cb, 1000 / 60); };
});

// 🚫 NO Service Worker in file:// context
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
    if (isSecure) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('✅ ServiceWorker registered'))
                .catch(err => console.warn('⚠️ ServiceWorker failed:', err));
        });
    }
}