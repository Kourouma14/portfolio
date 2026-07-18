// Fichier : assets/js/projets.js

function initProjetsPage() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) {
        console.warn('Éléments de filtre ou cartes de projet non trouvés.');
        return;
    }

    // --- Système de filtrage des projets ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Envoi d'un événement de filtre à Google Analytics
            if (typeof gtag === 'function') {
                gtag('event', 'view_item_list', {
                    'event_category': 'engagement',
                    'item_list_name': 'Projects',
                    'item_list_id': filter
                });
            }

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                const matchesFilter = (filter === 'all' || (categories && categories.includes(filter)));

                if (matchesFilter) {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                    // On écoute la fin de la transition pour cacher l'élément,
                    // c'est plus robuste qu'un setTimeout.
                    card.addEventListener('transitionend', () => {
                        if (card.classList.contains('hidden')) card.style.display = 'none';
                    }, { once: true }); // L'option { once: true } supprime l'écouteur après son exécution.
                }
            });
        });
    });

    // --- Animation d'apparition des cartes ---
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    projectCards.forEach(card => {
        observer.observe(card);
    });
}

window.pageInitializers = window.pageInitializers || {};
window.pageInitializers.projets = initProjetsPage;

// --- Fonctions pour les actions des projets (exposées globalement) ---
function viewProject(projectName) {
    if (typeof gtag === 'function') {
        gtag('event', 'select_content', {
            'content_type': 'project_live',
            'item_id': projectName
        });
    }
    // TODO: Remplacer l'alerte par une action réelle, ex: window.open('URL_DU_PROJET', '_blank');
    alert(`Ouverture du projet : ${projectName}\n(Fonctionnalité à implémenter)`);
}

function viewCode(projectName) {
    if (typeof gtag === 'function') {
        gtag('event', 'select_content', {
            'content_type': 'project_code',
            'item_id': projectName
        });
    }
    // TODO: Remplacer l'alerte par une action réelle, ex: window.open('URL_GITHUB', '_blank');
    alert(`Affichage du code source : ${projectName}\n(Fonctionnalité à implémenter)`);
}
