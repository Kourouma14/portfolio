
        // Système de filtrage des projets
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Retirer la classe active de tous les boutons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        const categories = card.getAttribute('data-category');
                        if (categories && categories.includes(filter)) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 100);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    }
                });
            });
        });

        // Fonctions pour les actions des projets
        function viewProject(projectName) {
            alert(`Ouverture du projet : ${projectName}\n(Dans un vrai site, cela ouvrirait le projet en ligne)`);
        }

        function viewCode(projectName) {
            alert(`Affichage du code source : ${projectName}\n(Dans un vrai site, cela redirigerait vers GitHub)`);
        }

        // Animation d'apparition des cartes
        const observeProjects = () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 150);
                    }
                });
            });

            projectCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px)';
                card.style.transition = 'all 0.6s ease';
                observer.observe(card);
            });
        };

        // Initialisation
        document.addEventListener('DOMContentLoaded', observeProjects);
