import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- Global Error Diagnostic ---
window.addEventListener('error', (e) => {
    console.error("Critical System Error:", e);
    // Only alert if it's likely related to our login logic
    if (e.message.includes('auth') || e.message.includes('pwdInput') || e.message.includes('dniInput')) {
        alert("Error de Sistema detectado: " + e.message + "\nArchivo: " + e.filename + "\nLínea: " + e.lineno);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            });
        });
    }

    // --- Header Scroll Effect ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                header.style.height = '70px';
            } else {
                header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.05)';
                header.style.height = '80px';
            }
        });
    }

    // --- Scroll Animations ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));

    // --- Intranet Login Implementation (Firebase) ---
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const dniInputField = document.getElementById('dniInput');

    if (dniInputField) {
        dniInputField.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const dniVal = document.getElementById('dniInput')?.value.trim();
            const roleSelect = document.getElementById('loginRole')?.value;
            // Robust password field selection (fallback if ID is missing)
            const pwdField = document.getElementById('pwdInput') || loginForm.querySelector('input[type="password"]');
            const pwdVal = pwdField?.value;

            console.log("Debug: Login Attempt", { dniVal, roleSelect });

            if (!dniVal || dniVal.length !== 8) {
                if (loginMessage) loginMessage.innerText = 'El DNI debe tener exactamente 8 cifras.';
                return;
            }

            if (!pwdVal) {
                if (loginMessage) loginMessage.innerText = 'Por favor, ingrese su contraseña.';
                return;
            }

            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn?.innerText;
            if (btn) {
                btn.innerText = 'Verificando...';
                btn.disabled = true;
            }

            try {
                const email = `${dniVal}@genaroherrera.edu.pe`;
                console.log("Debug: Auth Email", email);

                if (loginMessage) {
                    loginMessage.innerText = 'Autenticando...';
                    loginMessage.style.color = 'blue';
                }

                await signInWithEmailAndPassword(auth, email, pwdVal);

                console.log("Debug: Login Successful");
                alert("LOGIN EXITOSO: Usted ha sido autenticado correctamente.");

                if (loginMessage) {
                    loginMessage.innerText = 'Acceso concedido. Redirigiendo...';
                    loginMessage.style.color = 'green';
                }

                setTimeout(() => {
                    let finalPath = 'dashboard.html';
                    if (roleSelect === 'admin') finalPath = 'admin.html';
                    else if (roleSelect === 'editor') finalPath = 'noticias_admin.html';
                    else if (roleSelect === 'staff') finalPath = 'teacher.html';

                    console.log("Redirigiendo a:", finalPath);
                    window.location.href = finalPath;
                }, 800);

            } catch (error) {
                console.error("Login Error:", error);
                if (loginMessage) {
                    loginMessage.style.color = 'red';
                    if (error.code === 'auth/invalid-credential') {
                        loginMessage.innerText = 'DNI o Contraseña incorrectos.';
                    } else if (error.code === 'auth/network-request-failed') {
                        loginMessage.innerText = 'Error de conexión. Revisa tu internet.';
                    } else {
                        loginMessage.innerText = "Error: " + error.message;
                    }
                }
                if (btn) {
                    btn.innerText = originalText || 'Ingresar';
                    btn.disabled = false;
                }
            }
        });
    }

    // --- Image Slider ---
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }

    // --- Teacher Carousel ---
    const track = document.querySelector('.carousel-track');
    if (track) {
        const nextButton = document.querySelector('.carousel-button--right');
        const prevButton = document.querySelector('.carousel-button--left');
        const slidesItems = Array.from(track.children);

        if (slidesItems.length > 0) {
            let currentIndex = 0;
            const updateCarousel = () => {
                const stride = slidesItems[0].getBoundingClientRect().width + 20; // width + gap
                track.style.transform = `translateX(-${currentIndex * stride}px)`;
            };

            nextButton?.addEventListener('click', () => {
                const visible = window.innerWidth < 768 ? 1 : 3;
                currentIndex = (currentIndex < slidesItems.length - visible) ? currentIndex + 1 : 0;
                updateCarousel();
            });

            prevButton?.addEventListener('click', () => {
                const visible = window.innerWidth < 768 ? 1 : 3;
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : Math.max(0, slidesItems.length - visible);
                updateCarousel();
            });

            window.addEventListener('resize', updateCarousel);
        }
    }

    // --- Contact Form (EmailJS) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn?.innerText;
            const contactMsg = document.getElementById('contactMessage');

            if (btn) {
                btn.innerText = 'Enviando...';
                btn.disabled = true;
            }

            if (typeof window.emailjs === 'undefined') {
                if (contactMsg) contactMsg.innerText = 'Error: Sistema de correos no disponible.';
                if (btn) { btn.innerText = originalText; btn.disabled = false; }
                return;
            }

            const SERVICE_ID = 'service_payph79';
            const TEMPLATE_ID = 'template_vsfa5g9';

            window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm)
                .then(() => {
                    if (contactMsg) {
                        contactMsg.innerText = '¡Mensaje enviado con éxito!';
                        contactMsg.style.color = 'green';
                    }
                    contactForm.reset();
                })
                .catch((err) => {
                    console.error('Email error:', err);
                    if (contactMsg) {
                        contactMsg.innerText = 'Error al enviar mensaje.';
                        contactMsg.style.color = 'red';
                    }
                })
                .finally(() => {
                    if (btn) {
                        btn.innerText = originalText || 'Enviar';
                        btn.disabled = false;
                    }
                });
        });
    }
});
