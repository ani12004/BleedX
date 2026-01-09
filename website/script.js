// Tilt Effect for Cards
const cards = document.querySelectorAll('.feature-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'none'; // Clean reset
    });
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Intersection Observer for Stats & Section Animations
const observerOptions = { threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Stats Trigger
            if (entry.target.classList.contains('stats') && !entry.target.dataset.animated) {
                animateCounters();
                entry.target.dataset.animated = "true";
            }
            // Section Entry Animation
            if (entry.target.classList.contains('section-enter')) {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

// Observe Stats if they exist
const statsSection = document.querySelector('.stats');
if (statsSection) {
    observer.observe(statsSection);
}

// Observe All Sections for Entry Animation
document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-enter');
    observer.observe(section);
});

// Smooth Scroll for Anchor Links
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

const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.cmd-cat-pill');
const commandCards = document.querySelectorAll('.cmd-card-ref');

// Active filter state
let currentFilter = 'all';

// Filter by Category
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update UI
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update Filter State
            currentFilter = btn.getAttribute('data-cat');
            applyFilters();
        });
    });
}

// Search Commands
if (searchInput) {
    searchInput.addEventListener('input', () => {
        applyFilters();
    });
}

function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    commandCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const name = card.querySelector('.cmd-card-title') ? card.querySelector('.cmd-card-title').innerText.toLowerCase() : '';
        const desc = card.querySelector('.cmd-card-desc') ? card.querySelector('.cmd-card-desc').innerText.toLowerCase() : '';

        // Check Category Match
        const categoryMatch = (currentFilter === 'all' || category === currentFilter);

        // Check Search Match
        const searchMatch = (name.includes(searchTerm) || desc.includes(searchTerm));

        if (categoryMatch && searchMatch) {
            card.style.display = 'flex'; // Or 'block', assuming flex from CSS
        } else {
            card.style.display = 'none';
        }
    });
}
