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

// Function to populate dropdowns (common to both pages)
    const populateDropdowns = async () => {
        const countrySelects = document.querySelectorAll('#country');
        const phonePrefixSelects = document.querySelectorAll('#phone-prefix');

        // Debugging logs
        console.log('Detected country dropdowns:', countrySelects.length);
        console.log('Detected phone-prefix dropdowns:', phonePrefixSelects.length);

        // Check if at least one phone-prefix dropdown exists
        if (phonePrefixSelects.length === 0) {
            console.error('No phone-prefix dropdowns found');
            return;
        }

        // Initialize loading state
        phonePrefixSelects.forEach(select => {
            select.innerHTML = '<option value="">Loading prefixes...</option>';
        });
        if (countrySelects.length > 0) {
            countrySelects.forEach(select => {
                select.innerHTML = '<option value="">Loading countries...</option>';
            });
        }

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

            // Populate country dropdowns if present
            if (countrySelects.length > 0) {
                countrySelects.forEach(select => {
                    select.innerHTML = '<option value="">Select Country</option>';
                    data.forEach(country => {
                        const option = document.createElement('option');
                        option.value = country.name.common;
                        option.textContent = country.name.common;
                        select.appendChild(option);
                    });
                });
            }

            // Populate phone prefix dropdowns
            phonePrefixSelects.forEach(select => {
                select.innerHTML = '<option value="">Select Prefix</option>';
                data.forEach(country => {
                    if (country.idd && country.idd.root && country.idd.suffixes && country.idd.suffixes.length > 0) {
                        const prefix = `${country.idd.root}${country.idd.suffixes[0]}`;
                        const option = document.createElement('option');
                        option.value = prefix;
                        option.textContent = `${country.name.common} (${prefix})`;
                        select.appendChild(option);
                    }
                });
            });

        } catch (error) {
            console.error('Error fetching countries:', error.message);
            if (countrySelects.length > 0) {
                countrySelects.forEach(select => {
                    select.innerHTML = '<option value="">Failed to load countries</option>';
                });
            }
            phonePrefixSelects.forEach(select => {
                select.innerHTML = '<option value="">Failed to load prefixes</option>';
            });
        }
    };

    // Call the function to populate dropdowns
    populateDropdowns();

    // Function to handle form submission and popup
    const setupFormHandler = (formId, popupId) => {
        const form = document.getElementById(formId);
        const popup = document.getElementById(popupId);
        const closePopup = popup ? popup.querySelector('.close-popup') : null;

        if (form && popup && closePopup) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Combine phone prefix and phone number
                const phonePrefix = form.querySelector('#phone-prefix').value;
                const phoneNumber = form.querySelector('#phone').value;
                const fullPhoneNumber = phonePrefix ? `${phonePrefix}${phoneNumber}` : phoneNumber;

                // Create a hidden input for the full phone number
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'full-phone-number';
                hiddenInput.value = fullPhoneNumber;
                form.appendChild(hiddenInput);

                // Show popup
                popup.style.display = 'flex';

                // Submit form to Formspree (uncomment to enable)
                // form.submit();
            });

            closePopup.addEventListener('click', () => {
                popup.style.display = 'none';
            });

            // Close popup when clicking outside
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.style.display = 'none';
                }
            });
        } else {
            console.error(`Form or popup elements not found: ${formId}, ${popupId}, or close-popup`);
        }
    };

    // Initialize form handlers for both pages
    if (document.getElementById('book-form')) {
        setupFormHandler('book-form', 'book-popup');
    }
    if (document.getElementById('buy-form')) {
        setupFormHandler('buy-form', 'buy-popup');
    }
});
