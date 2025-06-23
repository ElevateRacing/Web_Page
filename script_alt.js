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

// Dropdown and Popup Script
document.addEventListener('DOMContentLoaded', () => {
    // Function to populate dropdowns
    const populateDropdowns = async () => {
        const countrySelect = document.getElementById('country');
        const phonePrefixSelect = document.getElementById('phone-prefix');

        // Check if elements exist
        if (!countrySelect || !phonePrefixSelect) {
            console.error('Dropdown elements not found: country or phone-prefix');
            return;
        }

        // Initialize loading state
        countrySelect.innerHTML = '<option value="">Loading countries...</option>';
        phonePrefixSelect.innerHTML = '<option value="">Loading prefixes...</option>';

        try {
            // Fetch countries with specific fields
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API data sample:', data.slice(0, 3)); // Debug: Log first 3 countries

            // Sort countries alphabetically by common name
            data.sort((a, b) => a.name.common.localeCompare(b.name.common));

            // Populate country dropdown
            countrySelect.innerHTML = '<option value="">Select Country</option>';
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                countrySelect.appendChild(option);
            });

            // Populate phone prefix dropdown with flag images
            phonePrefixSelect.innerHTML = '<option value="">Select Prefix</option>';
            data.forEach(country => {
                if (country.idd && country.idd.root && country.idd.suffixes && country.idd.suffixes.length > 0) {
                    const prefix = `${country.idd.root}${country.idd.suffixes[0]}`;
                    const cca2 = country.cca2.toLowerCase(); // Lowercase for flag URL
                    const flagUrl = `https://flagcdn.com/16x12/${cca2}.png`;
                    const option = document.createElement('option');
                    option.value = prefix; // Only prefix number for form
                    option.textContent = `${country.name.common} (${prefix})`;
                    option.setAttribute('data-flag', flagUrl);
                    phonePrefixSelect.appendChild(option);
                    console.log(`Added prefix option: ${prefix}, flag: ${flagUrl}`); // Debugging
                }
            });

            // Apply flag images to dropdown options
            const options = phonePrefixSelect.querySelectorAll('option:not([value=""])');
            options.forEach((option, index) => {
                const flagUrl = option.getAttribute('data-flag');
                if (flagUrl) {
                    const img = document.createElement('img');
                    img.src = flagUrl;
                    img.alt = 'Flag';
                    img.className = 'flag-icon';
                    img.onerror = () => {
                        console.error(`Failed to load flag: ${flagUrl}`); // Debug
                        img.src = 'https://via.placeholder.com/16x12?text=?'; // Fallback
                    };
                    option.innerHTML = `<span class="flag-wrapper">${img.outerHTML} ${option.textContent}</span>`;
                    console.log(`Applied flag for option ${index + 1}: ${flagUrl}`); // Debugging
                }
            });

            // Log if no prefixes were added
            if (phonePrefixSelect.options.length <= 1) {
                console.warn('No valid phone prefixes found in API response. Check idd data.');
            }

        } catch (error) {
            console.error('Error fetching countries:', error.message);
            countrySelect.innerHTML = '<option value="">Failed to load countries</option>';
            phonePrefixSelect.innerHTML = '<option value="">Failed to load prefixes</option>';
        }
    };

    // Call the function to populate dropdowns
    populateDropdowns();

    // Handle form submission and popup
    const form = document.getElementById('buy-form');
    const popup = document.getElementById('buy_popup');
    const closePopup = document.querySelector('.close-popup');

    if (form && popup && closePopup) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission for demo
            popup.style.display = 'flex'; // Show popup
            // Uncomment below to test Formspree submission
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
    } else {
        console.error('Form or popup elements not found buy_form, buy_popup, or close_popup');
    }
});
