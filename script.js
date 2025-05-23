let lastScrollTop = 0;
const logos = document.querySelectorAll('.logo');
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // Scrolling down
    logos.forEach(logo => logo.classList.add('logo--shrink'));
  } else {
    // Scrolling up
    logos.forEach(logo => logo.classList.remove('logo--shrink'));
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// Ensure logos have the same width
function syncLogoWidths() {
  const logo1 = document.querySelector('.logo1 .logo_image');
  const logo2 = document.querySelector('.logo2 .logo_image');
  if (logo1 && logo2) {
    const width = Math.min(logo1.naturalWidth, logo2.naturalWidth);
    logo1.style.width = `${width}px`;
    logo2.style.width = `${width}px`;
  }
}

window.addEventListener('load', syncLogoWidths);
window.addEventListener('resize', syncLogoWidths);
