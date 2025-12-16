import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Close nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
        });
    });

    // --- Header Scroll Effect ---
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            header.style.height = '70px';
        } else {
            header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.05)';
            header.style.height = '80px';
        }
    });

    // --- Scroll Animations (Intersection Observer) ---
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.2, // Trigger when 20% visible
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Intranet Login Implementation (Firebase) ---
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = loginForm.querySelector('input[type="text"]'); // Assuming text input is email for now
            const passwordInput = loginForm.querySelector('input[type="password"]');

            const email = emailInput.value;
            const password = passwordInput.value;

            // Basic UI feedback
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Verificando...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    const role = document.getElementById('loginRole').value;

                    loginMessage.innerText = 'Acceso concedido. Redirigiendo...';
                    loginMessage.style.color = 'green';

                    setTimeout(() => {
                        if (role === 'staff') {
                            window.location.href = 'admin.html';
                        } else {
                            window.location.href = 'dashboard.html';
                        }
                    }, 1000);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    console.error("Error de login:", errorCode, errorMessage);

                    btn.innerText = originalText;
                    btn.style.opacity = '1';
                    btn.disabled = false;

                    loginMessage.style.color = 'red';

                    if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
                        loginMessage.innerText = 'Usuario o contraseña incorrectos.';
                    } else if (errorCode === 'auth/invalid-email') {
                        loginMessage.innerText = 'Por favor ingresa un correo válido.';
                    } else {
                        loginMessage.innerText = 'Error al iniciar sesión. Intente nuevamente.';
                    }
                });
        });
    }


    // --- Image Slider ---
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
        }, 3000);
    }

    // --- Teacher Carousel ---
    const track = document.querySelector('.carousel-track');
    if (track) {
        // Determine number of teachers based on page
        let count = 30; // Default for Primaria & Secundaria
        if (window.location.pathname.includes('inicial.html')) {
            count = 20;
        }

        // Dummy data for teachers
        const teachers = Array.from({ length: count }, (_, i) => ({
            name: `Docente ${i + 1}`,
            role: i % 3 === 0 ? "Tutor" : "Docente de Aula",
            specialty: ["Matemáticas", "Ciencias", "Comunicación", "Arte", "Inglés"][i % 5],
            img: "https://via.placeholder.com/150/00BFFF/FFFFFF?text=Docente"
        }));

        // Render Cards
        teachers.forEach(teacher => {
            const slide = document.createElement('li');
            slide.classList.add('carousel-slide');
            slide.innerHTML = `
                <div class="card teacher-card">
                    <div class="teacher-img">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <h3>${teacher.name}</h3>
                    <p class="role">${teacher.role}</p>
                    <p>${teacher.specialty}</p>
                    <a href="#" class="btn-profile">Ver Perfil</a>
                </div>
            `;
            track.appendChild(slide);
        });

        const nextButton = document.querySelector('.carousel-button--right');
        const prevButton = document.querySelector('.carousel-button--left');
        const slides = Array.from(track.children);
        let currentIndex = 0;

        const updateCarousel = () => {
            // Calculate width dynamically
            const slideWidth = slides[0].getBoundingClientRect().width;
            // Add gap overlap compensation if needed, but flex gap usually handled by margin logic or gap property. 
            // With flex gap, we stride by (width + gap).
            // Let's approximate stride by fetching offsetLeft diff
            const stride = slides[1].offsetLeft - slides[0].offsetLeft;
            track.style.transform = `translateX(-${currentIndex * stride}px)`;

            // Hide/Show buttons logic if needed (infinite loop better)
        }

        const getVisibleCount = () => window.innerWidth < 768 ? 1 : 3;

        nextButton.addEventListener('click', () => {
            const visibleCount = getVisibleCount();
            if (currentIndex < slides.length - visibleCount) {
                currentIndex++;
                updateCarousel();
            } else {
                // Optional: Loop back to start
                currentIndex = 0;
                updateCarousel();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            } else {
                // Loop to end
                const visibleCount = getVisibleCount();
                currentIndex = slides.length - visibleCount;
                updateCarousel();
            }
        });

        // Handle Resize
        window.addEventListener('resize', updateCarousel);
    }
});
