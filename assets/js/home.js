// Fichier : assets/js/home.js

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
            const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            
            const current = Math.round(start + difference * easeProgress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        requestAnimationFrame(updateCounter);
    }

    // Lancer les animations spécifiques à la page d'accueil
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        // Vous pouvez utiliser l'effet de machine à écrire ici si vous le souhaitez
    }

    document.querySelectorAll('.stat-number').forEach(counter => {
        const endValue = parseInt(counter.textContent.replace('+', ''), 10);
        if (!isNaN(endValue)) {
            animateCounter(counter, 0, endValue, 2500);
        }
    });
}

window.pageInitializers = window.pageInitializers || {};
window.pageInitializers.home = initHomePage;