// NAVIGATION TOGGLE
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
  function toggleMenu() {
    navMenu.classList.toggle('show');
    navToggle.classList.toggle('active');
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
  }

  navToggle.addEventListener('click', toggleMenu);
  navToggle.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  document.addEventListener('click', e => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// RESOURCE FILTER (only on resources page)
const filterSelect = document.getElementById('resourceFilter');
if (filterSelect) {
  const sections = document.querySelectorAll('.resource-section');
  filterSelect.addEventListener('change', () => {
    const value = filterSelect.value;
    sections.forEach(section => {
      const category = section.getAttribute('data-category');
      section.style.display = (value === 'all' || value === category) ? '' : 'none';
    });
  });
}

// CONTACT FORM (only on contact page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('successMsg').textContent = "✅ Thank you! Your message has been sent successfully.";
    this.reset();
  });
}
