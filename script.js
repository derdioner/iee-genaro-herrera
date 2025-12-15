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

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
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

    // --- Intranet Login Simulation ---
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate loading
        const btn = loginForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Verificando...';
        btn.style.opacity = '0.7';

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.opacity = '1';
            
            // Simple visual feedback
            loginMessage.innerText = 'Acceso concedido. Redirigiendo...';
            loginMessage.style.color = 'green';
            
            // In a real app, this would redirect
            setTimeout(() => {
                alert('Bienvenido a la Intranet de IEE Genaro Herrera');
                loginForm.reset();
                loginMessage.innerText = '';
            }, 500);
        }, 1500);
    });
});
