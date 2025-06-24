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

// Function to populate dropdowns for a given form
const populateDropdownsForForm = async (formElement) => {
    const countrySelect = formElement.querySelector('#country');
    const phonePrefixSelect = formElement.querySelector('#phone-prefix');

    // Check if dropdowns exist within this specific form
    if (!phonePrefixSelect) {
        console.error('No phone-prefix dropdown found within the provided form element.');
        return;
    }

    // Initialize loading state
    phonePrefixSelect.innerHTML = '<option value="">Loading prefixes...</option>';
    if (countrySelect) {
        countrySelect.innerHTML = '<option value="">Loading countries...</option>';
    }

    try {
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
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        // Populate country dropdown if present
        if (countrySelect) {
            countrySelect.innerHTML = '<option value="">Select Country</option>';
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                countrySelect.appendChild(option);
            });
        }

        // Populate phone prefix dropdown
        phonePrefixSelect.innerHTML = '<option value="">Select Prefix</option>';
        data.forEach(country => {
            if (country.idd && country.idd.root && country.idd.suffixes && country.idd.suffixes.length > 0) {
                const prefix = `<span class="math-inline">\{country\.idd\.root\}</span>{country.idd.suffixes[0]}`;
                const option = document.createElement('option');
                option.value = prefix;
                option.textContent = `<span class="math-inline">\{country\.name\.common\} \(</span>{prefix})`;
                phonePrefixSelect.appendChild(option);
            }
        });

    } catch (error) {
        console.error('Error fetching countries:', error.message);
        if (countrySelect) {
            countrySelect.innerHTML = '<option value="">Failed to load countries</option>';
        }
        phonePrefixSelect.innerHTML = '<option value="">Failed to load prefixes</option>';
    }
};

// Call the function to populate dropdowns for each form
document.addEventListener('DOMContentLoaded', () => { // Ensure DOM is loaded
    const bookForm = document.getElementById('book-form');
    const buyForm = document.getElementById('buy-form');

    if (bookForm) {
        populateDropdownsForForm(bookForm);
    }
    if (buyForm) {
        populateDropdownsForForm(buyForm);
    }

    // Function to handle form submission and popup
    const setupFormHandler = (formId, popupId) => {
        const form = document.getElementById(formId);
        // const popup = document.getElementById(popupId); // No longer needed for popup
        // const closePopup = popup ? popup.querySelector('.close-popup') : null; // No longer needed for popup

        if (form) { // Check only for form existence, as popup is removed
            form.addEventListener('submit', (e) => {
                // e.preventDefault(); // Keep preventDefault if you're not submitting to Formspree directly for testing

                // Combine phone prefix and phone number
                const phonePrefix = form.querySelector('#phone-prefix').value;
                const phoneNumber = form.querySelector('#phone').value;
                const fullPhoneNumber = phonePrefix ? `<span class="math-inline">\{phonePrefix\}</span>{phoneNumber}` : phoneNumber;

                // Create a hidden input for the full phone number
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'full-phone-number';
                hiddenInput.value = fullPhoneNumber;
                form.appendChild(hiddenInput);

                // If you want to actually submit the form to Formspree, uncomment the next line:
                form.submit();
            });

        } else {
            console.error(`Form element not found: ${formId}`);
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
