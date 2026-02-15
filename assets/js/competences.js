 
        // Animation des barres de compétences
        function animateSkillBars() {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 500);
            });
        }

        // Animation des niveaux de soft skills
        function animateSoftSkills() {
            const levelFills = document.querySelectorAll('.level-fill');
            levelFills.forEach(fill => {
                const level = parseInt(fill.getAttribute('data-level'));
                const percentage = (level / 5) * 100;
                setTimeout(() => {
                    fill.style.width = percentage + '%';
                }, 800);
            });
        }

        // Animation des barres de progression d'apprentissage
        function animateLearningProgress() {
            const progressFills = document.querySelectorAll('.progress-fill');
            progressFills.forEach(fill => {
                const progress = fill.getAttribute('data-progress');
                setTimeout(() => {
                    fill.style.width = progress + '%';
                }, 1000);
            });
        }

        // Observer pour déclencher les animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('skills-section')) {
                        animateSkillBars();
                    } else if (entry.target.classList.contains('soft-skills-section')) {
                        animateSoftSkills();
                    } else if (entry.target.classList.contains('learning-section')) {
                        animateLearningProgress();
                    }
                }
            });
        });

        // Observer les sections
        document.querySelectorAll('.skills-section, .soft-skills-section, .learning-section').forEach(section => {
            observer.observe(section);
        });

        // Animation d'apparition des cartes
        const animateCards = () => {
            const cards = document.querySelectorAll('.soft-skill-card, .learning-card, .goal-card, .timeline-item');
            
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
            });

            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
                cardObserver.observe(card);
            });
        };

        // Initialisation
        document.addEventListener('DOMContentLoaded', () => {
            animateCards();
        });
 