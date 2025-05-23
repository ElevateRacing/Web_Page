let lastScrollTop = 0;
const logos = document.querySelectorAll('.logo'); // Still select the logo containers
const navbar = document.querySelector('.navbar'); // Not used in current logic, but kept

window.addEventListener('scroll', () => {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  // We apply the shrink class to the logo container, and CSS targets the image within it
  if (currentScroll > lastScrollTop) {
    // Scrolling down
    logos.forEach(logo => logo.classList.add('logo--shrink'));
  } else {
    // Scrolling up, but only if not at the very top (to avoid jumpiness)
    if (currentScroll < lastScrollTop || currentScroll <= 0) { // Condition to remove shrink
      logos.forEach(logo => logo.classList.remove('logo--shrink'));
    }
  }
  // Update lastScrollTop, ensuring it doesn't go negative
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});
