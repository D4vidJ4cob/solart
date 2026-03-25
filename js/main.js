/* ============================================
   SolArt.Systems — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Mobile hamburger menu ──────────────────
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-open');
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('is-active');
                mobileMenu.classList.remove('is-open');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('is-active');
                mobileMenu.classList.remove('is-open');
            }
        });
    }

    // ── Mobile diensten submenu toggle ─────────
    const mobileDienstenToggle = document.getElementById('mobile-diensten-toggle');
    const mobileDienstenSub = document.getElementById('mobile-diensten-sub');
    const mobileDienstenArrow = document.getElementById('mobile-diensten-arrow');

    if (mobileDienstenToggle && mobileDienstenSub) {
        mobileDienstenToggle.addEventListener('click', () => {
            mobileDienstenSub.classList.toggle('is-open');
            if (mobileDienstenArrow) {
                mobileDienstenArrow.style.transform = mobileDienstenSub.classList.contains('is-open')
                    ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }

    // ── Navbar scroll effect ───────────────────
    const navbar = document.getElementById('main-nav');

    function handleNavScroll() {
        if (!navbar) return;
        if (window.scrollY > 80) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ── Active nav link highlighting ───────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === '#' + id) {
                        link.classList.remove('text-metallic-gray');
                        link.classList.add('text-secondary', 'border-b-2', 'border-secondary', 'pb-1');
                    } else {
                        link.classList.add('text-metallic-gray');
                        link.classList.remove('text-secondary', 'border-b-2', 'border-secondary', 'pb-1');
                    }
                });
            }
        });
    }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));

    // ── Scroll-triggered animations ────────────
    const animatedElements = document.querySelectorAll('[data-animate]');

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                animateObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animateObserver.observe(el));

    // ── Counter animation ──────────────────────
    const counters = document.querySelectorAll('[data-counter]');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(el => counterObserver.observe(el));

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-counter'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            const startTime = performance.now();
            const isDecimal = target % 1 !== 0;

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                if (isDecimal) {
                    counter.textContent = current.toFixed(1) + suffix;
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ── Progress bar animation ─────────────────
    const progressBar = document.getElementById('grid-reliability-bar');
    if (progressBar) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBar.style.width = '99.9%';
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        // Start at 0 width
        progressBar.style.width = '0%';
        barObserver.observe(progressBar);
    }

    // ── CTA buttons → scroll to contact ────────
    const ctaButtons = document.querySelectorAll('[data-scroll-to]');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-scroll-to');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Form handling (Netlify Forms via fetch) ─
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name    = formData.get('name');
            const submitBtn = contactForm.querySelector('[type="submit"]');

            // Disable button while submitting
            if (submitBtn) {
                submitBtn.disabled     = true;
                submitBtn.style.opacity = '0.6';
            }

            try {
                const response = await fetch('/', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body:    new URLSearchParams(formData).toString(),
                });

                if (response.ok) {
                    showToast(`Bedankt${name ? ', ' + name : ''}! Uw aanvraag is verzonden. Wij nemen snel contact met u op.`);
                    contactForm.reset();
                    contactForm.classList.add('form-success');
                    setTimeout(() => contactForm.classList.remove('form-success'), 600);
                } else {
                    throw new Error('Server antwoord niet OK');
                }
            } catch (err) {
                showToast('Er ging iets mis bij het verzenden. Bel ons of stuur een e-mail.', 8000);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled      = false;
                    submitBtn.style.opacity = '';
                }
            }
        });
    }

    // ── Toast notification ─────────────────────
    function showToast(message, duration = 5000) {
        // Remove existing toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.75rem;">
                <span class="material-symbols-outlined" style="color:#A67C52;font-size:1.2rem;">check_circle</span>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toast);

        // Trigger reveal
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('is-visible');
            });
        });

        // Auto hide
        setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    // ── Parallax-lite on hero background ───────
    const heroSection = document.getElementById('home');
    const heroBg = heroSection ? heroSection.querySelector('img') : null;

    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }, { passive: true });
    }

});
