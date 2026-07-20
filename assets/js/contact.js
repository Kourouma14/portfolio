// ==================== EMAILJS INIT ====================
emailjs.init('rq8JLJjtRonZEX5zG');

// ==================== FORMULAIRE ====================
const contactForm = document.getElementById('contactForm');
const messageContainer = document.getElementById('messageContainer');
const charCounter = document.getElementById('charCounter');
const messageTextarea = document.getElementById('message');

// Compteur de caractères
messageTextarea.addEventListener('input', function() {
    const length = this.value.length;
    const maxLength = 500;
    charCounter.textContent = `${length}/${maxLength} caractères`;
    charCounter.style.color = length > maxLength * 0.9 ? '#e74c3c' : '#666';
});

// Affichage des messages
function showMessage(text, type) {
    const message = document.createElement('div');
    // On ajoute une classe de base et une classe pour le type (success/error)
    message.className = `form-message ${type}`;
    message.innerHTML = `
        <span>${type === 'success' ? '✅' : '❌'}</span>
        <span>${text}</span>
    `;

    // Vider le conteneur et ajouter le nouveau message
    messageContainer.innerHTML = '';
    messageContainer.appendChild(message);
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Lancer l'animation de disparition après un délai
    setTimeout(() => {
        message.classList.add('fade-out');
        message.addEventListener('transitionend', () => message.remove());
    }, 6000);
}

// Validation du formulaire
const validationRules = [
    { field: 'prenom',  test: value => value.trim().length >= 2, message: 'Le prénom doit contenir au moins 2 caractères' },
    { field: 'nom',     test: value => value.trim().length >= 2, message: 'Le nom doit contenir au moins 2 caractères' },
    { field: 'email',   test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Format d\'email invalide' },
    { field: 'sujet',   test: value => !!value, message: 'Veuillez choisir un sujet' },
    { field: 'message', test: value => value.trim().length >= 10, message: 'Le message doit contenir au moins 10 caractères' },
    { field: 'message', test: value => value.trim().length <= 500, message: 'Le message ne peut pas dépasser 500 caractères' }
];

function validateForm(formData) {
    const errors = [];

    validationRules.forEach(rule => {
        const value = formData[rule.field];
        if (!rule.test(value)) {
            errors.push(rule.message);
        }
    });

    return errors;
}

// Soumission du formulaire
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Utiliser l'API FormData pour une récupération simple et maintenable
    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());
    formData.telephone = formData.telephone || 'Non renseigné';

    // Validation
    const errors = validateForm(formData);
    if (errors.length > 0) {
        showMessage(errors.join(' — '), 'error');
        // Envoi d'un événement d'erreur de validation à Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'form_error', {
                'event_category': 'contact',
                'event_label': errors.join(' | ')
            });
        }
        return;
    }

    // Animation de chargement
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
        await emailjs.send('service_bz2jh0g', 'template_by6cvnb', {
            prenom:    formData.prenom,
            nom:       formData.nom,
            email:     formData.email,
            telephone: formData.telephone,
            sujet:     formData.sujet,
            message:   formData.message
        });

        // Envoi d'un événement de succès à Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', { // Événement standard pour la génération de prospects
                'event_category': 'contact',
                'event_label': 'Form Success'
            });
        }

        showMessage('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
        contactForm.reset();
        charCounter.textContent = '0/500 caractères';

    } catch (error) {
        console.error('EmailJS error complet:', error);
        // Envoi d'une exception à Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'exception', {
                'description': `EmailJS Send Error: ${error.status}`,
                'fatal': false
            });
        }
        console.error('Status:', error.status);
        console.error('Text:', error.text);
        showMessage('Erreur lors de l\'envoi. Veuillez réessayer ou me contacter directement par email.', 'error');
    }
    finally {
        // Ce bloc s'exécute toujours, que l'envoi ait réussi ou échoué.
        // On s'assure ainsi que le bouton n'est jamais bloqué.
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
});

// ==================== INITIALISATION DE LA PAGE CONTACT ====================
function initContactPage() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // --- Logique de l'accordéon FAQ ---
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const isOpen = faqItem.classList.contains('active');
            
            // Close all other items for an accordion effect
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
                item.querySelector('.faq-icon').textContent = '+';
            });
            
            // Open the clicked item if it was closed
            if (!isOpen) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.querySelector('.faq-icon').textContent = '−';
            }
        });
    });

    // --- Logique des boutons d'action ---
    function copyToClipboard(text, label) {
        navigator.clipboard.writeText(text).then(() => {
            showMessage(`${label} a été copié dans le presse-papiers !`, 'success');
            if (typeof gtag === 'function') {
                gtag('event', 'copy_contact_info', {
                    'event_category': 'engagement',
                    'event_label': label
                });
            }
        }).catch(() => showMessage('Erreur lors de la copie', 'error'));
    }

    function openLinkedIn() {
        if (typeof gtag === 'function') {
            gtag('event', 'select_content', {
                'content_type': 'social_link',
                'item_id': 'LinkedIn'
            });
        }
        window.open('https://www.linkedin.com/in/abdoulaye-kourouma-32b1761a3', '_blank');
    }

    // Attacher les écouteurs d'événements
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) copyEmailBtn.addEventListener('click', () => copyToClipboard('abdulkourouma25@gmail.com', 'L\'adresse email'));

    const copyPhoneBtn = document.getElementById('copyPhoneBtn');
    if (copyPhoneBtn) copyPhoneBtn.addEventListener('click', () => copyToClipboard('+224 628 71 83 71', 'Le numéro de téléphone'));

    const openMapsBtn = document.getElementById('openMapsBtn');
    if (openMapsBtn) openMapsBtn.addEventListener('click', () => window.open('https://www.google.com/maps/place/Conakry,+Guinée', '_blank'));

    const openLinkedInBtn = document.getElementById('openLinkedInBtn');
    if (openLinkedInBtn) openLinkedInBtn.addEventListener('click', openLinkedIn);
}

window.pageInitializers = window.pageInitializers || {};
window.pageInitializers.contact = initContactPage;