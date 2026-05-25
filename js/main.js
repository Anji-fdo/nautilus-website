/* ============================================================
   NAUTILUS CODE — Main JavaScript (Multi-Page Version)
   ============================================================ */

// ── STATE ───────────────────────────────────────────────────
let currentSlide = 0;
let slideTimer;

console.log('✓ main.js loaded');

// ── DOM INITIALIZATION ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✓ DOMContentLoaded fired');
    
    // Load Navbar (Optional)
    try {
        const navRes = await fetch("components/navbar.html");
        if (navRes.ok) {
            const navHtml = await navRes.text();
            const placeholder = document.getElementById("navbar-placeholder");
            if (placeholder) {
                placeholder.innerHTML = navHtml;
                console.log('✓ Navbar loaded');
            }
        }
    } catch (e) {
        console.log('ℹ Navbar not found (optional)');
    }

    // Load Footer (Optional)
    try {
        const footRes = await fetch("components/footer.html?v=" + Date.now());
        if (footRes.ok) {
            const footText = await footRes.text();
            // Remove Live Server script tags
            const cleanFooter = footText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            // Parse and inject
            const parser = new DOMParser();
            const footDoc = parser.parseFromString(cleanFooter, 'text/html');
            const footerEl = footDoc.querySelector('footer');
            if (footerEl) {
                const placeholder = document.getElementById("footer-placeholder");
                if (placeholder) {
                    placeholder.appendChild(footerEl);
                    console.log('✓ Footer loaded');
                }
            }
        }
    } catch (e) {
        console.log('ℹ Footer not found (optional)');
    }

    // Initialize all features
    setTimeout(() => {
        highlightActiveNavLink();
        initScrollEffect();
        setupMobileMenu();
        setupContactForm();
        triggerRevealAnimations();
        initSlideshow();
    }, 100);
});

// ── HIGHLIGHT ACTIVE LINK ──────────────────────────────────
function highlightActiveNavLink() {
    let currentPageName = window.location.pathname.split("/").pop().replace(".html", "");
    if (currentPageName === "index" || currentPageName === "") {
        currentPageName = "home";
    }

    console.log('🔍 Current page:', currentPageName);

    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
        const linkPage = link.getAttribute("data-page") || link.getAttribute("href");
        const cleanLinkPage = linkPage ? linkPage.replace(".html", "").replace("#", "") : "";
        
        if (cleanLinkPage === currentPageName || cleanLinkPage === currentPageName.replace(".html", "")) {
            link.classList.add("active");
            console.log('✓ Active link set:', link.textContent);
        } else {
            link.classList.remove("active");
        }
    });
}

// ── NAVIGATE TO PAGE ────────────────────────────────────────
// Works for multi-page setup (separate HTML files)
function navigateTo(page) {
    console.log('📍 Navigation to:', page);
    
    let url = page;
    if (page === 'home') {
        url = 'index.html';
    } else if (!page.includes('.html')) {
        url = page + '.html';
    }
    
    window.location.href = url;
}

// ── SCROLL EFFECT ───────────────────────────────────────────
function initScrollEffect() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 20);
        }
    });
    console.log('✓ Scroll effect initialized');
}

// ── MOBILE MENU ─────────────────────────────────────────────
function setupMobileMenu() {
    console.log('📱 Setting up mobile menu...');
    
    // Close menu when link clicked
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('mobileMenu');
            if (menu) {
                menu.classList.add('hidden');
                menu.classList.remove('open');
                console.log('✓ Mobile menu closed');
            }
        });
    });

    console.log('✓ Mobile menu setup complete');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (!menu) {
        console.warn('⚠ Mobile menu element not found');
        return;
    }
    
    menu.classList.toggle('open');
    menu.classList.toggle('hidden');
    console.log('📱 Mobile menu toggled:', menu.classList.contains('open') ? 'open' : 'closed');
}

// ── CONTACT FORM ────────────────────────────────────────────
function setupContactForm() {
    const form = document.querySelector('form[onsubmit="handleContactSubmit(event)"]') ||
                 document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', handleContactSubmit);
        console.log('✓ Contact form setup');
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    console.log('📨 Contact form submitted');
    
    const form = e.target;
    const successDiv = document.getElementById('contactSuccess');

    if (!successDiv) {
        console.warn('⚠ Success message div not found');
        form.reset();
        return;
    }

    form.style.opacity = '0';
    form.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        form.style.display = 'none';
        successDiv.style.display = 'block';
        successDiv.style.animation = 'fadeUp 0.5s ease forwards';
        
        // Reset after 3 seconds
        setTimeout(() => {
            form.reset();
            form.style.opacity = '1';
            form.style.display = 'block';
            successDiv.style.display = 'none';
            console.log('✓ Form reset');
        }, 3000);
    }, 300);
}

// ── SCROLL REVEAL ANIMATIONS ────────────────────────────────
function triggerRevealAnimations() {
    setTimeout(() => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => el.classList.remove('visible'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(el => observer.observe(el));
    }, 100);

    // Start count-up animations
    startCountUp();
    setupStatsObserver();
}

function startCountUp() {
    document.querySelectorAll('.count').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        if (isNaN(target)) return;

        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    });
}

function setupStatsObserver() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-item').forEach(item => {
                    item.classList.add('visible');
                });
                startCountUp();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(el => {
        const parent = el.parentElement;
        if (parent) statsObserver.observe(parent);
    });
}

// ── HERO SLIDESHOW ──────────────────────────────────────────
function initSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) {
        console.log('ℹ No slideshow found on this page');
        return;
    }

    console.log('✓ Slideshow initialized with', slides.length, 'slides');
    
    // Set first slide as active
    if (slides.length > 0) {
        slides[0].classList.add('active');
        const dots = document.querySelectorAll('.hero-dot');
        if (dots.length > 0) dots[0].classList.add('active');
    }

    startSlideshow();
    attachSlideshowListeners();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    if (!slides.length || !dots.length) return;
    if (index < 0 || index >= slides.length) return;

    // Exit current slide
    slides[currentSlide].classList.add('exiting');
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    setTimeout(() => {
        slides[currentSlide].classList.remove('exiting');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }, 400);
}

function nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
}

function startSlideshow() {
    slideTimer = setInterval(nextSlide, 4000);
}

function stopSlideshow() {
    clearInterval(slideTimer);
}

function attachSlideshowListeners() {
    const wrapper = document.querySelector('.hero-slideshow');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopSlideshow);
        wrapper.addEventListener('mouseleave', startSlideshow);
    }
}

// ── GLOBAL WINDOW FUNCTIONS ────────────────────────────────
// Expose ALL functions to window for HTML inline handlers
window.navigateTo = navigateTo;
window.toggleMobileMenu = toggleMobileMenu;
window.handleContactSubmit = handleContactSubmit;
window.goToSlide = goToSlide;
window.nextSlide = nextSlide;

console.log('✓ All functions exposed to window');