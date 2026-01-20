/* Interactive Mouse Effect - Bubble Constellation */
class InteractiveBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'hero-canvas';
        this.ctx = this.canvas.getContext('2d');

        // Find hero section to append
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.prepend(this.canvas);
            this.width = hero.offsetWidth;
            this.height = hero.offsetHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.particles = [];
            this.mouse = { x: null, y: null };

            this.init();
            this.animate();

            // Events
            window.addEventListener('resize', () => this.resize());
            hero.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            hero.addEventListener('mouseleave', () => { this.mouse.x = null; this.mouse.y = null; });
        }
    }

    init() {
        this.particles = [];
        const particleCount = 60; // Number of bubbles
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 4 + 1,
                color: 'rgba(255, 255, 255, ' + (Math.random() * 0.3 + 0.1) + ')'
            });
        }
    }

    resize() {
        const hero = document.querySelector('.hero');
        this.width = hero.offsetWidth;
        this.height = hero.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.init();
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.particles.forEach(p => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            // Mouse Interaction (Magnetic pull) - High Sensitivity
            if (this.mouse.x != null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 300) { // Increased range
                    const force = (300 - distance) / 300;
                    p.x += dx * force * 0.15; // Increased pull strength
                    p.y += dy * force * 0.15;
                }
            }

            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            // Connect near particles
            this.particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// In main.js, instantiate: new InteractiveBackground();
