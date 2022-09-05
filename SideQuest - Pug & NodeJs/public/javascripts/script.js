/******************** Heroes ********************/
// Sets up spell tables
function setupSpellTables() {
    const spellBar = document.querySelectorAll('.c-spell'); // Get all spell bars
    const dropdownButton = document.querySelectorAll('.c-dropdown-button'); // Get all dropdown buttons
    const spellDescription = document.querySelectorAll('.c-spell-description'); // Get all spell dropdowns
    
    // For all spellBars in document, add an on-click event listener to show/hide spell dropdown
    spellBar.forEach((element, index) => {
        element.addEventListener('click', () => {
            
            // If spell dropdown is hidden, show it. Else, hide it.
            spellDescription[index].style.display === '' || spellDescription[index].style.display === 'none'
                ? spellDescription[index].style.display = 'table-cell'
                : spellDescription[index].style.display = 'none';
            
            
            // If dropdown button points downwards, make it point upwards. Else, make it point downwards
            dropdownButton[index].innerHTML === '∇'
                ? dropdownButton[index].innerHTML = '&Delta;'
                : dropdownButton[index].innerHTML = '&nabla;';
        });
    });
};

// Sets up views/hero racial and class spell dropdowns
function setupSpellTypeTabs() {
    const typeBar = document.querySelectorAll('.js-spelltypetab');  // Get all spell type dropdowns
    const typeSpells = document.querySelectorAll('.js-spelltypespells');    // Get all spell type containers

    // For all spell type dropdowns, add an on-click event listener to show/hide spell type containers
    typeBar.forEach((element, index) => {
        typeSpells[index].style.display = 'none';   // Firstly, hide all spell type containers

        element.addEventListener('click', () => {
            // If spell type container is hidden, show it. Else, hide it.
            typeSpells[index].style.display === '' || typeSpells[index].style.display === 'none'
                ? typeSpells[index].style.display = 'block'
                : typeSpells[index].style.display = 'none';
            
            // If spell type dropdown button points downwards, make it point upwards. Else, make it point downwards
            element.innerHTML.includes('∇')
                ? element.innerHTML = `&Delta; ${element.innerHTML.split(' ')[1]} ${element.innerHTML.split(' ')[2]}`
                : element.innerHTML = `&nabla; ${element.innerHTML.split(' ')[1]} ${element.innerHTML.split(' ')[2]}`;
        });
    });
};

/******************** Edit Heroes ********************/
/********** Tabs **********/
// Sets up hero edit tabs
function setupTabs() {
    // For every tab button, add an on-click event listener
    document.querySelectorAll('.c-tabs__button').forEach(button => {
        button.addEventListener('click', () => {
            const sideBar = button.parentElement;
            const tabsContainer = sideBar.parentElement;
            const tabNumber = button.dataset.forTab;    // Get tab number from clicked tab button

            // Get tab to activate by finding tab content that has the same tab number as clicked tab button
            const tabToActivate = tabsContainer.querySelector(`.c-tabs__content[data-tab='${tabNumber}']`);

            // Change style of all tab buttons to look as unopened tabs
            sideBar.querySelectorAll('.c-tabs__button').forEach(button => {
                const buttonParts = button.children;
                // If button is flag-button, then remove active from both parts of button. Else, just remove it from the
                // square part.
                if(buttonParts.length > 1) {
                    buttonParts[0].classList.remove('c-tabs__button-left--active');
                    buttonParts[1].classList.remove('c-tabs__button-right--active');
                } else {
                    buttonParts[0].classList.remove('c-tabs__button-left--active');
                }
            });
            
            // Deactivate tab content for all tabs
            tabsContainer.querySelectorAll('.c-tabs__content').forEach(tab => {
                tab.classList.remove('c-tabs__content--active');
            });

            // Change style of clicked tab button to look as opened tab
            const buttonParts = button.children;
            if(buttonParts.length > 1) {
                buttonParts[0].classList.add('c-tabs__button-left--active');
                buttonParts[1].classList.add('c-tabs__button-right--active');
            } else {
                buttonParts[0].classList.add('c-tabs__button-left--active');
            }

            // Activate tab content for clicked tab number
            tabToActivate.classList.add('c-tabs__content--active');

        });
    });
};

/********** Functions **********/
// Function to work opposite as 'insertBefore()' (used in displayClass())
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
};

/******************** Spells ********************/
// Sets up modals
function setupModals() {
    // Get all modal buttons and add an on-click event listener to activate clicked modal and deactivate the others.
    document.querySelectorAll('.js-modalbutton').forEach(button => {
        button.addEventListener('click', () => {
            const buttonNumber = button.dataset.forModal;   // Get button number for modal button clicked
            const modals = document.querySelectorAll('.c-modalbg'); // Get all modals
            const modalToActivate = document.querySelector(`.c-modalbg[data-modal='${buttonNumber}']`); // Get modal based on clicked modal button number

            // Hide all modals
            modals.forEach(modal => modal.classList.remove('c-modalbg--active'));

            // Activate selected modal
            modalToActivate.classList.add('c-modalbg--active');
        });
    });

    // Get all close modal buttons and add an on-click event listener to close current active modal.
    document.querySelectorAll('.js-closemodal').forEach(button => {
        button.addEventListener('click', () => {
            const buttonNumber = button.dataset.closeModal; // Get button number for close modal button clicked
            const modalToClose = document.querySelector(`.c-modalbg[data-modal='${buttonNumber}']`);    // Get modal based on close modal button number clicked

            // If modal has a spell form and/or save changes button active, hide them.
            if(document.querySelector('#js-spellform') != null) document.querySelector('#js-spellform').style.display = 'none';
            if(document.querySelector('#save_changes') != null) document.querySelector('#save_changes').style.display = 'none';

            // Hide modal
            modalToClose.classList.remove('c-modalbg--active');
        });
    });

    // If user clicks outside modal window, close current active modal.
    window.addEventListener('click', e => {
        document.querySelectorAll('.c-modalbg').forEach(modal => {
            if(e.target == modal) {
                if(document.querySelector('#js-spellform') != null) document.querySelector('#js-spellform').style.display = 'none';
                if(document.querySelector('#save_changes') != null) document.querySelector('#save_changes').style.display = 'none';
                
                modal.classList.remove('c-modalbg--active');
            }
        });
    });
};

