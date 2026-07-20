// Portfolio JavaScript Principal
// Fichier script.js partagé par toutes les pages

// ==================== CHARGEMENT DES COMPOSANTS ====================

const defaultComponents = {
    'nav.html': `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9Y3WR9CCY7"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-9Y3WR9CCY7');
</script>

<!-- Navigation -->
<nav class="navbar">
    <div class="nav-container">
        <div class="logo">KOUROUMA <span class="highlight">ABDOULAYE</span></div>
        <ul class="nav-menu">
            <li><a href="index.html" class="nav-link">Accueil</a></li>
            <li><a href="apropos.html" class="nav-link">À propos</a></li>
            <li><a href="projets.html" class="nav-link">Projets</a></li>
            <li><a href="competences.html" class="nav-link">Compétences</a></li>
            <li><a href="contact.html" class="nav-link">Contact</a></li>
        </ul>
        <button class="mobile-menu-btn" aria-label="Ouvrir le menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
    </div>
</nav>
`,
    'footer.html': `
<!-- Footer -->
<footer class="footer">
    <div class="footer-content">
        <div>Designed by Abdoulaye with HTML CSS JS</div>
        <div>Tous droits réservés - 2026</div>
    </div>
</footer>
`
};

/**
 * Charge les composants HTML réutilisables (comme la nav et le footer) dans la page.
 * @param {string} component - Le nom du fichier du composant (ex: 'nav.html').
 * @param {string} targetId - L'ID de l'élément où injecter le composant.
 */
async function loadComponent(component, targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
        return;
    }

    try {
        const response = await fetch(component);
        if (!response.ok) {
            throw new Error(`Composant ${component} non trouvé.`);
        }
        const text = await response.text();
        targetElement.innerHTML = text;
    } catch (error) {
        console.warn(`Impossible de charger ${component}, utilisation du fallback local.`, error);
        if (defaultComponents[component] !== undefined) {
            targetElement.innerHTML = defaultComponents[component];
        } else {
            targetElement.innerHTML = '';
        }
    }

    executeEmbeddedScripts(targetElement);
}

/**
 * Exécute les scripts contenus dans un composant chargé dynamiquement.
 * Les scripts inline sont recréés pour garantir leur exécution,
 * et les scripts externes sont relancés correctement.
 */
function executeEmbeddedScripts(container) {
    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach(oldScript => {
        const script = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
            script.setAttribute(attr.name, attr.value);
        });

        if (oldScript.textContent) {
            script.textContent = oldScript.textContent;
        }

        oldScript.parentNode.replaceChild(script, oldScript);
    });
}

/**
 * Initialise le chargement de tous les composants et exécute les autres scripts.
 */
async function initializePage() {
    // On attend que les composants soient chargés
    await Promise.all([
        loadComponent('nav.html', 'navbar-placeholder'),
        loadComponent('footer.html', 'footer-placeholder')
    ]);

    // Une fois que les composants sont bien en place dans le DOM,
    // on peut initialiser les scripts qui dépendent d'eux (comme la navigation).
    initPortfolio();
}

// ==================== NAVIGATION ====================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    // Récupère le nom de la page depuis l'attribut data-page du body
    const currentPage = document.body.dataset.page;

    navLinks.forEach(link => {
        // Le href du lien (ex: "projets.html")
        const linkPage = link.getAttribute('href').replace('.html', '');
        if (linkPage === currentPage || (currentPage === 'home' && linkPage === 'index')) {
            link.classList.add('active');
        }
    });

    // Navigation mobile 
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
            if (navMenu && navMenu.classList.contains('active')) {
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
    backToTopBtn.setAttribute('aria-label', 'Retour en haut de la page');
    backToTopBtn.className = 'back-to-top';

    document.body.appendChild(backToTopBtn);

    // Action du bouton
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== ANIMATIONS ====================

function initAnimations() {
    // Observer d'intersection pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Appliquer le délai de transition s'il est défini
                const delay = el.dataset.delay || '0';
                el.style.transitionDelay = `${delay}ms`;

                el.classList.add('visible');
                obs.unobserve(el); // Ne plus observer une fois l'animation lancée
            }
        });
    }, observerOptions);

    // Observer les éléments animables
    document.querySelectorAll([
        '.animatable' // On cible une classe générique
    ].join(', ')).forEach(el => {
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

    // Effet de défilement sur la navbar (optimisé)
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // On utilise une classe CSS plutôt que de manipuler les styles directement
        navbar.classList.toggle('scrolled', scrollY > 50);
    }
    
    // Afficher/masquer le bouton "Retour en haut" (optimisé)
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', scrollY > 300);
    }

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

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

// ==================== HOME PAGE SPECIFIC ====================

function initHomePage() {
    // --- Effet de machine à écrire ---
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

    // --- Animation de compteur ---
    function animateCounter(element, start, end, duration = 2000) {
        if (!element) return;

        const startTime = performance.now();
        const difference = end - start;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Utilise une fonction d'accélération pour un effet plus doux
            const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

            const current = Math.round(start + difference * easeProgress);
            // Ajoute le '+' si l'élément original en avait un
            element.textContent = current + (element.dataset.plus === 'true' ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        requestAnimationFrame(updateCounter);
    }

    // Lancer les animations spécifiques à la page d'accueil
    document.querySelectorAll('.stat-number').forEach(counter => {
        const originalText = counter.textContent;
        if (originalText.includes('+')) {
            counter.dataset.plus = 'true';
        }
        const endValue = parseInt(originalText.replace('+', ''), 10);
        if (!isNaN(endValue)) {
            // On part de 0 pour l'animation
            counter.textContent = '0';
            animateCounter(counter, 0, endValue, 2500);
        }
    });
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

    // Exécuter les initialiseurs spécifiques à la page
    const pageName = document.body.dataset.page;
    if (pageName && window.pageInitializers && typeof window.pageInitializers[pageName] === 'function') {
        window.pageInitializers[pageName]();
    }
}

// Enregistrer l'initialiseur pour la page d'accueil
window.pageInitializers = window.pageInitializers || {};
window.pageInitializers.home = initHomePage;

// Réinitialiser si le DOM est déjà chargé
document.addEventListener('DOMContentLoaded', initializePage);

// ==================== GESTION DES RESIZE ====================

const debouncedResize = debounce(() => {
    // Recalculer les dimensions si nécessaire
    console.log('Fenêtre redimensionnée');
}, 250);

window.addEventListener('resize', debouncedResize);