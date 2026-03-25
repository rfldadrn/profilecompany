// ===================================
// Wait for DOM to be fully loaded
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Initialize AOS (Animate On Scroll) with Premium Settings
    // ===================================
    AOS.init({
        duration: 800,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic',
        delay: 50,
        anchorPlacement: 'top-bottom'
    });
    
    // ===================================
    // Advanced Scroll-Triggered Reveal Animations
    // ===================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after revealing
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Apply reveal animations to all elements with reveal classes
    document.querySelectorAll('.reveal-element, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade').forEach(el => {
        revealObserver.observe(el);
    });
    
    // ===================================
    // Section Reveal Animation on Scroll
    // ===================================
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px'
    });
    
    // Add section animate class and observe
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-animate');
        sectionObserver.observe(section);
    });
    
    // ===================================
    // Service Cards Staggered Reveal
    // ===================================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.classList.add('reveal-scale', `stagger-${(index % 6) + 1}`);
        revealObserver.observe(card);
    });
    
    // ===================================
    // Premium Navbar Functionality
    // ===================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Sticky navbar with scroll effects
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    
    // ===================================
    // Smooth Scroll Behavior Enhancement
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                // Add highlighting effect to target section
                target.style.transition = 'all 0.3s ease';
                const originalBg = target.style.background;
                target.style.background = 'rgba(6, 182, 212, 0.05)';
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    target.style.background = originalBg;
                }, 1000);
            }
        });
    });
    
    // ===================================
    // Number Counter Animation with Easing
    // ===================================
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2500;
        const fps = 60;
        const totalFrames = (duration / 1000) * fps;
        let current = 0;
        let frame = 0;
        
        const updateCounter = () => {
            frame++;
            const progress = frame / totalFrames;
            
            // Enhanced easing with bounce
            const easeOutElastic = progress === 1 ? 1 : 
                Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
            current = target * easeOutElastic;
            
            if (frame < totalFrames) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
                
                // Add completion pulse effect
                element.style.animation = 'counterPulse 0.4s ease';
                setTimeout(() => {
                    element.style.animation = '';
                }, 400);
            }
        };
        
        updateCounter();
    }
    
    // Add counter pulse animation
    if (!document.getElementById('counter-pulse')) {
        const style = document.createElement('style');
        style.id = 'counter-pulse';
        style.textContent = `
            @keyframes counterPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Trigger counter animation when stats section is in view
    const statsSection = document.querySelector('.community-stats');
    
    if (statsSection) {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };
        
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    stats.forEach((stat, index) => {
                        setTimeout(() => {
                            animateCounter(stat);
                        }, index * 100); // Stagger animation
                    });
                }
            });
        }, observerOptions);
        
        statsObserver.observe(statsSection);
    }
    
    // ===================================
    // Premium Stat Box Hover Effect with Micro-interactions
    // ===================================
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach((box, index) => {
        // Staggered entrance animation
        box.style.animationDelay = `${index * 0.1}s`;
        
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                animation: statRipple 0.8s ease-out;
                pointer-events: none;
            `;
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 800);
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add stat ripple animation
    if (!document.getElementById('stat-animations')) {
        const style = document.createElement('style');
        style.id = 'stat-animations';
        style.textContent = `
            @keyframes statRipple {
                to {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===================================
    // Premium Swiper Slider for Testimonials
    // ===================================
    const testimonialSwiper = new Swiper('.testimonial-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        },
        effect: 'slide',
        speed: 600,
        on: {
            slideChange: function() {
                // Add subtle animation on slide change
                const activeSlide = this.slides[this.activeIndex];
                if (activeSlide) {
                    activeSlide.style.animation = 'slideIn 0.6s ease-out';
                }
            }
        }
    });
    
    // ===================================
    // Enhanced Rating Stars Animation
    // ===================================
    const ratings = document.querySelectorAll('.testimonial-rating');
    
    ratings.forEach(rating => {
        const parentCard = rating.closest('.testimonial-card');
        
        if (parentCard) {
            parentCard.addEventListener('mouseenter', function() {
                const stars = rating.textContent.split('');
                rating.innerHTML = '';
                
                stars.forEach((star, index) => {
                    const span = document.createElement('span');
                    span.textContent = star;
                    span.style.display = 'inline-block';
                    span.style.animation = `starPop 0.3s ease-out ${index * 0.05}s`;
                    rating.appendChild(span);
                });
            });
        }
    });
    
    // ===================================
    // Magnetic Button Effect
    // ===================================
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-white');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle magnetic pull effect
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = Math.max(rect.width, rect.height) / 2;
            
            if (distance < maxDistance) {
                this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    });
    
    // ===================================
    // Animated Icons on Service Cards
    // ===================================
    const serviceIcons = document.querySelectorAll('.service-icon svg');
    
    serviceIcons.forEach(icon => {
        const parentCard = icon.closest('.service-card');
        
        if (parentCard) {
            parentCard.addEventListener('mouseenter', function() {
                icon.style.animation = 'iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
            
            parentCard.addEventListener('mouseleave', function() {
                icon.style.animation = '';
            });
        }
    });
    
    // ===================================
    // Premium Button Click Effects
    // ===================================
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-white');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            // Add ripple CSS if it doesn't exist
            if (!document.getElementById('ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
                    .ripple {
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.6);
                        transform: scale(0);
                        animation: ripple-animation 0.6s ease-out;
                        pointer-events: none;
                    }
                    @keyframes ripple-animation {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            
            console.log('CTA button clicked!');
        });
    });
    
    // ===================================
    // Premium Service Card Hover Effects with Mouse Tracking
    // ===================================
    const interactiveCards = document.querySelectorAll('.service-card');
    
    interactiveCards.forEach(card => {
        // Mouse tracking for gradient effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation for 3D effect
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            // Set CSS custom properties for gradient position
            this.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            this.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            
            this.style.transform = `translateY(-12px) scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseenter', function(e) {
            this.style.transition = 'box-shadow 0.3s, border-color 0.3s, background 0.3s';
            
            // Add shimmer effect
            const shimmer = document.createElement('div');
            shimmer.className = 'card-shimmer';
            shimmer.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                pointer-events: none;
                animation: shimmerSlide 1.5s ease-in-out;
            `;
            this.appendChild(shimmer);
            setTimeout(() => shimmer.remove(), 1500);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            this.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0) rotateY(0)';
            this.style.removeProperty('--mouse-x');
            this.style.removeProperty('--mouse-y');
        });
    });
    
    // Add shimmer animation
    if (!document.getElementById('shimmer-style')) {
        const style = document.createElement('style');
        style.id = 'shimmer-style';
        style.textContent = `
            @keyframes shimmerSlide {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    serviceCards.forEach(card => {
        // Mouse tracking for gradient effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation for 3D effect
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            // Set CSS custom properties for gradient position
            this.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            this.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            
            this.style.transform = `translateY(-12px) scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseenter', function(e) {
            this.style.transition = 'box-shadow 0.3s, border-color 0.3s, background 0.3s';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            this.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0) rotateY(0)';
            this.style.removeProperty('--mouse-x');
            this.style.removeProperty('--mouse-y');
        });
    });
    
    // ===================================
    // ===================================
    // Premium Loading Animation with Progress
    // ===================================
    window.addEventListener('load', function() {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 20px;
            transition: opacity 0.5s ease;
        `;
        
        const loadingText = document.createElement('div');
        loadingText.style.cssText = `
            font-size: 24px;
            font-weight: 800;
            background: linear-gradient(90deg, #06b6d4, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: pulse 2s ease-in-out infinite;
        `;
        loadingText.textContent = 'Cv. Dunia Busana Tailor';
        
        const loadingBar = document.createElement('div');
        loadingBar.style.cssText = `
            width: 200px;
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            overflow: hidden;
        `;
        
        const loadingProgress = document.createElement('div');
        loadingProgress.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #06b6d4, #8b5cf6);
            transition: width 0.3s ease;
        `;
        
        loadingBar.appendChild(loadingProgress);
        loadingOverlay.appendChild(loadingText);
        loadingOverlay.appendChild(loadingBar);
        
        // Check if overlay already exists
        if (!document.getElementById('loading-overlay')) {
            document.body.insertBefore(loadingOverlay, document.body.firstChild);
        }
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loadingOverlay.style.opacity = '0';
                    setTimeout(() => loadingOverlay.remove(), 500);
                }, 200);
            }
            loadingProgress.style.width = progress + '%';
        }, 100);
    });
    
    // ===================================
    // Enhanced Parallax with RequestAnimationFrame
    // ===================================
    const heroShapes = document.querySelectorAll('.visual-shape');
    
    if (heroShapes.length > 0 && window.innerWidth > 768) {
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrolled = window.scrollY;
                    const heroSection = document.querySelector('.hero');
                    
                    if (heroSection && scrolled < heroSection.offsetHeight) {
                        heroShapes.forEach((shape, index) => {
                            const speed = (index + 1) * 0.3;
                            const yPos = -(scrolled * speed / 10);
                            const rotation = scrolled * 0.02 * (index + 1);
                            const scale = 1 + (scrolled * 0.0001 * index);
                            shape.style.transform = `translateY(${yPos}px) rotate(${rotation}deg) scale(${scale})`;
                        });
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
    }
    
    // ===================================
    // Enhanced Button Hover Effects with Sound Feedback (Visual)
    // ===================================
    const allButtons = document.querySelectorAll('.btn');
    
    allButtons.forEach(button => {
        // Add sparkle effect on hover
        button.addEventListener('mouseenter', function(e) {
            createSparkles(this, e);
        });
        
        // Add 3D tilt effect
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;
            
            this.style.transform = `perspective(1000px) rotateY(${percentX * 5}deg) rotateX(${-percentY * 5}deg) translateY(-4px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Sparkle effect function
    function createSparkles(element, event) {
        const sparkleCount = 3;
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
                z-index: 999;
                opacity: 0;
                top: ${Math.random() * rect.height}px;
                left: ${Math.random() * rect.width}px;
                animation: sparkleAnimation 0.6s ease-out;
            `;
            
            element.style.position = 'relative';
            element.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 600);
        }
    }
    
    // Add sparkle animation CSS
    if (!document.getElementById('sparkle-style')) {
        const style = document.createElement('style');
        style.id = 'sparkle-style';
        style.textContent = `
            @keyframes sparkleAnimation {
                0% {
                    opacity: 0;
                    transform: scale(0) rotate(0deg);
                }
                50% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    transform: scale(1.5) rotate(180deg) translateY(-20px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===================================
    // Scroll Progress with Color Transition
    // ===================================
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #06b6d4, #8b5cf6);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease-out;
        box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
        
        // Change color based on scroll position
        if (scrolled > 75) {
            progressBar.style.background = 'linear-gradient(90deg, #8b5cf6, #ec4899)';
        } else if (scrolled > 50) {
            progressBar.style.background = 'linear-gradient(90deg, #06b6d4, #8b5cf6)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #06b6d4, #22d3ee)';
        }
    }, { passive: true });
    
    // ===================================
    // Form Handling (if you add a contact form later)
    // ===================================
    // Example function you can use when adding forms
    function handleFormSubmit(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(event.target);
        
        // Process form data
        console.log('Form submitted:', Object.fromEntries(formData));
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        event.target.reset();
    }
    
    // ===================================
    // Lazy Loading Images (if you add real images)
    // ===================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===================================
    // Scroll to Top Button (Optional Enhancement)
    // ===================================
    // You can add this HTML element and enable this feature:
    // <button id="scrollToTop" class="scroll-to-top">↑</button>
    
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===================================
    // Premium Console Welcome Message
    // ===================================
    console.log('%c✨ SportTech Premium', 'font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; padding: 20px 0;');
    console.log('%c🚀 Built with Modern Web Technologies', 'font-size: 14px; font-weight: 600; color: #475569; padding: 5px 0;');
    console.log('%c💎 Premium Design | ⚡ Optimized Performance | 📱 Fully Responsive', 'font-size: 12px; color: #06b6d4; padding: 5px 0;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e2e8f0;');
    console.log('%cHTML5 + CSS3 + Vanilla JavaScript', 'font-size: 11px; color: #94a3b8;');
});

// ===================================
// Performance Optimization
// ===================================

// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Throttle function for performance-intensive events
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// Utility Functions
// ===================================

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add fade-in animation to elements when they enter viewport
function fadeInOnScroll() {
    const elements = document.querySelectorAll('.fade-in-element');
    
    elements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

// Uncomment to use fade-in on scroll for custom elements
// window.addEventListener('scroll', debounce(fadeInOnScroll));

// ===================================
// Gallery System (CMS-Driven)
// ===================================

// Gallery State
let currentFilter = 'Semua';

// Initialize Gallery
function initGallery() {
    if (typeof content === 'undefined' || !content.gallery) {
        console.warn('Gallery content not found, retrying in 100ms...');
        setTimeout(initGallery, 100);
        return;
    }
    
    console.log('Gallery initializing with', content.gallery.items.length, 'items');
    renderGalleryFilters();
    renderGallery(content.gallery.items);
    initGalleryModal();
}

// Render Gallery Filter Buttons
function renderGalleryFilters() {
    const filtersContainer = document.querySelector('.gallery-filters');
    if (!filtersContainer || !content.gallery.categories) return;
    
    // Clear existing buttons except the first one (Semua)
    filtersContainer.innerHTML = '';
    
    // Create filter buttons
    content.gallery.categories.forEach((category, index) => {
        const button = document.createElement('button');
        button.className = `filter-btn${index === 0 ? ' active' : ''}`;
        button.setAttribute('data-category', category);
        button.textContent = category;
        
        // Add click event
        button.addEventListener('click', () => {
            filterGallery(category);
            
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
        
        filtersContainer.appendChild(button);
    });
}

// Render Gallery Items
function renderGallery(items) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) {
        console.error('Gallery grid element not found!');
        return;
    }
    
    // Clear grid
    galleryGrid.innerHTML = '';
    
    // Filter items if not showing all
    const filteredItems = currentFilter === 'Semua' 
        ? items 
        : items.filter(item => item.category === currentFilter);
    
    console.log('Rendering', filteredItems.length, 'items for category:', currentFilter);
    
    // Add stagger delay
    let delay = 0;
    
    // Render each item
    filteredItems.forEach((item, index) => {
        const galleryItem = createGalleryItem(item, delay);
        galleryGrid.appendChild(galleryItem);
        delay += 50; // Stagger animation
    });
    
    // Force repaint for mobile
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            galleryGrid.style.display = 'grid';
        }, 10);
    }
    
    // If no items found
    if (filteredItems.length === 0) {
        galleryGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 60px 20px; color: var(--text-tertiary);">Tidak ada item dalam kategori ini</p>';
    }
}

// Create Gallery Item Element
function createGalleryItem(item, delay = 0) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    // Reduce delay for mobile devices
    const isMobile = window.innerWidth <= 768;
    galleryItem.style.animationDelay = `${isMobile ? delay / 2 : delay}ms`;
    
    galleryItem.innerHTML = `
        <div class="gallery-image">
            <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x500?text=Image+Not+Found'">
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <span class="gallery-category">${item.category}</span>
                    <h3 class="gallery-title">${item.title}</h3>
                </div>
            </div>
        </div>
    `;
    
    // Add click event to open modal
    galleryItem.addEventListener('click', () => {
        openGalleryModal(item.image, item.title);
    });
    
    return galleryItem;
}

// Filter Gallery by Category
function filterGallery(category) {
    currentFilter = category;
    
    const galleryGrid = document.getElementById('galleryGrid');
    const currentItems = galleryGrid.querySelectorAll('.gallery-item');
    
    // Add fade out animation to current items
    currentItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('filtering-out');
        }, index * 30);
    });
    
    // Wait for fade out, then render new items
    setTimeout(() => {
        renderGallery(content.gallery.items);
    }, currentItems.length * 30 + 300);
}

// Gallery Modal / Lightbox
let galleryModal, modalImage, modalTitle, modalOverlay, modalClose;

function initGalleryModal() {
    galleryModal = document.getElementById('galleryModal');
    modalImage = document.getElementById('modalImage');
    modalTitle = document.getElementById('modalTitle');
    modalOverlay = document.getElementById('modalOverlay');
    modalClose = document.getElementById('modalClose');
    
    if (!galleryModal) return;
    
    // Close on overlay click
    modalOverlay.addEventListener('click', closeGalleryModal);
    
    // Close on close button click
    modalClose.addEventListener('click', closeGalleryModal);
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
            closeGalleryModal();
        }
    });
    
    // Prevent body scroll when modal is open
    galleryModal.addEventListener('transitionend', () => {
        if (galleryModal.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

function openGalleryModal(imageSrc, title) {
    if (!galleryModal) return;
    
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    galleryModal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
    if (!galleryModal) return;
    
    galleryModal.classList.remove('active');
    
    // Re-enable body scroll
    document.body.style.overflow = '';
    
    // Clear image after animation
    setTimeout(() => {
        modalImage.src = '';
        modalTitle.textContent = '';
    }, 300);
}

// Initialize gallery when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
} else {
    initGallery();
}