let lastScrollTop = 0;
const logos = document.querySelectorAll('.logo');
const menuToggle = document.querySelector('.menu-toggle');
const navButtons = document.querySelector('.nav-buttons');

// Debounce function
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

// Scroll handler
const handleScroll = debounce(() => {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > 50) {
    // Scrolling down or past 50px - shrink logos
    logos.forEach(logo => logo.classList.add('logo--shrink'));
  } else {
    // At top or scrolling up to top - restore logos
    logos.forEach(logo => logo.classList.remove('logo--shrink'));
  }

  lastScrollTop = Math.max(0, currentScroll);
}, 100);

// Menu toggle handler
if (menuToggle && navButtons) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = navButtons.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  });
}

window.addEventListener('scroll', handleScroll);
