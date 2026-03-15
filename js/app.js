document.addEventListener('DOMContentLoaded', () => {
    /* --- Custom Cursor Logic --- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Check if device supports hover and pointer is fine (not mobile)
    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    if (!isMobile && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Direct update for dot
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Slight delay for outline via css easing wouldn't work easily with direct left/top updates,
            // we animate it via JS requestAnimationFrame for smooth trailing.
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
        });

        // Add hover effects on links and buttons
        const interactables = document.querySelectorAll('a, button, .service-card');
        
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            navbar.querySelector('.nav-container').style.background = 'rgba(10, 10, 12, 0.8)';
            navbar.querySelector('.nav-container').style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        } else {
            navbar.querySelector('.nav-container').style.background = 'var(--bg-glass)';
            navbar.querySelector('.nav-container').style.borderBottom = '1px solid var(--glass-border)';
        }

        lastScroll = currentScroll;
    });

    /* --- Smooth Scrolling for Anchor Links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* --- Intersection Observer for Scroll Animations --- */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Read inline delay if exists to stagger elements
                const delay = entry.target.style.getPropertyValue('--delay');
                if (delay) {
                    entry.target.style.transitionDelay = delay;
                }
                
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* --- Service Card Hover Glow Effect (Mouse Move interaction) --- */
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        // Read data-color for customized background glow
        const glowColor = card.getAttribute('data-color') || 'rgba(255,255,255,0.06)';
        card.style.setProperty('--card-glow', glowColor);

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* --- Pause endless scroller on click or touch (for mobile) --- */
    const scrollerTracks = document.querySelectorAll('.scroller-track');
    scrollerTracks.forEach(track => {
        track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
        track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
        track.addEventListener('touchstart', () => track.style.animationPlayState = 'paused');
        track.addEventListener('touchend', () => track.style.animationPlayState = 'running');
    });
});
