// Portfolio JavaScript Principal
// Fichier script.js partagé par toutes les pages

// ==================== NAVIGATION ====================

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Effet de défilement sur la navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(44, 44, 44, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#2c2c2c';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Navigation mobile (si implémentée)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Fermer le menu mobile en cliquant sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
}

// ==================== EFFETS DE DÉFILEMENT ====================

function initScrollEffects() {
    // Smooth scroll pour les liens internes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Bouton retour en haut
    createBackToTopButton();
}

function createBackToTopButton() {
    // Créer le bouton
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(backToTopBtn);

    // Afficher/masquer selon le scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    // Action du bouton
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Effet hover
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.background = '#17a085';
        backToTopBtn.style.transform = 'translateY(-3px)';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.background = 'var(--primary-color)';
        backToTopBtn.style.transform = 'translateY(0)';
    });
}

// ==================== ANIMATIONS ====================

function initAnimations() {
    // Observer d'intersection pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animation spéciale pour les éléments avec data-delay
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, observerOptions);

    // Observer les éléments animables
    document.querySelectorAll([
        '.hero-text',
        '.hero-image',
        '.intro-card',
        '.project-card',
        '.skill-item',
        '.about-text',
        '.contact-card'
    ].join(', ')).forEach(el => {
        // Préparer l'animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
}

// ==================== UTILITAIRES ====================

// Fonction de debounce pour optimiser les performances
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fonction de throttle
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Détection de l'appareil
const isMobile = () => {
    return window.innerWidth <= 768;
};

const isTablet = () => {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
};

// ==================== EFFETS VISUELS ====================

// Effet de particules (optionnel)
function createParticleEffect(container) {
    if (!container) return;
    
    const particles = [];
    const particleCount = isMobile() ? 20 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.6;
        `;
        
        container.appendChild(particle);
        particles.push({
            element: particle,
            x: Math.random() * container.offsetWidth,
            y: Math.random() * container.offsetHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }
    
    function animateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > container.offsetWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > container.offsetHeight) particle.vy *= -1;
            
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// ==================== GESTION DES ERREURS ====================

window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    // Ici on pourrait envoyer l'erreur à un service de monitoring
});

// ==================== PERFORMANCE ====================

// Optimisation du scroll
let ticking = false;

function updateScrollEffects() {
    // Mise à jour des effets de scroll
    const scrollY = window.scrollY;
    
    // Parallax simple pour certains éléments
    document.querySelectorAll('.parallax').forEach(el => {
        const speed = el.dataset.speed || 0.5;
        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// ==================== INTERACTIONS SPÉCIFIQUES ====================

// Effet de typing pour les textes
function typeWriter(element, text, speed = 50) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Animation de compteur
function animateCounter(element, start, end, duration = 2000) {
    if (!element) return;
    
    const startTime = performance.now();
    const difference = end - start;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.round(start + difference * easeProgress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ==================== VALIDATION DE FORMULAIRES ====================

// Validation d'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation de téléphone
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

// Nettoyage des entrées utilisateur
function sanitizeInput(input) {
    return input
        .trim()
        .replace(/[<>]/g, '') // Supprime les balises potentielles
        .substring(0, 1000); // Limite la longueur
}

// ==================== STOCKAGE LOCAL ====================

// Sauvegarder des préférences utilisateur
function saveUserPreference(key, value) {
    try {
        localStorage.setItem(`portfolio_${key}`, JSON.stringify(value));
    } catch (e) {
        console.warn('Impossible de sauvegarder dans localStorage:', e);
    }
}

// Récupérer des préférences utilisateur
function getUserPreference(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(`portfolio_${key}`);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
        console.warn('Impossible de lire localStorage:', e);
        return defaultValue;
    }
}

// ==================== THEME MANAGEMENT ====================

// Gestion du thème sombre/clair (optionnel)
function initThemeToggle() {
    const savedTheme = getUserPreference('theme', 'light');
    document.body.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            saveUserPreference('theme', newTheme);
        });
    }
}

// ==================== ACCESSIBILITY ====================

// Amélioration de l'accessibilité
function enhanceAccessibility() {
    // Gestion du focus clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Annonce des changements pour les lecteurs d'écran
    const announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
    
    // Exposer la fonction globalement
    window.announceToScreenReader = announceToScreenReader;
}

// ==================== LAZY LOADING ====================

// Chargement paresseux des images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ==================== INITIALISATION FINALE ====================

// Initialisation complète une fois le DOM chargé
function initPortfolio() {
    // Fonctionnalités de base
    initNavigation();
    initScrollEffects();
    initAnimations();
    
    // Fonctionnalités avancées
    enhanceAccessibility();
    initLazyLoading();
    
    // Thème (si activé)
    // initThemeToggle();
    
    // Analytics simples (visites de page)
    const pageViews = getUserPreference('pageViews', 0);
    saveUserPreference('pageViews', pageViews + 1);
    
    console.log(`Portfolio chargé - Visite #${pageViews + 1}`);
}

// Réinitialiser si le DOM est déjà chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

// ==================== GESTION DES RESIZE ====================

const debouncedResize = debounce(() => {
    // Recalculer les dimensions si nécessaire
    console.log('Fenêtre redimensionnée');
}, 250);

window.addEventListener('resize', debouncedResize);

// ==================== EXPORT DES FONCTIONS UTILITAIRES ====================

// Exposer certaines fonctions globalement pour les pages spécifiques
window.portfolioUtils = {
    typeWriter,
    animateCounter,
    isValidEmail,
    isValidPhone,
    sanitizeInput,
    debounce,
    throttle,
    isMobile,
    isTablet,
    saveUserPreference,
    getUserPreference
};