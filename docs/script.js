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
            window.scrollTo({
                top: scrollPositionFor(target),
                behavior: 'smooth'
            });
        }
    });
});

// Where to scroll for a section: "Home" goes to the very top (orange bar fully
// visible); other sections stop just below the fixed menu bar
function scrollPositionFor(target) {
    if (target.id === 'home') return 0;
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    return Math.max(0, target.offsetTop - navbarHeight);
}

// Arriving from another page with a link like index.html#contact or #home:
// correct the browser's jump so nothing hides under the menu bar
window.addEventListener('load', () => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    // after the browser's own jump to the #section, fine-tune instantly (no visible jump)
    const fineTune = () => {
        const top = scrollPositionFor(target);
        if (Math.abs(window.scrollY - top) > 2) window.scrollTo({ top: top, behavior: 'instant' });
    };
    setTimeout(fineTune, 60);
    setTimeout(fineTune, 400); // again, after the page has fully settled
});

// Top bar: keep the page below it at the right height, and pre-select
// "Sponsorship / Donation" in the contact form when its link is clicked
(function () {
    const bar = document.getElementById('topBar');
    if (!bar) return;
    const root = document.documentElement;
    function setBarHeight() {
        root.style.setProperty('--topbar-h', bar.offsetHeight + 'px');
        placeNavbar();
    }
    // The menu bar sits just under the top bar, and slides up to the very top
    // of the screen as the top bar scrolls away
    function placeNavbar() {
        const top = Math.max(0, bar.offsetHeight - window.scrollY);
        root.style.setProperty('--nav-top', top + 'px');
    }
    setBarHeight();
    window.addEventListener('resize', setBarHeight);
    window.addEventListener('load', setBarHeight);
    window.addEventListener('scroll', placeNavbar, { passive: true });

    // Coming from the Gallery page's top bar (index.html?subject=...#contact)
    const wanted = new URLSearchParams(window.location.search).get('subject');
    const subjectSelect = document.getElementById('subject');
    if (wanted && subjectSelect && subjectSelect.querySelector(`option[value="${wanted}"]`)) {
        subjectSelect.value = wanted;
    }

    document.querySelectorAll('[data-subject]').forEach(link => {
        link.addEventListener('click', () => {
            const subject = document.getElementById('subject');
            if (subject) subject.value = link.getAttribute('data-subject');
        });
    });
})();

// Contact Form Handling with Web3Forms
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                formMessage.textContent = 'Thanks for reaching out!';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                contactForm.reset();

                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                    formMessage.className = 'form-message';
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formMessage.textContent = 'Something went wrong. Please try again.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';

            // Hide error message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.className = 'form-message';
            }, 5000);
        }
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

// Repertoire Carousel (dance cards) - Infinite Loop, like the News carousel.
// The first 3 cards show first; the arrows go round in a circle (last card -> first card).
(function () {
    const track = document.querySelector('.repertoire-track');
    const prev = document.getElementById('prevDance');
    const next = document.getElementById('nextDance');
    if (!track || !prev || !next) return;
    const cards = Array.from(track.querySelectorAll('.service-card'));
    const total = cards.length;
    if (total === 0) return;

    // Copies of all cards after the originals make the seamless loop
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a').forEach(a => a.setAttribute('tabindex', '-1'));
        track.appendChild(clone);
    });

    let index = 0;
    let busy = false;

    function step() {
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        return cards[0].offsetWidth + gap;
    }

    function move(smooth) {
        track.style.transition = smooth ? 'transform 0.4s ease' : 'none';
        track.style.transform = `translateX(${-index * step()}px)`;
    }

    // Line the arrows up with the dance titles (on every screen size)
    const carousel = track.closest('.repertoire-carousel');
    function alignArrows() {
        const title = cards[0].querySelector('h3');
        if (!title || !carousel) return;
        const titleBox = title.getBoundingClientRect();
        const top = titleBox.top + titleBox.height / 2 - carousel.getBoundingClientRect().top;
        [prev, next].forEach(btn => {
            btn.style.marginTop = Math.max(0, top - btn.offsetHeight / 2) + 'px';
        });
    }

    function jumpTo(i) {
        index = i;
        move(false);
        void track.offsetWidth; // apply the jump before the next animation
    }

    next.addEventListener('click', () => {
        if (busy) return;
        busy = true;
        index++;
        move(true);
        setTimeout(() => {
            if (index >= total) jumpTo(0);
            busy = false;
        }, 450);
    });

    prev.addEventListener('click', () => {
        if (busy) return;
        busy = true;
        if (index === 0) jumpTo(total);
        setTimeout(() => {
            index--;
            move(true);
            setTimeout(() => { busy = false; }, 450);
        }, 20);
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { move(false); alignArrows(); }, 100);
    });

    move(false);
    alignArrows();
    window.addEventListener('load', alignArrows);
})();

// Gallery Carousel
let currentSlide = 0;
const galleryTrack = document.querySelector('.gallery-track');
const slides = document.querySelectorAll('.gallery-item');
const totalSlides = slides.length;
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');