// Loads spell onto edit modal
function loadSpell(spells) {
    const spellSelect = document.getElementById('js-search_spell'); // Get spell select
    const spellInfo = spellSelect.options[spellSelect.selectedIndex].value.split(',');  // Get selected spell from spell select

    let spellLookup = [];
    let spell = {};
    
    // If no spell was selected, exit function
    if(spellInfo.length != 2) return;

    document.querySelector('#js-spellform').style.display = 'block';    // Show spell form
    document.querySelector('#save_changes').style.display = 'inline-block'; // Show save changes button

    spellLookup = spells[parseInt(spellInfo[0])];    // Get all spells that match the selected spell's level

    // Find spell in selectLookup array and save it to spell variable
    for(let i = 0; i < spellLookup.length; i++) {
        if(spellInfo[1] == spellLookup[i]._id) spell = spellLookup[i];
    }

    // Fill in hidden spell id input with spell id
    const idField = document.getElementById('spell_id');
    idField.value = spell._id;

    // Fill in spell name
    const name = document.getElementById('name');
    name.value = spell.name;

    // Fill in spell level
    const level = document.getElementById('level');
    level.selectedIndex = spell.level;

    // Select correct spell school
    const school = document.getElementById('school');
    let schIdx = -1;
    switch(spell.school) {
        case 'Abjuration':
            schIdx = 1;
            break;
        case 'Conjuration':
            schIdx = 2;
            break;
        case 'Divination':
            schIdx = 3;
            break;
        case 'Enchantment':
            schIdx = 4;
            break;
        case 'Evocation':
            schIdx = 5;
            break;
        case 'Illusion':
            schIdx = 6;
            break;
        case 'Necromancy':
            schIdx = 7;
            break;
        case 'Transmutation':
            schIdx = 8;
            break;
        default:
            break;
    }
    school.selectedIndex = `${schIdx}`;

    // Fill in spell ritual select
    const ritual = document.getElementById('ritual');
    let ritIdx = -1;
    spell.ritual
        ? ritIdx = 1
        : ritIdx = 0;
    ritual.selectedIndex = `${ritIdx}`;
    
    // Fill in spell concentration select
    const concentration = document.getElementById('concentration');
    let concIdx = -1;
    spell.ritual
        ? concIdx = 1
        : concIdx = 0;
    concentration.selectedIndex = `${concIdx}`;
    
    // Fill in spell casting time
    const castingTime = document.getElementById('casting_time');
    castingTime.value = spell.casting_time;

    // Fill in spell range
    const range = document.getElementById('range');
    range.value = spell.range;
    
    // Check correct spell components
    const vComp = document.getElementById('components.verbal');
    const sComp = document.getElementById('components.somatic');
    const mComp = document.getElementById('components.material');
    let vFlag = false, sFlag = false, mFlag = false;
    for(let i = 0; i < spell.components.length; i++) {
        if(spell.components[i] === 'V') vFlag = true;
        if(spell.components[i] === 'S') sFlag = true;
        if(spell.components[i] === 'M') mFlag = true;
    }
    vComp.checked = vFlag;
    sComp.checked = sFlag;
    mComp.checked = mFlag;
    
    // Fill in spell materials
    const materials = document.getElementById('materials');
    materials.value = spell.materials || '';
    
    // Fill in spell duration
    const duration = document.getElementById('duration');
    duration.value = spell.duration;
    
    // Fill in spell description
    const description = document.getElementById('description');
    description.value = spell.description;
};

/******************** DM Notes ********************/
// Sets up loaded results table dropdowns
/*
function setupLoadedResult() {
    const spellBar = document.querySelectorAll('.js-loadedresult'); // Get all spell bars
    const dropdownButton = document.querySelectorAll('.js-loadedresult--button'); // Get all dropdown buttons
    const spellDescriptionWrapper = document.querySelectorAll('.js-loadedresult--description'); // Get all spell dropdowns
    const spellDescription = [];
    spellDescriptionWrapper.forEach(wrapper => spellDescription.push(wrapper.children[0]));
    
    // For all spellBars in document, add an on-click event listener to show/hide spell dropdown
    spellBar.forEach((element, index) => {
        element.addEventListener('click', () => {
            
            // If spell dropdown is hidden, show it. Else, hide it.
            spellDescription[index].style.display === '' || spellDescription[index].style.display === 'none'
                ? spellDescription[index].style.display = 'table-cell'
                : spellDescription[index].style.display = 'none';
            
            
            // If dropdown button points downwards, make it point upwards. Else, make it point downwards
            dropdownButton[index].innerHTML === '∇'
                ? dropdownButton[index].innerHTML = '&Delta;'
                : dropdownButton[index].innerHTML = '&nabla;';
        });
        
        // element.classList.remove('js-loadedresult');
    });

    // dropdownButton.forEach(element => element.classList.remove('js-loadedresult--button'));
    // spellDescriptionWrapper.forEach(element => element.classList.remove('js-loadedresult--description'));
};
*/