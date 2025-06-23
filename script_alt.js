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
        try {
            // Fetch countries from REST Countries API
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Get dropdown elements
            const countrySelect = document.getElementById('country');
            const phonePrefixSelect = document.getElementById('phone-prefix');

            // Check if elements exist
            if (!countrySelect || !phonePrefixSelect) {
                console.error('Dropdown elements not found in the DOM');
                return;
            }

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

        } catch (error) {
            console.error('Error fetching countries:', error);
            const countrySelect = document.getElementById('country');
            const phonePrefixSelect = document.getElementById('phone-prefix');
            if (countrySelect) {
                countrySelect.innerHTML = '<option value="">Error loading countries</option>';
            }
            if (phonePrefixSelect) {
                phonePrefixSelect.innerHTML = '<option value="">Error loading prefixes</option>';
            }
        }
    };

    // Call the function to populate dropdowns
    populateDropdowns();

    // Handle form submission and popup
    const form = document.getElementById('buy-form');
    const popup = document.getElementById('buy-popup');
    const closePopup = document.querySelector('.close-popup');

    if (form && popup && closePopup) {
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
    } else {
        console.error('Form or popup elements not found in the DOM');
    }
});
