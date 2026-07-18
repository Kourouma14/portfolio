// Fichier : assets/js/apropos.js
// Ce fichier contient le code JavaScript spécifique à la page "À propos".

function initAproposPage() {
    const downloadBtn = document.getElementById('downloadCvBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCV);
    }

    /**
     * Gère le téléchargement du fichier CV.
     */
    function downloadCV() {
        const cvFileName = 'CV ABDDOULAYE KOUROUMA -Fév 2026.pdf';
        const cvPath = `assets/cv/${cvFileName}`;

        // Envoi d'un événement à Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'download', {
                'event_category': 'engagement',
                'event_label': 'CV Download'
            });
        }

        // Crée un lien temporaire pour déclencher le téléchargement
        const link = document.createElement('a');
        link.href = cvPath;
        link.download = cvFileName; // Le nom que le fichier aura lors du téléchargement
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

window.pageInitializers = window.pageInitializers || {};
window.pageInitializers.apropos = initAproposPage;