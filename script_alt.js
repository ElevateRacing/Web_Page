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

    // Function to get skew angle based on device
    const getSkewAngle = () => {
        const isMobile = mediaQueries.mobile.matches || mediaQueries.smallMobile.matches;
        return isMobile ? 5 : 30; // 5deg for mobile, 30deg for desktop
    };

    const updateClipPath = (xPos) => {
        const sectionWidth = section.offsetWidth;
        const sectionHeight = section.offsetHeight;
        let percentage = Math.max(0, Math.min(100, (xPos / sectionWidth) * 100));

        // Apply boundaries based on media query
        if (mediaQueries.largeDesktop.matches || mediaQueries.desktop.matches) {
            percentage = Math.max(30, Math.min(80, percentage));
        } else if (mediaQueries.tablet.matches) {
            percentage = Math.max(30, Math.min(80, percentage));
        } else if (mediaQueries.mobile.matches || mediaQueries.smallMobile.matches) {
            percentage = Math.max(10, Math.min(90, percentage));
        }

        currentPercentage = percentage; // Update current position
        
        // Calculate skew and offset
        const skewAngle = getSkewAngle();
        const tanSkew = Math.tan(skewAngle * Math.PI / 180);
        const offset = (sectionHeight / sectionWidth) * 100 * tanSkew / 2;
        const xTop = percentage - offset;
        const xBottom = percentage + offset;

        // Update clip paths to align with handle's skew
        rentLayer.style.clipPath = `polygon(${xTop}% 0%, 100% 0%, 100% 100%, ${xBottom}% 100%)`;
        buyLayer.style.clipPath = `polygon(0% 0%, ${xTop}% 0%, ${xBottom}% 100%, 0% 100%)`;
        
        // Move handle to match the percentage
        handle.style.left = `${percentage}%`;
    };

    // Mouse events: follow mouse without clicking (desktop)
    section.addEventListener('mousemove', (e) => {
        if (isDragging) return; // Prevent mouse movement during touch drag
        const isMobile = mediaQueries.mobile.matches || mediaQueries.smallMobile.matches;
        if (isMobile) return; // Skip mouse events on mobile
        const rect = section.getBoundingClientRect();
        const xPos = e.clientX - rect.left;
        updateClipPath(xPos);
    });

    // Mouse down to enable dragging on desktop
    section.addEventListener('mousedown', (e) => {
        const isMobile = mediaQueries.mobile.matches || mediaQueries.smallMobile.matches;
        if (isMobile) return; // Skip mouse events on mobile
        isDragging = true;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
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
    });

    section.addEventListener('touchend', () => {
        isDragging = false;
        isHorizontal = false;
    });

    // Handle resize and orientation change
    const handleResizeOrOrientation = () => {
        const newXPos = (currentPercentage / 100) * section.offsetWidth;
        updateClipPath(newXPos);
    };

    // Initialize clip path at center
    updateClipPath(section.offsetWidth / 2);

    // Add event listeners for resize and orientation change
    window.addEventListener('resize', handleResizeOrOrientation);
    window.addEventListener('orientationchange', handleResizeOrOrientation);
});

//POPUP SCRIPT
document.addEventListener('DOMContentLoaded', () => {
    // Fetch countries for dropdowns
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            const countrySelect = document.getElementById('country');
            const phonePrefixSelect = document.getElementById('phone-prefix');

            // Sort countries alphabetically
            data.sort((a, b) => a.name.common.localeCompare(b.name.common));

            // Populate country dropdown
            countrySelect.innerHTML = '<option value="">Select Country</option>';
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                countrySelect.appendChild(option);
            });

            // Populate phone prefix dropdown
            phonePrefixSelect.innerHTML = '<option value="">Select Prefix</option>';
            data.forEach(country => {
                if (country.idd && country.idd.root) {
                    const prefix = `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''}`;
                    const option = document.createElement('option');
                    option.value = prefix;
                    option.textContent = `${country.name.common} (${prefix})`;
                    phonePrefixSelect.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching countries:', error);
            document.getElementById('country').innerHTML = '<option value="">Error loading countries</option>';
            document.getElementById('phone-prefix').innerHTML = '<option value="">Error loading prefixes</option>';
        });

    // Handle form submission and popup
    const form = document.getElementById('buy-form');
    const popup = document.getElementById('buy-popup');
    const closePopup = document.querySelector('.close-popup');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission for demo
        popup.style.display = 'flex'; // Show popup
        // Uncomment below to actually submit the form via Formspree
        // form.submit();
    });

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none'; // Hide popup
    });

    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });
});
