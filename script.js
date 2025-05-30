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
    const tan30 = Math.tan(30 * Math.PI / 180); // tan(30deg) for skew calculations

    const updateClipPath = (xPos) => {
        const sectionWidth = section.offsetWidth;
        const percentage = (xPos / sectionWidth) * 100;
        const boundedPercentage = Math.max(0, Math.min(100, percentage));
        
        // Calculate x-coordinates for the slanted line at top and bottom
        const xTop = boundedPercentage - (100 - boundedPercentage) * tan30;
        const xBottom = boundedPercentage + boundedPercentage * tan30;

        // Update clip paths to follow the 30-degree skewed line
        rentLayer.style.clipPath = `polygon(${xTop}% 0%, 100% 0%, 100% 100%, ${xBottom}% 100%)`;
        buyLayer.style.clipPath = `polygon(0% 0%, ${xTop}% 0%, ${xBottom}% 100%, 0% 100%)`;
        
        // Move handle to the mouse position
        handle.style.left = `${boundedPercentage}%`;
    };

    // Mouse events: follow mouse without clicking (desktop)
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const xPos = e.clientX - rect.left;
        updateClipPath(xPos);
    });

    // Touch events: require touch to drag (mobile)
    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const rect = section.getBoundingClientRect();
        const xPos = e.touches[0].clientX - rect.left;
        updateClipPath(xPos);
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Initialize clip path at center
    updateClipPath(section.offsetWidth / 2);

    // Update on window resize
    window.addEventListener('resize', () => {
        const currentPercentage = parseFloat(handle.style.left) || 50;
        const newXPos = (currentPercentage / 100) * section.offsetWidth;
        updateClipPath(newXPos);
    });
});
            
