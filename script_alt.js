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
