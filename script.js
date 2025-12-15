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
                    loginMessage.innerText = 'Acceso concedido. Redirigiendo...';
                    loginMessage.style.color = 'green';

                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
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
});
