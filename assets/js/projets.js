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

                card.classList.toggle('hidden', !matchesFilter);
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

    // --- Logique des boutons d'action des projets ---    
    function handleProjectAction(button, actionType) {
        const { url, project } = button.dataset;
        const eventType = actionType === 'view' ? 'project_live' : 'project_code';
        const defaultMessage = actionType === 'view' 
            ? `Ouverture du projet : ${project}\n(Fonctionnalité à implémenter)`
            : `Affichage du code source : ${project}\n(Fonctionnalité à implémenter)`;

        if (url) {
            window.open(url, '_blank');
        } else {
            alert(defaultMessage);
        }

        if (typeof gtag === 'function') {
            gtag('event', 'select_content', {
                'content_type': eventType,
                'item_id': project
            });
        }
    }

    // Attacher les écouteurs d'événements aux boutons
    document.querySelectorAll('.view-site-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleProjectAction(e.currentTarget, 'view');
        });
    });

    document.querySelectorAll('.view-code-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleProjectAction(e.currentTarget, 'code');
        });
    });
}

window.pageInitializers = window.pageInitializers || {};
window.pageInitializers.projets = initProjetsPage;
