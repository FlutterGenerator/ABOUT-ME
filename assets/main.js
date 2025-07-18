document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const header = document.querySelector('.header');
    const navLinks = document.querySelector('.nav-links');
    const musicToggle = document.querySelector('.music-toggle');
    const bgMusic = document.getElementById('bgMusic');
    const themeToggle = document.querySelector('.theme-toggle');
    const navToggle = document.querySelector('.nav-toggle');
    let isPlaying = false;

    // === Typed.js ===
    if (typeof Typed !== 'undefined') {
        new Typed('.typed', {
            strings: [
                'Game Hacker',
                'Software Developer',
                'Cheat Creator',
                'Reverse Engineer',
                'Book Reader'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            backDelay: 1500,
            startDelay: 1000
        });
    } else {
        console.warn('Typed.js not loaded');
    }

    // === Particles.js ===
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#ff0000' },
                shape: { type: 'triangle', stroke: { width: 0, color: '#000' } },
                opacity: { value: 0.5 },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true, distance: 150, color: '#ff0000', opacity: 0.4, width: 1
                },
                move: {
                    enable: true, speed: 6, direction: 'none', random: false,
                    straight: false, out_mode: 'out', bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // === Preloader ===
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) preloader.style.opacity = '0';
            setTimeout(() => {
                if (preloader) preloader.style.display = 'none';
            }, 500);
        }, 1500);
    });

    // === Scroll Effects ===
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
        document.querySelectorAll('.reveal').forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 100) {
                el.classList.add('active');
            }
        });
    });

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });

    // === Music Control ===
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                bgMusic.play();
                musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                bgMusic.pause();
                musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });
    }

    // === Theme Toggle ===
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
        });
    }

    // === Glitch Text Effect ===
    document.querySelectorAll('.glitch-text').forEach(text => {
        setInterval(() => {
            text.classList.add('active');
            setTimeout(() => {
                text.classList.remove('active');
            }, 200);
        }, 3000);
    });

    // === Contact Form Submission ===
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message sent successfully!');
            contactForm.reset();
        });
    }

    // === Lazy Load Images ===
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px 50px 0px' });

    images.forEach(img => imageObserver.observe(img));

    // === Mobile Nav Toggle ===
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }

    // === FOUC Prevention ===
    document.documentElement.classList.remove('no-js');

    // === Visibility Change (Pause music) ===
    document.addEventListener('visibilitychange', () => {
        if (bgMusic && isPlaying) {
            if (document.hidden) {
                bgMusic.pause();
            } else {
                bgMusic.play();
            }
        }
    });

    // === Global JS Error Catch ===
    window.onerror = function (msg, url, lineNo, columnNo, error) {
        console.error(`Error: ${msg}\nURL: ${url}\nLine: ${lineNo}`);
        return false;
    };

    // === Fallback for requestAnimationFrame ===
    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
});

// === Safe Service Worker Registration ===
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed', err);
            });
    });
} else {
    console.warn('ServiceWorker not registered: unsupported environment (file:// or insecure)');
}