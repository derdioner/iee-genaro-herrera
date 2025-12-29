/**
 * Interactive Plexus Background Effect
 * Creates a constellation of moving particles that connect with lines
 * when they are close to each other or the mouse cursor.
 */

class PlexusEffect {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100; // Increased from 80
        this.maxDistance = 150;
        this.mouse = { x: null, y: null };

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseout', () => this.handleMouseOut());
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        // Match the parent element's size if possible, or window size
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth || window.innerWidth;
        this.canvas.height = parent.clientHeight || window.innerHeight;

        // Adjust particle count based on screen size
        if (window.innerWidth < 768) {
            this.particleCount = 50; // Increased
            this.maxDistance = 100;
        } else {
            this.particleCount = 100; // Increased
            this.maxDistance = 150;
        }
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    handleMouseOut() {
        this.mouse.x = null;
        this.mouse.y = null;
    }

    drawLines() {
        for (let i = 0; i < this.particles.length; i++) {
            // Lines between particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const distance = this.getDistance(this.particles[i], this.particles[j]);
                if (distance < this.maxDistance) {
                    this.drawLine(this.particles[i], this.particles[j], distance);
                }
            }

            // Lines to mouse
            if (this.mouse.x !== null) {
                const distanceToMouse = this.getDistance(this.particles[i], this.mouse);
                if (distanceToMouse < this.maxDistance * 1.5) {
                    this.drawLine(this.particles[i], this.mouse, distanceToMouse, true);
                }
            }
        }
    }

    getDistance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    drawLine(p1, p2, distance, isMouse = false) {
        const opacity = 1 - (distance / (isMouse ? this.maxDistance * 1.5 : this.maxDistance));
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`; // Increased from 0.3
        this.ctx.lineWidth = 1.2; // Slightly thicker
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update(this.canvas.width, this.canvas.height);
            particle.draw(this.ctx);
        });

        this.drawLines();
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
    }

    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Increased from 0.5
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new PlexusEffect('plexusCanvas');
});
