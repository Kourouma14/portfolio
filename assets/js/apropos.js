// Fichier : assets/js/apropos.js
// Ce fichier contient le code JavaScript spécifique à la page "À propos".

document.addEventListener('DOMContentLoaded', function() {
    // Vous pouvez ajouter d'autres initialisations spécifiques à cette page ici si besoin.
    console.log('JavaScript pour la page "À propos" chargé.');
});

/**
 * Gère le téléchargement du fichier CV.
 * Cette fonction est appelée par le bouton "Télécharger mon CV" sur la page apropos.html.
 */
function downloadCV() {
    // IMPORTANT : Remplacez 'CV_Kourouma_Abdoulaye.pdf' par le nom exact de votre fichier CV.
    // Assurez-vous également de placer votre fichier CV dans un dossier `assets/cv/`.
    const cvFileName = 'CV ABDDOULAYE KOUROUMA -Fév 2026.pdf';
    const cvPath = `assets/cv/${cvFileName}`;

    // Crée un lien temporaire pour déclencher le téléchargement
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = cvFileName; // Le nom que le fichier aura lors du téléchargement
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}