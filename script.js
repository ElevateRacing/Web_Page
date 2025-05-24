let lastScrollTop = 0;
const logoImages = document.querySelectorAll('.logo_image'); // Target the images directly

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
  
  if (currentScroll > lastScrollTop && currentScroll > 50) {
    // Scrolling down - apply transform directly to images
    logoImages.forEach(img => img.style.transform = 'scale(0.8)');
  } else if (currentScroll <= lastScrollTop || currentScroll <= 50) {
    // Scrolling up - reset transform
    logoImages.forEach(img => img.style.transform = 'scale(1)');
  }
  
  lastScrollTop = Math.max(0, currentScroll);
}, 50);

window.addEventListener('scroll', handleScroll);
