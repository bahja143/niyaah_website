// Global Variables
const whatsappNumber = '+252610142228';
let botJustOpened = false; // suppress immediate outside-close after open
let currentSlide = 0;
let isMenuOpen = false;
let isLoading = true;
let currentAppScreen = 0;
const appScreens = ['home-screen', 'booking-screen', 'chat-screen'];

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const whatsappWidget = document.getElementById('whatsapp-widget');
const whatsappFloat = document.querySelector('.whatsapp-float');
const loadingScreen = document.getElementById('loading-screen');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLoading();
    initializeNavigation();
    initializeTestimonials();
    initializeWhatsApp();
    initializeScrollEffects();
    initializeAnimations();
    initializeCounters();
    initializeParallax();
    initializeAppScreens();
    initializeFormHandling();
    initializeContactCards();
    initializeBotOpeners();
});

// Loading Screen Functions
function initializeLoading() {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            isLoading = false;
            
            setTimeout(() => {
                startHeroAnimations();
            }, 500);
        }
    }, 3000);
}

function startHeroAnimations() {
    const animatedElements = document.querySelectorAll('.title-line, .hero-description, .hero-actions, .hero-stats');
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Enhanced Navigation Functions
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    if (navMenu && hamburger) {
        navMenu.classList.toggle('active', isMenuOpen);
        hamburger.classList.toggle('active', isMenuOpen);
    }
}

function closeMobileMenu() {
    isMenuOpen = false;
    if (navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

function updateActiveLink(link) {
    document.querySelectorAll('.nav-link').forEach(navLink => {
        navLink.classList.remove('active');
    });
    link.classList.add('active');
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentId = null;
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 90;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
            currentId = section.id;
        }
    });

    navLinks.forEach((link) => link.classList.remove('active'));
    if (currentId) {
        const match = document.querySelector(`.nav-link[href="#${currentId}"]`) ||
                      document.querySelector(`.nav-link[data-section="#${currentId}"]`);
        if (match) match.classList.add('active');
    }
}

function initializeNavigation() {
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            closeMobileMenu();
            updateActiveLink(link);
            
            e.preventDefault();
            let href = link.getAttribute('href');
            let target = document.querySelector(href);
            // For Contact link, scroll directly to the form so it's visible
            if (href === '#contact') {
                target = document.querySelector('#contact-form') || document.querySelector('#contact .contact-form-container') || target;
            }
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (href && href.startsWith('#')) {
                // Fallback to native hash behavior if element not found
                window.location.hash = href;
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // Open in-site bot when targeting #bot or marked as open-bot
            if (href === '#bot' || this.classList.contains('open-bot') || this.dataset.openBot === 'true') {
                openBot(e);
                return;
            }
            let target = document.querySelector(href);
            if (href === '#contact') {
                target = document.querySelector('#contact-form') || document.querySelector('#contact .contact-form-container') || target;
            }
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                createRippleEffect(this, e);
            } else if (href && href.startsWith('#')) {
                window.location.hash = href;
            }
        });
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavigation();
                updateNavbarBackground();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(34, 197, 94, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }, 16);
}

// Parallax Effects
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.shape');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

function changeTestimonial(n) {
    currentSlide += n;
    const testimonials = document.querySelectorAll('.testimonial');
    if (currentSlide >= testimonials.length) {
        currentSlide = 0;
    }
    if (currentSlide < 0) {
        currentSlide = testimonials.length - 1;
    }
    showTestimonial(currentSlide);
}

// Enhanced Testimonials with touch support
function initializeTestimonials() {
    showTestimonial(0);

    let autoRotate = setInterval(() => {
        changeTestimonial(1);
    }, 6000);

    const testimonialContainer = document.querySelector('.testimonials-container');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });

        testimonialContainer.addEventListener('mouseleave', () => {
            autoRotate = setInterval(() => {
                changeTestimonial(1);
            }, 6000);
        });

        let startX = 0;
        let endX = 0;

        testimonialContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        testimonialContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    changeTestimonial(1);
                } else {
                    changeTestimonial(-1);
                }
            }
        }
    }
}

function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');

    testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
        if (i === index) {
            testimonial.style.animation = 'fadeInUp 0.6s ease-out';
        }
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    currentSlide = index;

    const stars = document.querySelectorAll('.testimonial.active .rating i');
    stars.forEach((star, i) => {
        star.style.setProperty('--i', i);
        star.style.animation = `starTwinkle 2s ease-in-out infinite ${i * 0.2}s`;
    });
}

