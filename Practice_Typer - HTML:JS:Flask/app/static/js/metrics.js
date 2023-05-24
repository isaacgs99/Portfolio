
function handleLanguageSelect() {
    const languageSelect = document.getElementById('language-select');

    // Get the query parameter value from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedValue = urlParams.get('pLanguage');

    // Define the options array with the default order
    const options = [
        { value: '', text: '--Please choose an option--' },
        { value: 'Python', text: 'Python' },
        { value: 'Javascript', text: 'Javascript' },
        { value: 'Java', text: 'Java' },
    ];

    // Check if the query parameter value matches an option value
    const selectedOption = options.find(option => option.value === selectedValue);
    if (selectedOption) {
        // Move the selected option to the top of the array
        const index = options.indexOf(selectedOption);
        options.splice(index, 1);
        options.unshift(selectedOption);
    }

    // Create the options HTML string
    const optionsHtml = options.map(option => `<option value="${option.value}">${option.text}</option>`).join('');

    // Update the select element with the new options
    languageSelect.innerHTML = optionsHtml;

    // Set the selected value, if applicable
    if (selectedValue) {
        languageSelect.value = selectedValue;
    }

    // Add the event listener
    languageSelect.addEventListener('change', () => {
        const selectedValue = languageSelect.value;
        const url = `/dash/metrics?pLanguage=${selectedValue}`;
        window.location.href = url;
    });
}

// Call the function when the page loads
window.addEventListener('load', handleLanguageSelect);


