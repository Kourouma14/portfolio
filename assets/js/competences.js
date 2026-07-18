// Fichier : assets/js/competences.js

function initCompetencesPage() {
    // --- Animation des barres de progression ---
    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                let targetWidth = '0%';

                if (element.classList.contains('skill-progress') || element.classList.contains('progress-fill')) {
                    targetWidth = element.getAttribute('data-width') || element.getAttribute('data-progress') || '0';
                    targetWidth += '%';
                } else if (element.classList.contains('level-fill')) {
                    const level = parseInt(element.getAttribute('data-level'), 10) || 0;
                    targetWidth = (level / 5) * 100 + '%';
                }

                // Appliquer l'animation
                element.style.width = targetWidth;

                // Ne plus observer cet élément
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-progress, .level-fill, .progress-fill').forEach(bar => {
        // Initialiser la largeur à 0 pour l'animation
        bar.style.width = '0%';
        bar.style.transition = 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
        progressObserver.observe(bar);
    });

    // --- Animation d'apparition des cartes et éléments ---
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Appliquer un délai staggered pour un effet plus fluide
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.soft-skill-card, .learning-card, .goal-card, .timeline-item').forEach(card => {
        // La préparation (opacity: 0, transform) doit être faite en CSS
        // pour éviter un flash de contenu non stylé.
        // Assurez-vous d'avoir une classe comme .soft-skill-card { opacity: 0; ... }
        // et .soft-skill-card.visible { opacity: 1; ... }
        cardObserver.observe(card);
    });
}

window.pageInitializers = window.pageInitializers || {};
window.pageInitializers.competences = initCompetencesPage;