// Enhanced WhatsApp Functions
function initializeWhatsApp() {
    // Do not auto-open on page load. Only open via user click.

    // Close the widget when clicking outside of it (but not when clicking the floating button)
    document.addEventListener('click', (e) => {
        if (botJustOpened) return; // ignore the first click that opened the bot
        const opener = e.target && e.target.closest('.open-bot,[data-open-bot="true"],a[href="#bot"]');
        if (opener) return;
        if (
            whatsappWidget &&
            whatsappWidget.classList.contains('show') &&
            !whatsappWidget.contains(e.target) &&
            whatsappFloat && !whatsappFloat.contains(e.target)
        ) {
            closeWhatsApp();
        }
    });
}

function showWhatsAppWidget() {
    if (whatsappWidget) {
        whatsappWidget.classList.add('show');
        whatsappWidget.style.animation = 'slideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        whatsappWidget.style.pointerEvents = 'auto';
        // Suppress outside-close for a short moment to avoid immediate hide
        botJustOpened = true;
        setTimeout(() => { botJustOpened = false; }, 250);
    }
}

function closeWhatsApp() {
    if (whatsappWidget) {
        whatsappWidget.style.animation = 'slideDown 0.3s ease-in';
        setTimeout(() => {
            whatsappWidget.classList.remove('show');
            // Ensure the hidden widget doesn't block clicks on the float button
            whatsappWidget.style.pointerEvents = 'none';
        }, 300);
    }
}

// Add slide animations
const slideDownStyle = document.createElement('style');
slideDownStyle.textContent = `
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(slideDownStyle);

// Enhanced Scroll Effects with Intersection Observer
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
                
                const siblings = entry.target.parentElement.children;
                Array.from(siblings).forEach((sibling, index) => {
                    if (sibling.classList.contains('hover-lift')) {
                        setTimeout(() => {
                            sibling.style.opacity = '1';
                            sibling.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(`
        .about-card,
        .service-card,
        .feature-detailed,
        .contact-item,
        .achievement-card
    `);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Enhanced button interactions
function initializeAnimations() {
    const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary, .cta-primary, .cta-secondary');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
    });

    if (whatsappFloat) {
        whatsappFloat.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
        });
        
        whatsappFloat.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    }
}

// Utility Functions
function scrollToSection(target) {
    // If target is contact, aim at the form container for better visibility
    if (target === '#contact' || target === '#contact-form') {
        const contactForm = document.querySelector('#contact-form') || document.querySelector('#contact .contact-form-container');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            contactForm.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.25)';
            setTimeout(() => contactForm.style.boxShadow = '', 2000);
            return;
        }
    }
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        element.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
        setTimeout(() => { element.style.boxShadow = ''; }, 2000);
    }
}

// Enhanced form handling
function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmission);
    });
}

function handleFormSubmission(event) {
    event.preventDefault();

    const form = event.target;
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    submitBtn.style.background = '#9E9E9E';

    const useFormSubmit = form.getAttribute('data-provider') === 'formsubmit' || (form.action && form.action.includes('formsubmit.co'));

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        submitBtn.style.background = `linear-gradient(90deg, #22C55E ${progress}%, #9E9E9E ${progress}%)`;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            if (useFormSubmit) {
                // Let FormSubmit.co handle the email delivery and success page
                form.submit();
            } else {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent Successfully!';
                submitBtn.style.background = '#22C55E';
                
                showNotification('Thank you! We\'ll get back to you within 24 hours.', 'success');
                form.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }
        }
    }, 200);
}

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
    if (isLoading) return;

    if (e.key === 'Escape') {
        if (isMenuOpen) {
            closeMobileMenu();
        }
        if (whatsappWidget && whatsappWidget.classList.contains('show')) {
            closeWhatsApp();
        }
    }

    if (document.activeElement && document.activeElement.closest('.testimonials-container')) {
        if (e.key === 'ArrowLeft') {
            changeTestimonial(-1);
        } else if (e.key === 'ArrowRight') {
            changeTestimonial(1);
        }
    }

    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                scrollToSection('#home');
                break;
            case '2':
                e.preventDefault();
                scrollToSection('#about');
                break;
            case '3':
                e.preventDefault();
                scrollToSection('#services');
                break;
            case '4':
                e.preventDefault();
                scrollToSection('#contact');
                break;
        }
    }
});

