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
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userInput = loginForm.querySelector('input[type="text"]').value.trim();
            const passwordInput = loginForm.querySelector('input[type="password"]').value;
            const roleSelect = document.getElementById('loginRole').value;

            // UI Feedback
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Verificando...';
            btn.disabled = true;

            try {
                let email = userInput;

                // Si el usuario ingresa un DNI (solo números, 8 dígitos)
                if (/^\d{8}$/.test(userInput)) {
                    loginMessage.innerText = 'Buscando DNI...';

                    // Buscar el email asociado al DNI en Firestore
                    const { db } = await import('./firebase-config.js');
                    const { collection, query, where, getDocs, limit } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

                    const qTable = roleSelect === 'staff' ? "staff" : "students";
                    const q = query(collection(db, qTable), where("dni", "==", userInput), limit(1));
                    const snap = await getDocs(q);

                    if (!snap.empty) {
                        // El ID del documento es el email para padres, para staff buscamos el campo email
                        email = snap.docs[0].id;
                        if (roleSelect === 'staff' && !email.includes('@')) {
                            email = snap.docs[0].data().email || email;
                        }
                    } else {
                        throw new Error("DNI no registrado para: " + (roleSelect === 'staff' ? "Docente" : "Padre"));
                    }
                }

                loginMessage.innerText = 'Autenticando...';
                await signInWithEmailAndPassword(auth, email, passwordInput);

                loginMessage.innerText = 'Acceso concedido. Redirigiendo...';
                loginMessage.style.color = 'green';

                setTimeout(() => {
                    if (roleSelect === 'staff') {
                        window.location.href = 'teacher.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);

            } catch (error) {
                console.error("Login Error:", error);
                loginMessage.style.color = 'red';
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                    loginMessage.innerText = 'Cuidado: DNI o Contraseña incorrectos.';
                } else {
                    loginMessage.innerText = error.message;
                }
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
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

    // --- Contact Form Implementation (EmailJS) ---
    const contactForm = document.getElementById('contactForm');
    const contactMessage = document.getElementById('contactMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Iniciando envío de formulario...");

            // Estos IDs se encuentran en tu dashboard de EmailJS
            const SERVICE_ID = 'service_payph79';
            const TEMPLATE_ID = 'template_vsfa5g9';

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            if (typeof window.emailjs === 'undefined') {
                console.error("EmailJS SDK no cargado.");
                contactMessage.innerText = 'Error: El sistema de correos no cargó correctamente.';
                contactMessage.style.color = 'red';
                btn.innerText = originalText;
                btn.disabled = false;
                return;
            }

            window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm)
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);
                    btn.innerText = originalText;
                    btn.disabled = false;
                    contactMessage.innerText = '¡Mensaje enviado con éxito!';
                    contactMessage.style.color = 'green';
                    contactForm.reset();
                }, (error) => {
                    console.error('FAILED...', error);
                    btn.innerText = originalText;
                    btn.disabled = false;
                    contactMessage.innerText = 'Error: ' + (error.text || 'No se pudo enviar el mensaje.');
                    contactMessage.style.color = 'red';
                });
        });
    }
});
