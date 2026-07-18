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
function validateForm(formData) {
    const errors = [];
    if (!formData.prenom.trim() || formData.prenom.trim().length < 2)
        errors.push('Le prénom doit contenir au moins 2 caractères');
    if (!formData.nom.trim() || formData.nom.trim().length < 2)
        errors.push('Le nom doit contenir au moins 2 caractères');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email))
        errors.push('Format d\'email invalide');
    if (!formData.sujet)
        errors.push('Veuillez choisir un sujet');
    if (!formData.message.trim() || formData.message.trim().length < 10)
        errors.push('Le message doit contenir au moins 10 caractères');
    if (formData.message.trim().length > 500)
        errors.push('Le message ne peut pas dépasser 500 caractères');
    return errors;
}

// Soumission du formulaire
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    const formData = {
        prenom:    document.getElementById('prenom').value,
        nom:       document.getElementById('nom').value,
        email:     document.getElementById('email').value,
        telephone: document.getElementById('telephone').value || 'Non renseigné',
        sujet:     document.getElementById('sujet').value,
        message:   document.getElementById('message').value
    };

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

    // Remettre le bouton normal
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
});

// ==================== FONCTIONS UTILITAIRES ====================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage(`"${text}" copié dans le presse-papiers !`, 'success');
        // Envoi d'un événement de copie à Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'copy_contact_info', {
                'event_category': 'engagement',
                'event_label': text
            });
        }
    }).catch(() => {
        showMessage('Erreur lors de la copie', 'error');
    });
}

function openMaps() {
    window.open('https://www.google.com/maps/place/Conakry,+Guinée', '_blank');
}

function openLinkedIn() {
    // Envoi d'un événement de clic sur le lien LinkedIn
    if (typeof gtag === 'function') {
        gtag('event', 'select_content', {
            'content_type': 'social_link',
            'item_id': 'LinkedIn'
        });
    }
    window.open('https://www.linkedin.com/in/abdoulaye-kourouma-32b1761a3', '_blank');
}

// FAQ Toggle
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const isOpen = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = '0';
        item.querySelector('.faq-icon').textContent = '+';
    });

    if (!isOpen) {
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        faqItem.querySelector('.faq-icon').textContent = '−';
    }
}