// Performance optimizations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const optimizedScrollHandler = debounce(() => {
    updateActiveNavigation();
    updateNavbarBackground();
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);

    const errorToast = document.createElement('div');
    errorToast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 16px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    errorToast.textContent = 'Something went wrong. Please refresh the page.';

    document.body.appendChild(errorToast);

    setTimeout(() => {
        errorToast.remove();
    }, 5000);
});

// Console branding
console.log('%c🌟 Nafis Counselling Website', 'color: #22C55E; font-size: 24px; font-weight: bold;');
console.log('%c💚 Your mental health matters - Naftaada waa mudan tahay daryeel', 'color: #22C55E; font-size: 16px;');
console.log('%c🚀 Built with love and modern web technologies', 'color: #666; font-size: 14px;');

// App screen cycling
function initializeAppScreens() {
    setInterval(() => {
        cycleAppScreens();
    }, 4000);
}

function cycleAppScreens() {
    const screens = document.querySelectorAll('.app-screen');
    if (screens.length > 0) {
        screens[currentAppScreen].classList.remove('active');
        currentAppScreen = (currentAppScreen + 1) % screens.length;
        screens[currentAppScreen].classList.add('active');
    }
}

// Utility functions for external calls
function openWhatsApp() {
    const message = encodeURIComponent("Hello! I'm interested in your mental health services. Can you help me?");
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
}

function toggleWhatsApp() {
    if (whatsappWidget) {
        if (whatsappWidget.classList.contains('show')) {
            closeWhatsApp();
        } else {
            showWhatsAppWidget();
        }
    }
}

function sendMessage(type) {
    let message = '';
    switch(type) {
        case 'book':
            message = "I'd like to book an appointment for therapy sessions.";
            break;
        case 'info':
            message = "Can you provide more information about your services?";
            break;
        default:
            message = "Hello! I'm interested in your mental health services.";
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`, '_blank');
}

// Make entire contact-item clickable (email/phone)
function initializeContactCards() {
    const items = document.querySelectorAll('.contact-item');
    items.forEach((item) => {
        const link = item.querySelector('.contact-details a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        item.setAttribute('role', 'link');
        item.setAttribute('tabindex', '0');
        item.classList.add('is-clickable');

        const navigate = () => {
            if (!href) return;
            try {
                // Bot opener
                if (link.classList.contains('open-bot') || link.dataset.openBot === 'true' || href === '#bot') {
                    openBot();
                } else if (href.startsWith('mailto:')) {
                    const address = href.replace('mailto:', '');
                    if (typeof openGmail === 'function') {
                        openGmail(null, address);
                    } else {
                        window.location.href = href;
                    }
                } else if (href.startsWith('tel:')) {
                    window.location.href = href;
                } else {
                    window.open(href, '_blank');
                }
            } catch (e) {
                // Fallback: trigger the anchor click
                link.click();
            }
        };

        item.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // native anchor click
            e.preventDefault();
            navigate();
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate();
            }
        });
    });
}

// Open the in-site WhatsApp widget
function openBot(event) {
    if (event) event.preventDefault();
    if (typeof showWhatsAppWidget === 'function') {
        showWhatsAppWidget();
    }
    return false;
}

function initializeBotOpeners() {
    document.querySelectorAll('.open-bot,[data-open-bot="true"]').forEach((el) => {
        el.addEventListener('click', openBot);
    });
}

// Try to open Gmail compose (web) with graceful fallback to mailto
function openGmail(event, to, subject = '', body = '') {
    if (event) event.preventDefault();
    const params = [];
    if (subject) params.push(`su=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    const query = ['view=cm', 'fs=1', `to=${encodeURIComponent(to)}`].concat(params).join('&');
    const gmailUrl = `https://mail.google.com/mail/?${query}`;
    try {
        window.open(gmailUrl, '_blank');
    } catch (e) {
        window.location.href = `mailto:${to}`;
    }
    return false;
}

function currentTestimonial(n) {
    showTestimonial(n - 1);
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#EF4444';
            isValid = false;
        } else {
            field.style.borderColor = '#22C55E';
        }
    });

    return isValid;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22C55E' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(notificationStyle);
