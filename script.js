// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const heroParticles = document.getElementById('hero-particles');

// ===== Navbar Scroll Effect =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== Mobile Menu =====
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            if (correspondingLink) correspondingLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            animateCounter(el, target);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===== Hero Particles =====
function createParticles() {
    if (!heroParticles) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
        heroParticles.appendChild(particle);
    }
}

createParticles();

// ===== Gallery Tabs =====
const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');
const galleryTabContents = document.querySelectorAll('.gallery-tab-content');

galleryTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        // Update active button
        galleryTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active content
        galleryTabContents.forEach(content => {
            content.classList.remove('active');
        });
        const activeTab = document.getElementById('tab-' + tabId);
        if (activeTab) {
            activeTab.classList.add('active');
            // Re-trigger reveal animation for new tab content
            activeTab.querySelectorAll('.reveal').forEach(el => {
                el.classList.remove('active');
                setTimeout(() => el.classList.add('active'), 50);
            });
        }
    });
});

// ===== FAQ Accordion =====
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isOpen = faqItem.classList.contains('open');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('open');
        });

        // Open clicked item if it wasn't already open
        if (!isOpen) {
            faqItem.classList.add('open');
        }
    });
});

// ===== Smooth scroll for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== Footer Yılı (her yıl kendi kendine güncellenir) =====
document.querySelectorAll('#footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
});

// ===== Sezonluk Kayıt Duyurusu =====
// Duyuru sadece bu tarih araligindayken gorunur, disinda otomatik gizlenir.
// Tarihleri degistirmek icin sadece asagidaki 4 sayiyi duzenlemeniz yeterli.
const KAYIT_SEZONU = {
    baslangicAy: 6,   // Haziran
    baslangicGun: 15,
    bitisAy: 11,      // Kasim
    bitisGun: 15
};

(function initKayitDuyurusu() {
    const banner = document.getElementById('hero-announce');
    if (!banner) return;

    const now = new Date();
    const yil = now.getFullYear();
    const bugun = new Date(yil, now.getMonth(), now.getDate());
    const basla = new Date(yil, KAYIT_SEZONU.baslangicAy - 1, KAYIT_SEZONU.baslangicGun);
    const bit = new Date(yil, KAYIT_SEZONU.bitisAy - 1, KAYIT_SEZONU.bitisGun);

    if (bugun < basla || bugun > bit) return; // sezon disi -> gizli kal

    // Sezon etiketi: Haziran'dan sonra 2026-2027, oncesinde 2025-2026 gibi
    const seasonEl = document.getElementById('announce-season');
    if (seasonEl) {
        const baslangicYili = now.getMonth() + 1 >= KAYIT_SEZONU.baslangicAy ? yil : yil - 1;
        seasonEl.textContent = `${baslangicYili}-${baslangicYili + 1}`;
    }

    banner.hidden = false;
})();
