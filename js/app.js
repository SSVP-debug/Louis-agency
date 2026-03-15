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
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* --- Storytelling Section Scroll Logic --- */
    const storySection = document.querySelector('.story-section');
    if (storySection) {
        const steps = document.querySelectorAll('.story-step');
        const backgrounds = document.querySelectorAll('.story-bg');
        const totalSteps = steps.length;
        
        window.addEventListener('scroll', () => {
            const rect = storySection.getBoundingClientRect();
            // Start calculation when the top of the section goes above the top of viewport
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                // How far we have scrolled inside the sticky section (0 to 1)
                const scrollProgress = Math.abs(rect.top) / (rect.height - window.innerHeight);
                
                let currentStepIndex = Math.floor(scrollProgress * totalSteps);
                if (currentStepIndex >= totalSteps) currentStepIndex = totalSteps - 1;

                steps.forEach((step, index) => {
                    if (index === currentStepIndex) {
                        step.classList.add('active');
                        step.classList.remove('exit-up');
                    } else if (index < currentStepIndex) {
                        step.classList.remove('active');
                        step.classList.add('exit-up'); // Move UP and fade out
                    } else {
                        step.classList.remove('active');
                        step.classList.remove('exit-up'); // Reset position
                    }
                });

                backgrounds.forEach((bg, index) => {
                    if (index === currentStepIndex) {
                        bg.classList.add('active');
                    } else {
                        bg.classList.remove('active');
                    }
                });
            } else if (rect.top > 0) {
                // Section is below viewport
                steps.forEach((step, index) => {
                    if(index === 0) step.classList.add('active');
                    else step.classList.remove('active');
                    step.classList.remove('exit-up');
                });
                backgrounds.forEach((bg, index) => {
                    if(index === 0) bg.classList.add('active');
                    else bg.classList.remove('active');
                });
            } else if (rect.bottom < window.innerHeight) {
                // Section is above viewport
                steps.forEach((step, index) => {
                    if(index === totalSteps - 1) step.classList.add('active');
                    else step.classList.remove('active');
                    step.classList.remove('exit-up');
                });
                backgrounds.forEach((bg, index) => {
                    if(index === totalSteps - 1) bg.classList.add('active');
                    else bg.classList.remove('active');
                });
            }
        });
    }
});
