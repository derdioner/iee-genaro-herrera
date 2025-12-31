import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, orderBy, limit, getDocs, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

    // --- Load Index News ---
    if (document.getElementById('indexNewsContainer')) {
        loadIndexNews();
    }

    // --- Load Level Teachers ---
    if (document.querySelector('.teachers-section')) {
        loadLevelTeachers();
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

    // --- Teacher Carousel Initialization ---
    window.initTeacherCarousel = () => {
        const track = document.querySelector('.carousel-track');
        if (track) {
            const nextButton = document.querySelector('.carousel-button--right');
            const prevButton = document.querySelector('.carousel-button--left');
            const slidesItems = Array.from(track.children);

            if (slidesItems.length > 0) {
                let currentIndex = 0;
                const updateCarousel = () => {
                    const slideWidth = slidesItems[0].getBoundingClientRect().width;
                    const gap = 20; // Corrected gap value
                    const stride = slideWidth + gap;
                    track.style.transform = `translateX(-${currentIndex * stride}px)`;
                };

                // Clear previous listeners to avoid double binding if called multiple times
                nextButton?.replaceWith(nextButton.cloneNode(true));
                prevButton?.replaceWith(prevButton.cloneNode(true));

                const newNext = document.querySelector('.carousel-button--right');
                const newPrev = document.querySelector('.carousel-button--left');

                newNext?.addEventListener('click', () => {
                    const visible = window.innerWidth < 768 ? 1 : 3;
                    currentIndex = (currentIndex < slidesItems.length - visible) ? currentIndex + 1 : 0;
                    updateCarousel();
                });

                newPrev?.addEventListener('click', () => {
                    const visible = window.innerWidth < 768 ? 1 : 3;
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : Math.max(0, slidesItems.length - visible);
                    updateCarousel();
                });

                window.removeEventListener('resize', updateCarousel);
                window.addEventListener('resize', updateCarousel);
                updateCarousel(); // Initial position
            }
        }
    };

    // Note: initTeacherCarousel will be called after fetching data

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

async function loadIndexNews() {
    const container = document.getElementById('indexNewsContainer');
    if (!container) return;

    try {
        const q = query(collection(db, "news"), orderBy("timestamp", "desc"), limit(3));
        const snap = await getDocs(q);

        if (snap.empty) {
            container.innerHTML = '<p class="text-center col-span-full py-10 text-gray-500 italic">Próximamente más novedades...</p>';
            return;
        }

        container.innerHTML = '';
        snap.forEach(docSnap => {
            const data = docSnap.data();
            const div = document.createElement('div');
            div.className = "bg-white rounded-2xl shadow-lg border overflow-hidden w-full flex flex-col";

            let contentHtml = `
                <div class="p-8 pb-0">
                    <div class="flex items-center gap-3 mb-4 text-sky-600">
                         <i class="fas ${data.type || 'fa-bullhorn'} text-2xl"></i>
                         <span class="text-sm font-bold uppercase tracking-wider">${data.date}</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">${data.title}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">${data.description}</p>
                </div>
            `;

            if (data.link && data.link.trim().startsWith('<iframe')) {
                contentHtml += `
                    <div class="px-8 pb-8">
                        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; width: 100%; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                                ${data.link.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"')}
                            </div>
                        </div>
                    </div>
                `;
            } else if (data.link) {
                contentHtml += `
                    <div class="px-8 pb-8 mt-auto">
                        <a href="${data.link}" target="_blank" class="inline-flex items-center gap-2 text-sky-500 font-bold hover:gap-3 transition-all">
                            Ver Más <i class="fas fa-arrow-right text-sm"></i>
                        </a>
                    </div>
                `;
            } else {
                // Add padding to satisfy flex-grow / layout if no link
                contentHtml += `<div class="pb-8"></div>`;
            }

            div.innerHTML = contentHtml;
            container.appendChild(div);
        });
    } catch (err) {
        console.error("Error loading index news:", err);
        container.innerHTML = '<p class="text-center col-span-full text-red-400 py-10">Ocurrió un error al cargar las noticias.</p>';
    }
}

async function loadLevelTeachers() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    // Determine current level from page title or URL
    let level = "Primaria";
    if (document.title.includes("Inicial")) level = "Inicial";
    else if (document.title.includes("Secundaria")) level = "Secundaria";

    console.log("Loading teachers for level:", level);

    let teachersData = [];

    try {
        // Query staff for this level, ordered by priority then name
        const q = query(
            collection(db, "staff"),
            where("level", "==", level),
            orderBy("priority", "asc"),
            orderBy("name", "asc")
        );
        const snap = await getDocs(q);
        snap.forEach(docSnap => {
            teachersData.push(docSnap.data());
        });
    } catch (err) {
        console.error("Error loading teachers from Firestore:", err);
        // If it's a missing index error, it will be logged here
    }

    // Mock data fallback for "Inicial" if database is empty OR failed
    if (teachersData.length === 0 && level === "Inicial") {
        console.log("Using mock data fallback for Inicial");
        teachersData = [
            { name: "Ana García", position: "Docente", grade: "3", section: "Gotitas de Miel", priority: 1 },
            { name: "Lucía Torres", position: "Docente", grade: "3", section: "Ositos Cariñosos", priority: 2 },
            { name: "Martha Ruiz", position: "Docente", grade: "4", section: "Abejitas Laboriosas", priority: 3 },
            { name: "Elena Ramos", position: "Docente", grade: "4", section: "Delfines Azules", priority: 4 },
            { name: "Silvia Luna", position: "Docente", grade: "5", section: "Luceritos de la Mañana", priority: 5 },
            { name: "Carmen Paz", position: "Docente", grade: "5", section: "Soles Radiantes", priority: 6 }
        ];
    }

    if (teachersData.length === 0) {
        track.innerHTML = '<p class="text-center w-full py-10 text-gray-400 italic">Próximamente... estamos completando la plana docente.</p>';
        return;
    }

    track.innerHTML = '';
    teachersData.forEach(data => {
        const li = document.createElement('li');
        li.className = "carousel-slide";

        // Format year and section (only for Inicial or if they exist)
        const yearInfo = data.grade ? `${data.grade} años` : 'No asignado';
        const sectionInfo = data.section ? `Sección: ${data.section}` : '';

        li.innerHTML = `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <!-- Front Side -->
                    <div class="flip-card-front teacher-card">
                        <div class="teacher-img">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="role">${data.position || 'Docente'}</div>
                        <h3 class="name font-bold text-lg">${data.name}</h3>
                    </div>
                    <!-- Back Side -->
                    <div class="flip-card-back">
                        <i class="fas fa-graduation-cap mb-4 text-3xl"></i>
                        <h3 class="font-bold text-xl mb-2">${yearInfo}</h3>
                        <p class="text-lg opacity-90">${sectionInfo}</p>
                        <div class="mt-4 border-t border-white/30 pt-4 w-full text-center text-sm italic">
                            IEE Genaro Herrera
                        </div>
                    </div>
                </div>
            </div>
        `;
        track.appendChild(li);
    });

    // Initialize carousel logic after content is loaded
    if (window.initTeacherCarousel) {
        setTimeout(window.initTeacherCarousel, 100);
    }
}
