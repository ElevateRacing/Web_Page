// buy.js

// Logo Shrinkage Script (common to both pages)
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

// Function to populate dropdowns for a specific form
const populateDropdownsForForm = async (formElement) => {
    const countrySelect = formElement.querySelector('#country');
    const phonePrefixSelect = formElement.querySelector('#phone-prefix');

    if (!phonePrefixSelect) {
        console.error('No phone-prefix dropdown found within the provided form element for populateDropdownsForForm.');
        return;
    }

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

        if (countrySelect) {
            countrySelect.innerHTML = '<option value="">Select Country</option>';
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                countrySelect.appendChild(option);
            });
        }

        phonePrefixSelect.innerHTML = '<option value="">Select Prefix</option>';
        data.forEach(country => {
            if (country.idd && country.idd.root && country.idd.suffixes && country.idd.suffixes.length > 0) {
                const prefix = `${country.idd.root}${country.idd.suffixes[0]}`;
                const option = document.createElement('option');
                option.value = prefix;
                option.textContent = `${country.name.common} (${prefix})`;
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

// Function to handle form submission (no popup)
const setupFormHandler = (formId) => { // Removed popupId as popup is gone
    const form = document.getElementById(formId);

    if (form) {
        form.addEventListener('submit', (e) => {
            // e.preventDefault(); // Uncomment if you want to prevent default form submission for testing

            const phonePrefix = form.querySelector('#phone-prefix').value;
            const phoneNumber = form.querySelector('#phone').value;
            const fullPhoneNumber = phonePrefix ? `${phonePrefix}${phoneNumber}` : phoneNumber;

            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'full-phone-number';
            hiddenInput.value = fullPhoneNumber;
            form.appendChild(hiddenInput);

            // This will actually submit the form to Formspree
            form.submit();
        });
    } else {
        console.error(`Form element not found: ${formId}`);
    }
};

// Initialize only for the buy-form on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const buyForm = document.getElementById('buy-form');
    if (buyForm) {
        populateDropdownsForForm(buyForm);
        setupFormHandler('buy-form'); // Pass only formId
    }
});
