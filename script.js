// Logo Shrinkage Script //
window.addEventListener('scroll', () => {
            const navbox = document.querySelector('.navbar');
            const logo2 = document.querySelector('.logo2');
            const logo1 = document.querySelector('.logo1');
            if (window.scrollY > 50) {
                logo2.classList.add('shrink');
                logo1.classList.add('shrink');
                navbox.classList.add('scrolled');
            } else {
                logo2.classList.remove('shrink');
                logo1.classList.remove('shrink');
                navbox.classList.remove('scrolled');
            }
        });

// Split Screen Slider Script //
document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.section_page5');
    
    if (!section) {
        console.error('Error: Element with class "section_page5" not found in the DOM.');
        return;
    }

    const handle = section.querySelector('.handle');
    const rentLayer = section.querySelector('.layer.rent');
    const buyLayer = section.querySelector('.layer.buy');
    
    if (!handle || !rentLayer || !buyLayer) {
        console.error('Error: One or more required elements (.handle, .layer.rent, .layer.buy) not found.');
        return;
    }

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let isHorizontal = false;
    let currentPercentage = 50; // Track handle position as percentage

    // Define media queries
    const mediaQueries = {
        largeDesktop: window.matchMedia("(min-width: 1367px)"),
        desktop: window.matchMedia("(min-width: 1281px) and (max-width: 1366px)"),
        tablet: window.matchMedia("(min-width: 768px) and (max-width: 1280px)"),
        mobile: window.matchMedia("(min-width: 321px) and (max-width: 767px)"),
        smallMobile: window.matchMedia("(max-width: 380px)")
    };

    // Determine skew angle based on device
    const isMobile = mediaQueries.mobile.matches || mediaQueries.smallMobile.matches;
    const skewAngle = isMobile ? 10 : 30; // 10deg for mobile, 30deg for desktop
    const tanSkew = Math.tan(skewAngle * Math.PI / 180); // tan(10deg) ≈ 0.176, tan(30deg) ≈ 0.577

    const updateClipPath = (xPos) => {
        const sectionWidth = section.offsetWidth;
        const sectionHeight = section.offsetHeight;
        let percentage = (xPos / sectionWidth) * 100;

        // Apply boundaries based on media query
        if (mediaQueries.largeDesktop.matches || mediaQueries.desktop.matches) {
            // Desktops: 30% from left, 20% from right (30% to 80%)
            percentage = Math.max(30, Math.min(80, percentage));
        } else if (mediaQueries.tablet.matches) {
            // Tablet: 15% from each edge (15% to 85%)
            percentage = Math.max(15, Math.min(85, percentage));
        } else if (mediaQueries.mobile.matches || mediaQueries.smallMobile.matches) {
            // Mobile: 10% from each edge (10% to 90%)
            percentage = Math.max(10, Math.min(90, percentage));
        }

        currentPercentage = percentage; // Update current position
        
        // Calculate x-offset for skew, adjusted for aspect ratio
        const offset = (sectionHeight / sectionWidth) * 100 * tanSkew / 2;
        const xTop = percentage - offset;
        const xBottom = percentage + offset;

        // Update clip paths to align with handle's skew
        rentLayer.style.clipPath = `polygon(${xTop}% 0%, 100% 0%, 100% 100%, ${xBottom}% 100%)`;
        buyLayer.style.clipPath = `polygon(0% 0%, ${xTop}% 0%, ${xBottom}% 100%, 0% 100%)`;
        
        // Move handle to mouse/touch position
        handle.style.left = `${percentage}%`;
    };

    // Mouse events: follow mouse without clicking (desktop)
    section.addEventListener('mousemove', (e) => {
        if (mediaQueries.mobile.matches || mediaQueries.smallMobile.matches) return; // Skip mouse events on mobile
        const rect = section.getBoundingClientRect();
        const xPos = e.clientX - rect.left;
        updateClipPath(xPos);
    });

    // Touch events: move handle only when sliding (mobile)
    section.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isHorizontal = false; // Reset direction detection
    });

    section.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);

        // Determine primary direction (horizontal or vertical)
        if (!isHorizontal && (deltaX > deltaY || deltaX > 10)) {
            isHorizontal = true; // Lock to horizontal movement
        }

        if (isHorizontal) {
            e.preventDefault(); // Prevent scrolling for horizontal movement
            const rect = section.getBoundingClientRect();
            const xPos = currentX - rect.left;
            updateClipPath(xPos);
        }
        // Vertical movement allows default scrolling (no e.preventDefault)
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
        isHorizontal = false;
    });

    // Initialize clip path at center
    updateClipPath(section.offsetWidth / 2);

    // Update on window resize
    window.addEventListener('resize', () => {
        const newXPos = (currentPercentage / 100) * section.offsetWidth;
        updateClipPath(newXPos);
    });
});



            
            
   
