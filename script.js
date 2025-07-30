
// Global variables
let activeSection = 'hero';
let isMobileMenuOpen = false;
let copiedText = '';

// Contact information for copying
const contactInfo = `Marc Keeling IV
Principal Data Engineer
Email: MarcKeelingIV@Outlook.com
Phone: (801) 635-8987
Location: Saratoga Springs, UT`;

// DOM elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const copyBtn = document.getElementById('copyBtn');
const copyBtnText = document.getElementById('copyBtnText');

// Navigation sections
const navigationSections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupIntersectionObservers();
    setupNavigation();
    setupMobileMenu();
    setupCopyToClipboard();
});

// Setup Intersection Observers for animations and active section tracking
function setupIntersectionObservers() {
    // Animation observer
    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1 }
    );

    // Active section observer
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        },
        { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' }
    );

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    animatedElements.forEach((el) => animationObserver.observe(el));

    // Observe all sections for active state tracking
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => sectionObserver.observe(section));
}

// Setup navigation functionality
function setupNavigation() {
    // Desktop navigation
    const desktopNavItems = document.querySelectorAll('.desktop-nav .nav-item');
    desktopNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            scrollToSection(sectionId);
        });
    });

    // Mobile navigation
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            scrollToSection(sectionId);
            closeMobileMenu();
        });
    });
}

// Setup mobile menu functionality
function setupMobileMenu() {
    // Mobile menu button click
    mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
    
    // Mobile overlay click
    mobileOverlay?.addEventListener('click', closeMobileMenu);
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

// Setup copy to clipboard functionality
function setupCopyToClipboard() {
    copyBtn?.addEventListener('click', () => {
        copyToClipboard(contactInfo, 'contact');
    });
}

// Set active section and update navigation
function setActiveSection(sectionId) {
    if (activeSection === sectionId) return;
    
    activeSection = sectionId;
    
    // Update desktop navigation
    const desktopNavItems = document.querySelectorAll('.desktop-nav .nav-item');
    desktopNavItems.forEach(item => {
        const itemSection = item.getAttribute('data-section');
        if (itemSection === sectionId) {
            item.classList.add('nav-item-active');
        } else {
            item.classList.remove('nav-item-active');
        }
    });
    
    // Update mobile navigation
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        const itemSection = item.getAttribute('data-section');
        if (itemSection === sectionId) {
            item.classList.add('mobile-nav-item-active');
        } else {
            item.classList.remove('mobile-nav-item-active');
        }
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (isMobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// Open mobile menu
function openMobileMenu() {
    isMobileMenuOpen = true;
    mobileMenuBtn?.classList.add('active');
    mobileMenu?.classList.add('mobile-menu-open');
    mobileOverlay?.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close mobile menu
function closeMobileMenu() {
    isMobileMenuOpen = false;
    mobileMenuBtn?.classList.remove('active');
    mobileMenu?.classList.remove('mobile-menu-open');
    mobileOverlay?.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Copy to clipboard function
async function copyToClipboard(text, type) {
    try {
        await navigator.clipboard.writeText(text);
        copiedText = type;
        
        // Update button text
        if (copyBtnText) {
            copyBtnText.textContent = 'Copied!';
        }
        
        // Reset button text after 2 seconds
        setTimeout(() => {
            copiedText = '';
            if (copyBtnText) {
                copyBtnText.textContent = 'Copy Info';
            }
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
            
            copiedText = type;
            if (copyBtnText) {
                copyBtnText.textContent = 'Copied!';
            }
            
            setTimeout(() => {
                copiedText = '';
                if (copyBtnText) {
                    copyBtnText.textContent = 'Copy Info';
                }
            }, 2000);
        } catch (fallbackErr) {
            console.error('Fallback copy method also failed: ', fallbackErr);
        }
    }
}

// Handle window resize for responsive navigation
window.addEventListener('resize', () => {
    // Close mobile menu if window becomes large
    if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        closeMobileMenu();
    }
});

// Smooth scroll polyfill for older browsers
function smoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
        document.head.appendChild(script);
        
        script.onload = () => {
            new SmoothScroll('a[href*="#"]');
        };
    }
}

// Initialize smooth scroll polyfill
smoothScrollPolyfill();

// Performance optimization: Debounce scroll events if needed
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

// Add performance monitoring for animations (optional)
if ('IntersectionObserver' in window) {
    console.log('✅ IntersectionObserver supported - animations will work smoothly');
} else {
    console.warn('⚠️ IntersectionObserver not supported - fallback animations will be used');
    
    // Fallback for older browsers
    const fallbackElements = document.querySelectorAll('.fade-in, .slide-up');
    fallbackElements.forEach(el => {
        el.classList.add('visible');
    });
}

// Add accessibility improvements
document.addEventListener('keydown', (e) => {
    // Handle tab navigation for better accessibility
    if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
});

// Preload critical images for better performance
function preloadImages() {
    const criticalImages = [
        'https://cdn.abacus.ai/images/3de0ed8d-232f-4cb0-96d1-f2108b520ff8.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

console.log('🚀 Marc Keeling Portfolio - Static Version Loaded Successfully');
