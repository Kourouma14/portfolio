// Validation et soumission du formulaire
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
    message.className = `message ${type}`;
    message.style.display = 'flex';
    message.style.alignItems = 'center';
    message.style.gap = '10px';
    message.innerHTML = `
        <span>${type === 'success' ? '✅' : '❌'}</span>
        <span>${text}</span>
    `;

    messageContainer.innerHTML = '';
    messageContainer.appendChild(message);
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    }, 5000);
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

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    const formData = {
        prenom: document.getElementById('prenom').value,
        nom: document.getElementById('nom').value,
        email: document.getElementById('email').value,
        telephone: document.getElementById('telephone').value,
        sujet: document.getElementById('sujet').value,
        message: document.getElementById('message').value,
        newsletter: document.getElementById('newsletter').checked
    };

    const errors = validateForm(formData);

    setTimeout(() => {
        if (errors.length > 0) {
            showMessage(errors.join(' — '), 'error');
        } else {
            showMessage('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
            contactForm.reset();
            charCounter.textContent = '0/500 caractères';
        }
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }, 1500);
});

// ==================== FONCTIONS UTILITAIRES ====================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage(`"${text}" copié dans le presse-papiers !`, 'success');
    }).catch(() => {
        showMessage('Erreur lors de la copie', 'error');
    });
}

function openMaps() {
    window.open('https://www.google.com/maps/place/Conakry,+Guinée', '_blank');
}

function openLinkedIn() {
    window.open('https://www.linkedin.com/in/abdoulaye-kourouma-32b1761a3', '_blank');
}

// FAQ Toggle
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const isOpen = faqItem.classList.contains('active');

    // Fermer toutes les autres
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = '0';
        item.querySelector('.faq-icon').textContent = '+';
    });

    // Ouvrir/fermer celle cliquée
    if (!isOpen) {
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        faqItem.querySelector('.faq-icon').textContent = '−';
    }
}

// Animation au scroll
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.contact-card, .social-link');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});