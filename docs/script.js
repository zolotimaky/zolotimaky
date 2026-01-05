// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            inquiryType: document.getElementById('inquiry-type').value,
            message: document.getElementById('message').value
        };

        // For now, just show a success message
        // In production, this would connect to a form service like Formspree or Web3Forms
        console.log('Form submitted:', formData);

        // Show success message
        formMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
        formMessage.className = 'form-message success';

        // Reset form
        contactForm.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);

    /*
    // Example of how to integrate with Formspree (when ready):
    try {
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            formMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
            formMessage.className = 'form-message success';
            contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        formMessage.textContent = 'Something went wrong. Please try again.';
        formMessage.className = 'form-message error';
    }
    */
    });
}

// Add navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Gallery Carousel
let currentSlide = 0;
const galleryTrack = document.querySelector('.gallery-track');
const slides = document.querySelectorAll('.gallery-item');
const totalSlides = slides.length;
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');

function getItemsPerView() {
    const width = window.innerWidth;
    if (width <= 768) return 2;
    if (width <= 1024) return 3;
    return 4;
}

function updateCarousel() {
    if (!galleryTrack) return;
    const itemsPerView = getItemsPerView();
    const slideWidth = 100 / itemsPerView;
    const offset = -currentSlide * slideWidth;
    galleryTrack.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    const itemsPerView = getItemsPerView();
    const maxSlide = totalSlides - itemsPerView;
    if (currentSlide < maxSlide) {
        currentSlide++;
    } else {
        currentSlide = 0;
    }
    updateCarousel();
}

function prevSlide() {
    const itemsPerView = getItemsPerView();
    const maxSlide = totalSlides - itemsPerView;
    if (currentSlide > 0) {
        currentSlide--;
    } else {
        currentSlide = maxSlide;
    }
    updateCarousel();
}

if (nextButton && prevButton && galleryTrack) {
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Update carousel on window resize
    window.addEventListener('resize', updateCarousel);
}

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentLightboxIndex = 0;
let galleryItems = [];

// Build gallery items array
function buildGalleryArray() {
    galleryItems = Array.from(document.querySelectorAll('.gallery-item')).filter(item => {
        const img = item.querySelector('img');
        return img && img.tagName === 'IMG';
    });
}

// Show image in lightbox
function showLightboxImage(index) {
    if (galleryItems.length === 0) return;

    currentLightboxIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentLightboxIndex];
    const fullsizeSrc = item.getAttribute('data-fullsize') || item.querySelector('img').src;
    const imgElement = item.querySelector('img');

    lightboxImage.src = fullsizeSrc;
    lightboxImage.alt = imgElement.alt;
}

// Open lightbox
buildGalleryArray();

document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', (e) => {
        const imgElement = item.querySelector('img') || item.querySelector('.placeholder-image');
        if (imgElement && imgElement.tagName === 'IMG') {
            currentLightboxIndex = galleryItems.indexOf(item);
            showLightboxImage(currentLightboxIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
});

// Navigation arrows
lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxImage(currentLightboxIndex - 1);
});

lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxImage(currentLightboxIndex + 1);
});

// Close lightbox when clicking on the background
lightbox.addEventListener('click', () => {
    closeLightbox();
});

// Prevent closing when clicking on the image or nav buttons
lightboxImage.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        showLightboxImage(currentLightboxIndex - 1);
    } else if (e.key === 'ArrowRight') {
        showLightboxImage(currentLightboxIndex + 1);
    }
});

// Optional: Auto-play carousel (commented out - uncomment if desired)
// setInterval(nextSlide, 5000);
