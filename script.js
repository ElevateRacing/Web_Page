let lastScrollTop = 0;
const logos = document.querySelectorAll('.logo');

// Debounce function to limit scroll event frequency
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

  if (currentScroll > lastScrollTop && currentScroll > 50) {
    // Scrolling down and past a small threshold
    logos.forEach(logo => logo.classList.add('logo--shrink'));
  } else if (currentScroll <= lastScrollTop || currentScroll <= 50) {
    // Scrolling up or near the top
    logos.forEach(logo => logo.classList.remove('logo--shrink'));
  }

  lastScrollTop = Math.max(0, currentScroll);
}, 50);

window.addEventListener('scroll', handleScroll);
