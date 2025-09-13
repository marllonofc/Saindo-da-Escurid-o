// Electric Sparks Effect
class ElectricSparks {
    constructor() {
        this.container = document.getElementById('electric-sparks');
        this.sparkCount = 0;
        this.init();
    }

    init() {
        this.createSpark();
        this.scheduleNextSpark();
    }

    createSpark() {
        const spark = document.createElement('div');
        spark.className = 'electric-spark';
        spark.id = `spark-${this.sparkCount++}`;
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        
        this.container.appendChild(spark);
        
        // Remove spark after animation completes (1 second)
        setTimeout(() => {
            if (spark.parentNode) {
                spark.parentNode.removeChild(spark);
            }
        }, 1000);
    }

    scheduleNextSpark() {
        // Random interval between 2-6 seconds (2000-6000ms)
        const interval = Math.random() * 4000 + 2000;
        
        setTimeout(() => {
            this.createSpark();
            this.scheduleNextSpark();
        }, interval);
    }
}

// Checkout Modal Management
class CheckoutModal {
    constructor() {
        this.modal = document.getElementById('checkout-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.formStep = document.getElementById('form-step');
        this.paymentStep = document.getElementById('payment-step');
        this.successStep = document.getElementById('success-step');
        this.checkoutForm = document.getElementById('checkout-form');
        this.currentStep = 'form';
        this.customerData = {};
        
        this.init();
    }

    init() {
        // Form submission handler
        this.checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Close modal on backdrop click
        this.modal.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.modal.classList.add('show');
        this.showStep('form');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('show');
        this.resetModal();
        document.body.style.overflow = '';
    }

    resetModal() {
        this.currentStep = 'form';
        this.customerData = {};
        this.checkoutForm.reset();
        this.showStep('form');
        
        // Reset copy button state
        const copyIcon = document.getElementById('copy-icon');
        const checkIcon = document.getElementById('check-icon');
        if (copyIcon && checkIcon) {
            copyIcon.style.display = 'block';
            checkIcon.style.display = 'none';
        }
    }

    showStep(stepName) {
        // Hide all steps
        this.formStep.style.display = 'none';
        this.paymentStep.style.display = 'none';
        this.successStep.style.display = 'none';

        // Show current step
        switch(stepName) {
            case 'form':
                this.formStep.style.display = 'block';
                this.modalTitle.textContent = 'Finalizar Compra';
                break;
            case 'payment':
                this.paymentStep.style.display = 'block';
                this.modalTitle.textContent = 'Pagamento PIX';
                break;
            case 'success':
                this.successStep.style.display = 'block';
                this.modalTitle.textContent = 'Compra Confirmada!';
                break;
        }

        this.currentStep = stepName;
    }

    handleFormSubmit() {
        const formData = new FormData(this.checkoutForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();

        // Simple validation
        if (!name || !email) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!this.isValidEmail(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Store customer data
        this.customerData = { name, email };
        
        // Move to payment step
        this.showStep('payment');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    confirmPayment() {
        // Simulate payment confirmation
        this.showStep('success');
        
        // Log customer data (in real app, this would be sent to server)
        console.log('Customer Data:', this.customerData);
        console.log('Payment confirmed for R$ 10,00');
    }
}

// PIX Key Copy Functionality
function copyPixKey() {
    const pixKey = 'pix@seudominio.com';
    const copyIcon = document.getElementById('copy-icon');
    const checkIcon = document.getElementById('check-icon');
    
    // Try to copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pixKey).then(() => {
            showCopySuccess();
        }).catch((err) => {
            console.error('Failed to copy PIX key:', err);
            fallbackCopyTextToClipboard(pixKey);
        });
    } else {
        fallbackCopyTextToClipboard(pixKey);
    }

    function showCopySuccess() {
        copyIcon.style.display = 'none';
        checkIcon.style.display = 'block';
        
        setTimeout(() => {
            copyIcon.style.display = 'block';
            checkIcon.style.display = 'none';
        }, 2000);
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopySuccess();
            } else {
                alert('Falha ao copiar. Copie manualmente: ' + text);
            }
        } catch (err) {
            console.error('Fallback: Could not copy text: ', err);
            alert('Falha ao copiar. Copie manualmente: ' + text);
        }

        document.body.removeChild(textArea);
    }
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    // Add smooth scrolling to all links with hash
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Enhancement
function enhanceFormFields() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
    
    inputs.forEach(input => {
        // Add real-time validation feedback
        input.addEventListener('input', function() {
            this.classList.remove('error');
            
            if (this.type === 'email' && this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            }
        });

        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            if (!this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    const sections = document.querySelectorAll('.benefits-section, .content-section, .testimonials-section, .offer-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        observer.observe(section);
    });
}

// Performance Optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Preload critical resources
    const criticalResources = [
        'assets/images/Ebook_cover_mockup_78f1b6c3.png'
    ];

    criticalResources.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
    });
}

// Analytics and Tracking (placeholder for real implementation)
function initAnalytics() {
    // Track CTA clicks
    const ctaButtons = document.querySelectorAll('[data-testid^="button-"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-testid');
            console.log('Button clicked:', action);
            
            // In real implementation, send to analytics service
            // gtag('event', 'click', { 'event_category': 'CTA', 'event_label': action });
        });
    });

    // Track scroll depth
    let maxScroll = 0;
    const trackScrollDepth = () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track milestones
            if (maxScroll >= 25 && maxScroll < 50) {
                console.log('Scroll depth: 25%');
            } else if (maxScroll >= 50 && maxScroll < 75) {
                console.log('Scroll depth: 50%');
            } else if (maxScroll >= 75 && maxScroll < 100) {
                console.log('Scroll depth: 75%');
            } else if (maxScroll >= 100) {
                console.log('Scroll depth: 100%');
            }
        }
    };

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollDepth, 100);
    });
}

// Global Functions (for inline event handlers)
let checkoutModal;

function openCheckoutModal() {
    if (checkoutModal) {
        checkoutModal.openModal();
    }
}

function closeCheckoutModal() {
    if (checkoutModal) {
        checkoutModal.closeModal();
    }
}

function confirmPayment() {
    if (checkoutModal) {
        checkoutModal.confirmPayment();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Landing page initialized');
    
    // Initialize components
    const electricSparks = new ElectricSparks();
    checkoutModal = new CheckoutModal();
    
    // Expose global functions for HTML onclick handlers
    window.openCheckoutModal = openCheckoutModal;
    window.closeCheckoutModal = closeCheckoutModal;
    window.confirmPayment = confirmPayment;
    window.copyPixKey = copyPixKey;
    
    // Initialize features
    initSmoothScroll();
    enhanceFormFields();
    initScrollAnimations();
    optimizePerformance();
    initAnalytics();
    
    // Add error handling for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Failed to load image:', this.src);
            this.style.display = 'none';
        });
    });
    
    // Add loading states
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                this.disabled = true;
                setTimeout(() => {
                    this.disabled = false;
                }, 1000);
            }
        });
    });
    
    console.log('All components initialized successfully');
});

// Handle window resize for sparks positioning
window.addEventListener('resize', () => {
    // Sparks will automatically adjust as they use window dimensions
    console.log('Window resized, sparks will adjust automatically');
});

// Handle visibility change (pause/resume sparks when tab is hidden)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden, continuing effects');
    } else {
        console.log('Page visible, effects active');
    }
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ElectricSparks,
        CheckoutModal,
        copyPixKey
    };
}