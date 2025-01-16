const contactForm = document.getElementById('contact-form');

let fullName = document.getElementById('fullName');
let email = document.getElementById('email');
let message = document.getElementById('message');
let submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    submitButton.textContent = 'Enviando...';
    submitButton.style.backgroundColor = '#ccc';
    submitButton.style.cursor = 'not-allowed';
    submitButton.disabled = true;

    let formData = {
        "name": fullName.value,
        "email": email.value,
        "message": message.value
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        console.log(xhr.responseText);
        if (xhr.responseText === 'success') {
            alert('¡Mensaje Enviado!');
            fullName.value = '';
            email.value = '';
            message.value = '';
        } else {
            alert('Algo ha salido mal');
        }

        // Reset button style and enable it
        submitButton.textContent = 'Enviar';
        submitButton.style.backgroundColor = '';
        submitButton.style.cursor = '';
        submitButton.disabled = false;
    };

    xhr.onerror = function () {
        alert('Hubo un error al enviar el mensaje');

        // Reset button style and enable it
        submitButton.textContent = 'Enviar';
        submitButton.style.backgroundColor = '';
        submitButton.style.cursor = '';
        submitButton.disabled = false;
    };

    xhr.send(JSON.stringify(formData));
});


const CONFIG = {
    preloader: {
        minDisplayTime: 2000,
        fadeOutTime: 500
    },
    swiper: {
        slidesPerView: 1,
        spaceBetween: 30,
        autoplayDelay: 3000,
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            968: { slidesPerView: 3, spaceBetween: 30 },
            1200: { slidesPerView: 3, spaceBetween: 40 }
        }
    },
    observers: {
        animation: {
            threshold: 0.2,
            rootMargin: '0px'
        },
        lazyLoad: {
            threshold: 0,
            rootMargin: '50px'
        }
    }
};

// // INICIALIZACIÓN PRINCIPAL

document.addEventListener('DOMContentLoaded', function () {
    initializePreloader();
    initializeMenu();
    initializeScrollEffects();
    initializeSwiperSlider();
    initializeAnimations();
    initializeLazyLoading();
    initializeScrollProgress();
    setupEventListeners();
    animateContent();
});

// // PRELOADER

function initializePreloader() {
    const preloader = document.getElementById('preloader');
    const startTime = Date.now();
    window.addEventListener('load', function () {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, CONFIG.preloader.minDisplayTime - elapsedTime);
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease-out';

            setTimeout(() => {
                preloader.style.display = 'none';
            }, CONFIG.preloader.fadeOutTime);
        }, remainingTime);
    });
}

// MENÚ
function initializeMenu() {
    const elements = {
        menuToggle: document.querySelector('.menu-toggle'),
        menuClose: document.querySelector('.menu-close'),
        menu: document.querySelector('.offcanvas-menu'),
        overlay: document.querySelector('.menu-overlay'),
        mainContent: document.querySelector('.main-content'),
        menuLinks: document.querySelectorAll('.menu-links a')
    };
    const menuActions = {
        open: () => {
            elements.menu.classList.add('active');
            elements.overlay.classList.add('active');
            elements.mainContent.classList.add('shifted');
            elements.menuToggle.classList.add('hidden');
        },
        close: () => {
            elements.menu.classList.remove('active');
            elements.overlay.classList.remove('active');
            elements.mainContent.classList.remove('shifted');
            elements.menuToggle.classList.remove('hidden');
        }
    };
    // Event Listeners
    elements.menuToggle.addEventListener('click', menuActions.open);
    elements.menuClose.addEventListener('click', menuActions.close);
    elements.overlay.addEventListener('click', menuActions.close);
    // Smooth scroll para enlaces del menú
    elements.menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            menuActions.close();
            const targetElement = document.querySelector(link.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// EFECTOS DE SCROLL

function initializeScrollEffects() {
    const scrollHandlers = {
        heroEffect: () => {
            const heroSection = document.querySelector(".hero");
            const scrollPosition = window.scrollY;
            const threshold = window.innerHeight * 0.3;

            heroSection.classList.toggle('scrolled', scrollPosition > threshold);
            const heroBackground = heroSection.querySelector('.hero::after');
            if (heroBackground) {
                const scaleAmount = 1 + scrollPosition / 1000;
                heroBackground.style.transform = `scale(${scaleAmount})`;
            }
        },
        parallaxEffect: () => {
            const scrolled = window.pageYOffset;
            document.querySelectorAll('.parallax-bg').forEach(el => {
                const speed = el.dataset.speed || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    };

    window.addEventListener("scroll", scrollHandlers.heroEffect);
    window.addEventListener('scroll', scrollHandlers.parallaxEffect);
}

// // INICIALIZACIÓN DEL SWIPER
function initializeSwiperSlider() {
    return new Swiper('.swiper-container', {
        ...CONFIG.swiper,
        centeredSlides: false,
        loop: true,
        autoplay: {
            delay: CONFIG.swiper.autoplayDelay,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
}

// // ANIMACIONES

function initializeAnimations() {
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        }),
        CONFIG.observers.animation
    );

    document.querySelectorAll('.animate').forEach(el => observer.observe(el));
}

// // LAZY LOADING
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        CONFIG.observers.lazyLoad
    );

    function loadImage(image) {
        const src = image.getAttribute('data-src');
        if (!src) return;
        image.src = src;
        image.removeAttribute('data-src');
    }
    document.querySelectorAll('[data-src]').forEach(img => imageObserver.observe(img));
}

// BARRA DE PROGRESO Y EVENTOS

function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

function setupEventListeners() {
    // Scroll suave global
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Scroll down button
    const scrollDownButton = document.querySelector('.scroll-down');
    if (scrollDownButton) {
        scrollDownButton.addEventListener('click', () => {
            const targetSection = document.getElementById('quienes-somos');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Hero parallax
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero::after');
        if (hero) {
            hero.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
        }
    });
}

// // FORMULARIO DE CONTACTO
document.getElementById('contact-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    fetch('procesar-formulario.php', {
        method: 'POST',
        body: new FormData(this)
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('form-response').textContent = data;
            this.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('form-response').textContent = 'Hubo un problema al enviar el mensaje.';
        });
});
// ANIMACIONES DE CONTENIDO
function animateContent() {
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        }),
        { threshold: 0.2, rootMargin: '50px' }
    );

    document.querySelectorAll('.acerca-content, .animate')
        .forEach(element => observer.observe(element));
}


function handleHeaderScroll() {
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

document.addEventListener('DOMContentLoaded', handleHeaderScroll);
document.querySelector('.logo').addEventListener('click', () => {
    const logo = document.querySelector('.logo');
    logo.classList.toggle('active');
});