function getItemsPerView() {
    const width = window.innerWidth;
    if (width <= 768) return 1;  // Mobile: 1 image at a time
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
    // On mobile only: move specific image to first position
    if (window.innerWidth <= 768 && galleryTrack) {
        const priorityImageName = 'b566bb7e-6d1a-4719-8d0f-6617d0ea8a02.jpg';
        const allItems = Array.from(galleryTrack.querySelectorAll('.gallery-item'));
        const priorityItem = allItems.find(item => {
            const fullsizePath = item.getAttribute('data-fullsize');
            return fullsizePath && fullsizePath.includes(priorityImageName);
        });

        if (priorityItem) {
            // Move priority item to the beginning
            galleryTrack.insertBefore(priorityItem, galleryTrack.firstChild);
        }
    }

    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Update carousel on window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // Initialize
    updateCarousel();
}

// News Carousel - Infinite Loop
let currentNewsSlide = 0;
const newsTrack = document.querySelector('.news-track');
const newsSlides = document.querySelectorAll('.news-item');
const totalNewsSlides = newsSlides.length;
const prevNewsButton = document.getElementById('prevNewsSlide');
const nextNewsButton = document.getElementById('nextNewsSlide');

// Clone news items for infinite loop effect
if (newsTrack && newsSlides.length > 0) {
    const clonedSlides = Array.from(newsSlides).map(slide => slide.cloneNode(true));
    clonedSlides.forEach(clone => newsTrack.appendChild(clone));
}

function getNewsItemsPerView() {
    const width = window.innerWidth;
    if (width <= 768) return 1;  // Mobile: 1 item at a time
    return 3;  // Desktop: 3 items at a time
}

function updateNewsCarousel(smooth = true) {
    if (!newsTrack) return;
    if (newsSlides.length === 0) return;

    const itemsPerView = getNewsItemsPerView();

    // Calculate actual pixel width of one slide including gap
    const firstSlide = newsSlides[0];
    const slideWidth = firstSlide.offsetWidth;

    // Get gap from computed style
    const trackStyle = window.getComputedStyle(newsTrack);
    const gap = parseFloat(trackStyle.gap) || 0;

    // Total distance to move per slide (width + gap)
    const slideDistance = slideWidth + gap;
    const offset = -currentNewsSlide * slideDistance;

    // Enable or disable transition
    newsTrack.style.transition = smooth ? 'transform 0.4s ease' : 'none';
    newsTrack.style.transform = `translateX(${offset}px)`;
}

function nextNewsSlide() {
    currentNewsSlide++;
    updateNewsCarousel(true);

    // Reset to beginning when we've gone through all original slides
    if (currentNewsSlide >= totalNewsSlides) {
        setTimeout(() => {
            newsTrack.style.transition = 'none';
            currentNewsSlide = 0;
            newsTrack.style.transform = `translateX(0px)`;

            // Force reflow to ensure the style change takes effect
            void newsTrack.offsetWidth;
        }, 450); // Wait for transition to complete
    }
}

function prevNewsSlide() {
    if (currentNewsSlide === 0) {
        // Jump to the end position without animation
        newsTrack.style.transition = 'none';
        currentNewsSlide = totalNewsSlides;

        // Calculate the exact position
        const firstSlide = newsSlides[0];
        const slideWidth = firstSlide.offsetWidth;
        const trackStyle = window.getComputedStyle(newsTrack);
        const gap = parseFloat(trackStyle.gap) || 0;
        const slideDistance = slideWidth + gap;
        const offset = -currentNewsSlide * slideDistance;

        newsTrack.style.transform = `translateX(${offset}px)`;

        // Force reflow
        void newsTrack.offsetWidth;

        // Then animate to the previous slide
        setTimeout(() => {
            currentNewsSlide--;
            updateNewsCarousel(true);
        }, 20);
    } else {
        currentNewsSlide--;
        updateNewsCarousel(true);
    }
}

if (nextNewsButton && prevNewsButton && newsTrack) {
    nextNewsButton.addEventListener('click', nextNewsSlide);
    prevNewsButton.addEventListener('click', prevNewsSlide);

    // Update carousel on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset to a valid position after resize
            const itemsPerView = getNewsItemsPerView();
            if (currentNewsSlide >= totalNewsSlides) {
                currentNewsSlide = 0;
            }
            updateNewsCarousel(false);
        }, 100);
    });

    // Initialize
    updateNewsCarousel();
}

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

if (lightbox && lightboxImg) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentLightboxIndex = 0;
    const lightboxImages = Array.from(galleryItems).map(item => ({
        fullsize: item.getAttribute('data-fullsize'),
        alt: item.querySelector('img').alt
    }));

    function openLightbox(index) {
        currentLightboxIndex = index;
        lightboxImg.src = lightboxImages[index].fullsize;
        lightboxImg.alt = lightboxImages[index].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        lightboxImg.src = lightboxImages[currentLightboxIndex].fullsize;
        lightboxImg.alt = lightboxImages[currentLightboxIndex].alt;
    }

    function showNextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        lightboxImg.src = lightboxImages[currentLightboxIndex].fullsize;
        lightboxImg.alt = lightboxImages[currentLightboxIndex].alt;
    }

    // Add click event to all gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }

    // Navigation
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
}
