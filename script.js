// StyleLoom Interactive Features
(function() {
    'use strict';

    // DOM Elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const categoryTabs = document.querySelectorAll('.menuS a');
    const shopNowButtons = document.querySelectorAll('.shop-now-btn');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    // Initialize the application
    function init() {
        setupMobileMenu();
        setupCategoryTabs();
        setupShopButtons();
        setupScrollAnimations();
        setupTestimonialInteractions();
        setupResponsiveImages();
        addKeyboardNavigation();
        setupSmoothScrolling();
        setupFooterInteractions();
        setupFAQInteractions();
        setupPromoInteractions();
        setupTagsScroller();
    }

    // Mobile Menu Functionality
    function setupMobileMenu() {
        if (!mobileMenuToggle || !mobileNav) return;

        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking on links
        const mobileMenuLinks = mobileNav.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        
        // Update ARIA attributes
        const isOpen = mobileNav.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen);
        mobileNav.setAttribute('aria-hidden', !isOpen);
    }

    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
        
        // Update ARIA attributes
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
    }

    // Category Tabs Functionality
    function setupCategoryTabs() {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tabs
                categoryTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Add smooth transition effect
                tab.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    tab.style.transform = 'scale(1)';
                }, 150);

                // Filter products based on category (if needed)
                const category = tab.getAttribute('href').substring(1);
                filterProducts(category);
            });
        });
    }

    function filterProducts(category) {
        const productSections = document.querySelectorAll('.product-section');
        
        productSections.forEach(section => {
            if (category === 'all') {
                section.style.display = 'block';
                animateSection(section);
            } else {
                const sectionTitle = section.querySelector('h2').textContent.toLowerCase();
                if (sectionTitle.includes(category.toLowerCase()) || 
                    (category === 'men' && sectionTitle.includes('men')) ||
                    (category === 'women' && sectionTitle.includes('women')) ||
                    (category === 'kids' && sectionTitle.includes('kids'))) {
                    section.style.display = 'block';
                    animateSection(section);
                } else {
                    section.style.display = 'none';
                }
            }
        });
    }

    function animateSection(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.5s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100);
    }


    function addToCart(productCard) {
        const productInfo = {
            name: productCard.querySelector('h3').textContent,
            price: productCard.querySelector('.product-details').textContent.match(/\$[\d.]+/)?.[0],
            category: productCard.querySelector('.product-category').textContent
        };
        
        // Store in localStorage (simple cart implementation)
        let cart = JSON.parse(localStorage.getItem('styleLoomCart') || '[]');
        cart.push(productInfo);
        localStorage.setItem('styleLoomCart', JSON.stringify(cart));
        
        // Update cart UI (if exists)
        updateCartUI();
    }

    function updateCartUI() {
        const cart = JSON.parse(localStorage.getItem('styleLoomCart') || '[]');
        const cartCount = cart.length;
        
        // Update cart badge if it exists
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.style.display = cartCount > 0 ? 'block' : 'none';
        }
    }

    // Scroll Animations
    function setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.content, .card, .product-card, .testimonial-card, .details'
        );
        
        animateElements.forEach(el => {
            observer.observe(el);
        });

        // Add CSS animation classes
        addAnimationStyles();
    }

    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .content, .card, .product-card, .testimonial-card, .details {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            @media (prefers-reduced-motion: reduce) {
                .content, .card, .product-card, .testimonial-card, .details {
                    opacity: 1;
                    transform: none;
                    transition: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Testimonial Interactions
    function setupTestimonialInteractions() {
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Highlight current testimonial
                testimonialCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.style.opacity = '0.7';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                // Reset all testimonials
                testimonialCards.forEach(otherCard => {
                    otherCard.style.opacity = '1';
                });
            });
        });
    }

    // Responsive Image Handling
    function setupResponsiveImages() {
        // Handle image loading and responsive scaling
        const images = document.querySelectorAll('img');
        
        function adjustImageSizes() {
            const isMobile = window.innerWidth <= 767;
            const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1023;
            
            images.forEach(img => {
                if (img.closest('.part1')) {
                    img.style.maxHeight = isMobile ? '200px' : isTablet ? '300px' : '400px';
                } else if (img.closest('.product-image')) {
                    img.style.height = isMobile ? '180px' : isTablet ? '220px' : '250px';
                } else if (img.closest('.testimonial-avatar')) {
                    img.style.width = isMobile ? '40px' : '50px';
                    img.style.height = isMobile ? '40px' : '50px';
                }
            });
        }

    //     // Adjust on load and resize
    //     adjustImageSizes();
    //     window.addEventListener('resize', debounce(adjustImageSizes, 250));
        
    //     // Lazy loading for images
    //     if ('IntersectionObserver' in window) {
    //         const imageObserver = new IntersectionObserver((entries, observer) => {
    //             entries.forEach(entry => {
    //                 if (entry.isIntersecting) {
    //                     const img = entry.target;
    //                     img.style.opacity = '0';
    //                     img.onload = () => {
    //                         img.style.transition = 'opacity 0.3s ease';
    //                         img.style.opacity = '1';
    //                     };
    //                     observer.unobserve(img);
    //                 }
    //             });
    //         });
            
    //         images.forEach(img => {
    //             if (img.getAttribute('src')) {
    //                 imageObserver.observe(img);
    //             }
    //         });
    //     }
    }

    // Keyboard Navigation
    function addKeyboardNavigation() {
        // Add keyboard support for interactive elements
        document.addEventListener('keydown', (e) => {
            // Handle Enter and Space for custom buttons
            if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('shop-now-btn')) {
                e.preventDefault();
                e.target.click();
            }
            
            // Tab navigation for mobile menu
            if (e.key === 'Tab' && mobileNav && mobileNav.classList.contains('active')) {
                const focusableElements = mobileNav.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    // Smooth scrolling for anchor links
    function setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target && href !== '#all' && href !== '#kids') {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (mobileNav && mobileNav.classList.contains('active')) {
                        closeMobileMenu();
                    }
                    
                    // Smooth scroll to target
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Utility Functions
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: type === 'error' ? '#dc2626' : '#059669',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            zIndex: '1000',
            fontSize: '14px',
            fontFamily: 'inherit',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'slideIn 0.3s ease-out'
        });

        // Add slide in animation
        const slideInStyle = document.createElement('style');
        slideInStyle.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(slideInStyle);

        document.body.appendChild(notification);

        // Auto-remove notification
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);

        // Add slide out animation
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(slideOutStyle);
    }

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

    // Performance optimization - Handle window resize
    function handleResize() {
        const isMobile = window.innerWidth <= 767;
        
        // Show/hide mobile menu toggle based on screen size
        if (mobileMenuToggle) {
            mobileMenuToggle.style.display = isMobile ? 'flex' : 'none';
        }
        
        // Close mobile menu on desktop
        if (!isMobile && mobileNav && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    // Add resize listener
    window.addEventListener('resize', debounce(handleResize, 250));

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Footer Interactions
    function setupFooterInteractions() {
        // Newsletter subscription
        const newsletterForm = document.querySelector('.newsletter-form');
        const newsletterInput = document.querySelector('.newsletter-input');
        const newsletterBtn = document.querySelector('.newsletter-btn');
        
        if (newsletterForm && newsletterInput && newsletterBtn) {
            newsletterBtn.addEventListener('click', handleNewsletterSubscription);
            newsletterInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleNewsletterSubscription();
                }
            });
        }
        
        // Social links hover effects
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(-2px) scale(1)';
            });
        });
        
        // Payment methods hover effects
        const paymentIcons = document.querySelectorAll('.payment-methods i');
        paymentIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2)';
                icon.style.color = 'var(--text-primary)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1)';
                icon.style.color = 'var(--text-secondary)';
            });
        });
    }
    
    function handleNewsletterSubscription() {
        const emailInput = document.querySelector('.newsletter-input');
        const email = emailInput.value.trim();
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate subscription process
        const newsletterBtn = document.querySelector('.newsletter-btn');
        const originalText = newsletterBtn.textContent;
        
        // Show loading state
        newsletterBtn.textContent = 'Subscribing...';
        newsletterBtn.disabled = true;
        newsletterBtn.style.opacity = '0.7';
        
        // Simulate API call
        setTimeout(() => {
            showNotification(`Thank you! ${email} has been subscribed to our newsletter`, 'success');
            emailInput.value = '';
            
            // Reset button state
            newsletterBtn.textContent = originalText;
            newsletterBtn.disabled = false;
            newsletterBtn.style.opacity = '1';
            
            // Store subscription in localStorage
            let subscribers = JSON.parse(localStorage.getItem('styleLoomSubscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('styleLoomSubscribers', JSON.stringify(subscribers));
            }
        }, 1500);
    }

    // FAQ Interactions
    function setupFAQInteractions() {
        const faqCards = document.querySelectorAll('.cd');
        
        faqCards.forEach(card => {
            card.addEventListener('click', () => {
                // Add click animation
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 150);
            });
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });
    }

    // Promo Interactions
    function setupPromoInteractions() {
        const promoButton = document.querySelector('.button');
        
        if (promoButton) {
            promoButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Animation feedback
                promoButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    promoButton.style.transform = 'scale(1)';
                }, 100);
                
                // Show promotional message
                showNotification('Welcome to StyleLoom! Start exploring our collections.', 'info');
                
                // Smooth scroll to products section
                const productsSection = document.querySelector('#product');
                if (productsSection) {
                    productsSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    // Tags Scroller Interactions
    function setupTagsScroller() {
        const tagsContainer = document.querySelector('.tags');
        const tags = document.querySelectorAll('.tag');
        
        if (tagsContainer && tags.length > 0) {
            // Add click interactions to tags
            tags.forEach(tag => {
                tag.addEventListener('click', () => {
                    // Remove active class from all tags
                    tags.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tag
                    tag.classList.add('active');
                    
                    // Show notification with tag name
                    const tagName = tag.textContent.toLowerCase();
                    showNotification(`Filtering products by: ${tagName}`, 'info');
                    
                    // Smooth scroll to products
                    const productsSection = document.querySelector('#product');
                    if (productsSection) {
                        productsSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
                
                // Keyboard accessibility
                tag.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        tag.click();
                    }
                });
                
                // Make tags focusable
                tag.setAttribute('tabindex', '0');
                tag.style.cursor = 'pointer';
            });
            
            // Auto-scroll animation for tags
            let scrollDirection = 1;
            let scrollPosition = 0;
            
            const autoScroll = () => {
                if (tagsContainer.scrollWidth > tagsContainer.clientWidth) {
                    scrollPosition += scrollDirection;
                    
                    if (scrollPosition >= tagsContainer.scrollWidth - tagsContainer.clientWidth) {
                        scrollDirection = -1;
                    } else if (scrollPosition <= 0) {
                        scrollDirection = 1;
                    }
                    
                    tagsContainer.scrollLeft = scrollPosition;
                }
            };
            
            // Start auto-scroll after a delay
            setTimeout(() => {
                const scrollInterval = setInterval(autoScroll, 50);
                
                // Stop auto-scroll on hover
                tagsContainer.addEventListener('mouseenter', () => {
                    clearInterval(scrollInterval);
                });
                
                // Resume auto-scroll on mouse leave
                tagsContainer.addEventListener('mouseleave', () => {
                    setTimeout(() => {
                        setInterval(autoScroll, 50);
                    }, 2000);
                });
            }, 3000);
        }
    }

    // Handle page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            // Close mobile menu when page becomes hidden
            if (mobileNav && mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });

})();



        // Size selection functionality
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Tab functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update progress bar based on active tab
                const tabs = Array.from(document.querySelectorAll('.tab-btn'));
                const activeIndex = tabs.indexOf(this);
                const progressFill = document.querySelector('.progress-fill');
                const percentage = ((activeIndex + 1) / tabs.length) * 100;
                progressFill.style.width = percentage + '%';
            });
        });

        // Add to cart functionality
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.textContent.includes('Add To Cart')) {
                    alert('Item added to cart!');
                }
            });
        });

        // Close button functionality
        document.querySelector('.close-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to close this page?')) {
                window.close();
            }
        });




        // Create sunburst rays dynamically
        function createSunburst(elementId) {
            const sunburst = document.getElementById(elementId);
            if (!sunburst) return;
            
            for (let i = 0; i < 24; i++) {
                const ray = document.createElement('div');
                ray.className = 'sunburst-ray';
                ray.style.transform = `translate(-50%, -100%) rotate(${i * 15}deg)`;
                sunburst.appendChild(ray);
            }
        }

        // Initialize sunbursts
        document.addEventListener('DOMContentLoaded', function() {
            createSunburst('sunburst1');
            createSunburst('sunburst2');
        });

        // Add smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
