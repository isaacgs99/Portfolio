/******************** Edit Heroes ********************/
/********** Race & Class **********/
// Displays race description and updates ability racial bonuses accordingly
function raceUpdate(races, option) {
    displayRace(races, option);
    abilitiesTab(races);
};

// Displays race description depending on dropdown
function displayRace(races, option) {
    const raceSelect = document.getElementById('search_race');  // Get race select
    const raceIndex = raceSelect.options[raceSelect.selectedIndex].value.split(',')[0]; // Get selected race index

    const descContainer = document.querySelector('#race-description');  // Get race description container
    const descChildren = descContainer.children;    // Get array of race description container elements

    // If no race is selected, hide the race description container
    if(raceIndex == -1) {
        descContainer.style.display = 'none';
        return;
    }

    const race = races[raceIndex];  // Select race depending on raceSelect chosen index

    if(option != 'load') raceLanguages(race.languages); // For updating racial language
    
    // Show race description container
    descContainer.style.display = 'block';
    
    descChildren[0].innerHTML = race.name;  // Set race name
    descChildren[1].innerHTML = race.description;   // Set race description
    descChildren[2].querySelector('span').innerHTML = race.alignment;   // Set race alignment
    descChildren[3].querySelector('span').innerHTML = `${race.speed} ft`    // Set race speed
    descChildren[4].querySelector('span').innerHTML = race.size;    // Set race size
    descChildren[5].querySelector('span').innerHTML = race.languages;   // Set race languages

    // Construct ability score improvements string
    let abilityString = '';
    if(race.ability_increase.length != 0) {
        race.ability_increase.forEach(ability => {
            ability.increase >= 0
                ? abilityString += `+${ability.increase} `
                : abilityString += `${ability.increase} `
            abilityString += ability.name[0].toUpperCase()
            abilityString += `${ability.name.substring(1)}, `
        });
        abilityString = abilityString.substring(0, abilityString.length-2);
    }
    descChildren[6].querySelector('span').innerHTML = abilityString;    // Set race ability score improvements

    // descChildren[9].innerHTML = race.traits.replace(/(\r\n|\r|\n)/g, '<br>');   // Set race traits
    descChildren[9].innerHTML = race.traits;   // Set race traits
};

// Displays class description depending on dropdown
function displayClass(classes, heroClassSkills) {
    const classSelect = document.getElementById('search_class');    // Get class select
    const classIndex = classSelect.options[classSelect.selectedIndex].value.split(',')[0];  // Get selected class index

    const descContainer = document.querySelector('#class-description'); // Get class description container
    const descChildren = descContainer.children;    // Get array of class description container elements

    // If no class is selected, hide the class description container
    if(classIndex == -1) {
        descContainer.style.display = 'none';
        return;
    }

    const heroClass = classes[classIndex];  // Select class depending on classSelect chosen index

    updateSTProfs(heroClass.st_proficiencies);  // Update hero saving throw proficiencies to match selected race
    
    // Show class description container
    descContainer.style.display = 'block';
    
    descChildren[0].innerHTML = heroClass.name; // Set class name
    descChildren[1].innerHTML = heroClass.description;  // Set class description
    
    // Hit Die and Hit Points
    descChildren[2].querySelector('span').innerHTML = `1${heroClass.hit_die} per ${heroClass.name} level.`; // Set class hit die
    descChildren[3].querySelector('span').innerHTML = heroClass.hitpoints_start;    // Set class hitpoints at 1st level
    descChildren[4].querySelector('span').innerHTML = heroClass.hitpoints_higherlvls;   // Set class hitpoints at higher levels

    // Construct primary abilities string
    let abilitiesString = '';
    if(heroClass.abilities.length != 0) {
        heroClass.abilities.forEach(ability => {
            abilitiesString += ability[0].toUpperCase()
            abilitiesString += `${ability.substring(1)}, `
        });
        abilitiesString = abilitiesString.substring(0, abilitiesString.length-2);
    }
    descChildren[5].querySelector('span').innerHTML = abilitiesString;  // Set class primary abilities

    // Construct saving throw proficiencies string
    let stString = ''
    if(heroClass.st_proficiencies.length != 0) {
        heroClass.st_proficiencies.forEach(proficiency => {
            stString += proficiency[0].toUpperCase()
            stString += `${proficiency.substring(1)}, `
        });
        stString = stString.substring(0, stString.length-2);
    }
    descChildren[6].querySelector('span').innerHTML = stString; // Set class saving throw proficiencies

    // If class is a spellcaster class
    if(heroClass.spell_ability != '' && heroClass.spell_ability != undefined) {
        // On class selection change, remove both spell save dc and spell attack modifier DOM elements
        const spellcheck = document.querySelectorAll('.spell-js');
        if(spellcheck.length != 0) spellcheck.forEach(element => element.parentNode.removeChild(element));

        // Spells
        // Construct spell save dc DOM element
        const ssDC = document.createElement('p');
        ssDC.classList.add('spell-js');
        ssDC.innerHTML = '<strong>Spell Save DC = </strong><span>8 + your proficiency bonus + your spell ability modifier</span>';
        insertAfter(ssDC, descChildren[6]); // Insert spell save dc DOM element after saving throw proficiencies element

        // Construct spell attack modifier DOM element
        const saM = document.createElement('p');
        saM.classList.add('spell-js');
        saM.innerHTML = '<strong>Spell Attack Modifier = </strong><span>your proficiency bonus + your spell ability modifier</span>';
        insertAfter(saM, descChildren[7]);  // Insert spell attack modifier DOM element after spell save dc element

        // Replace 'spell ability' with actual class spellcasting ability name in spell save dc and spell attack modifier elements
        let spString = `${heroClass.spell_ability[0].toUpperCase() + heroClass.spell_ability.substring(1)}`;
        descChildren[7].querySelector('span').innerHTML = `8 + your proficiency bonus + your ${spString} modifier`;
        descChildren[8].querySelector('span').innerHTML = `your proficiency bonus + your ${spString} modifier`;

        // Skills
        // Construct class skill proficiency selects and append them to selectArray
        let selectArray = [];
        for(let i = 0; i < heroClass.skills.choose; i++) {
            // Create select element
            const select = document.createElement('select');
            select.name = `proficiency[${i}]`;
            select.classList.add('skillprof-class');
            select.setAttribute('onchange', 'updateSkillProfs()');
            
            // Create select element default option and append it to select element
            const defaultOpt = document.createElement('option');
            defaultOpt.appendChild( document.createTextNode('-----') );
            defaultOpt.value = '-1';
            // If hero has no class skill proficiencies chosen, make default option selected.
            if (!heroClassSkills) defaultOpt.setAttribute('selected', true);
            select.appendChild(defaultOpt); // Append default option to select element

            // Create select element skill options for class and append them to select element
            for(const skill of heroClass.skills.skills) {
                const skillName = `${skill[0].toUpperCase() + skill.substring(1)}`;
                const skillOpt = document.createElement('option');
                skillOpt.appendChild( document.createTextNode(skillName) );
                skillOpt.value = skill;
                // If hero has class skill selected and the current skill in iteration matches a selected skill, make current
                // skill iteration selected.
                if(heroClassSkills && heroClassSkills[i] == skill) skillOpt.setAttribute('selected', true);
                select.appendChild(skillOpt);
            }

            selectArray.push(select);   // Push constructed skill select to selectArray
        }

        const skillProfsContainer = document.querySelector('.c-skillprofs');    // Get skill proficiencies container
        if(skillProfsContainer.children.length != 0) skillProfsContainer.innerHTML = '';    // If there are selects under skill proficiencies, delete them
        // Append every select from selectArray to skill proficiencies container
        for(const select of selectArray) {
            skillProfsContainer.appendChild(select);
        }
        
        // Proficiencies
        //- const newIdx = 9 + selectArray.length;  // Commented this as it seems that A&W and tool profs are always 2 indexes below in descChildren
        const newIdx = 9 + 2;
        descChildren[newIdx].querySelector('span').innerHTML = heroClass.armor_weapon_proficiencies || 'none';  // Set armor and weapon proficiencies
        descChildren[newIdx+1].querySelector('span').innerHTML = heroClass.tool_proficiencies || 'none';    // Set tool proficiencies
    
    // If class is not a spellcaster class
    } else {
        // On class selection change, remove both spell save dc and spell attack modifier DOM elements
        const spellcheck = document.querySelectorAll('.spell-js');
        if(spellcheck.length != 0) spellcheck.forEach(element => element.parentNode.removeChild(element));

        // Skills
        // Construct class skill proficiency selects and append them to selectArray
        let selectArray = [];
        for(let i = 0; i < heroClass.skills.choose; i++) {
            // Create select element
            const select = document.createElement('select');
            select.name = `proficiency[${i}]`;
            select.classList.add('skillprof-class');
            select.setAttribute('onchange', 'updateSkillProfs()');
            
            // Create select element default option and append it to select element
            const defaultOpt = document.createElement('option');
            defaultOpt.appendChild( document.createTextNode('-----') );
            defaultOpt.value = '-1';
            // If hero has no class skill proficiencies chosen, make default option selected.
            if (!heroClassSkills) defaultOpt.setAttribute('selected', true);
            select.appendChild(defaultOpt); // Append default option to select element

            // Create select element skill options for class and append them to select element
            for(const skill of heroClass.skills.skills) {
                const skillName = `${skill[0].toUpperCase() + skill.substring(1)}`;
                const skillOpt = document.createElement('option');
                skillOpt.appendChild( document.createTextNode(skillName) );
                skillOpt.value = skill;
                // If hero has class skill selected and the current skill in iteration matches a selected skill, make current
                // skill iteration selected.
                if(heroClassSkills && heroClassSkills[i] == skill) skillOpt.setAttribute('selected', true);
                select.appendChild(skillOpt);
            }

            selectArray.push(select);   // Push constructed skill select to selectArray
        }
        
        const skillProfsContainer = document.querySelector('.c-skillprofs');    // Get skill proficiencies container
        if(skillProfsContainer.children.length != 0) skillProfsContainer.innerHTML = '';    // If there are selects under skill proficiencies, delete them
        // Append every select from selectArray to skill proficiencies container
        for(const select of selectArray) {
            skillProfsContainer.appendChild(select);
        }

        // Proficiencies
        //- const newIdx = 7 + selectArray.length;  // Commented this as it seems that A&W and tool profs are always 2 indexes below in descChildren
        const newIdx = 7 + 2;
        descChildren[newIdx].querySelector('span').innerHTML = heroClass.armor_weapon_proficiencies || 'none';
        descChildren[newIdx+1].querySelector('span').innerHTML = heroClass.tool_proficiencies || 'none';
    }
};

/********** Abilities **********/
// (ON ABILITY TAB OPEN) Sets appropriate racial bonuses depending on selected race, updates totals
function abilitiesTab(races) {
    racialBonuses(races);
    updateTotals();
};

// Updates ability tables' totals and modifiers
function updateTotals() {
    const tables = document.querySelectorAll('.c-ability__table'); // Get all ability score tables

    tables.forEach(table => {
        const tableName = table.id.split('-')[0];   // Get table name
        const racialBonus = parseInt(table.rows[4].cells[1].innerHTML); // Get table racial bonus
        const improvements = document.getElementById(`${tableName}-improvements`).value;    // Get table ability score improvements
        const miscBonus = document.getElementById(`${tableName}-misc_bonus`).value; // Get table misc bonus
        const other = document.getElementById(`${tableName}-other`).value;  // Get table other
        const override = document.getElementById(`${tableName}-override`).value;    // Get table override

        let total = parseInt(table.rows[3].cells[1].innerHTML);
        if(racialBonus != '' && racialBonus != NaN && racialBonus != undefined) total += parseInt(racialBonus); // If there is a racial bonus, add it to the total
        if(improvements != '' && improvements != NaN && improvements != undefined) total += parseInt(improvements); // If there is an ability score improvement, add it to the total
        if(miscBonus != '' && miscBonus != NaN && miscBonus != undefined) total += parseInt(miscBonus); // If there is a misc bonus, add it to the total
        if(other != '' && other != NaN && other != undefined) total += parseInt(other); // If there is other, add it to the total

        // If there is an override in table, override total with override value
        if(override != '' && override != NaN && override != undefined) total = override;

        table.rows[1].cells[1].innerHTML = total;   // Write total table score in row 1, cell 1
        
        // Calculate the modifier for the table ability, and write it to row 2, cell 1 with correct sign
        const modifier = Math.floor((total - 10) / 2);
        table.rows[3].cells[1].innerHTML == 0 
            ? table.rows[2].cells[1].innerHTML = '+0'
            : table.rows[2].cells[1].innerHTML = `${modifier >= 0 ? '+' + modifier : modifier}`;
    });
};

// Sets appropriate racial bonuses depending on selected race
function racialBonuses(races) {
    const tables = document.querySelectorAll('.c-ability__table');  // Get all ability score tables
    tables.forEach(table => table.rows[4].cells[1].innerHTML = '+0');   // Reset all racial bonus rows to '+0'

    const raceIndex = document.getElementById('search_race').value.split(',')[0];   // Get selected race index
    let race = undefined;
    if(raceIndex != -1) race = races[raceIndex];    // Select race with selected race index

    // If a race was selected, then update tables to show appropriate racial bonuses. Else, reset all bonuses to '+0'
    if(race != undefined) {
        race.ability_increase.forEach(ability => {
            const table = document.getElementById(`${ability.name}-table`);
            const abilityIncrease = ability.increase >= 0
                ? `+${ability.increase}`
                : `${ability.increase}`
            table.rows[4].cells[1].innerHTML = abilityIncrease; // Write racial bonus in row 4, cell 1
        }); 
    } else {
        tables.forEach(table => table.rows[4].cells[1].innerHTML = '+0');
    }
};

// Updates base ability score when user changes select option for said ability
function updateBase(selectName) {
    const selectValue = document.getElementById(`${selectName}-base`).value;    // Get ability value from select
    const table = document.getElementById(`${selectName}-table`);   // Select ability table

    // If user selected default option ('---'), set base score as 0. Else, set it to the selected value
    selectValue == ''
        ? table.rows[3].cells[1].innerHTML = '0'
        : table.rows[3].cells[1].innerHTML = `${selectValue}`;

    updateTotals(); // Re-calculate and update totals for ability table
};

// Updates all base ability scores on load (edit hero)
function updateBaseAll() {
    const abilitySelects = document.querySelectorAll('.js-abilityselect');  // Get all ability base score selects
    
    // Update all table base scores with ability select values
    abilitySelects.forEach(select => {
        const selectName = select.id.split('-')[0];
        const selectValue = select.value;
        const table = document.getElementById(`${selectName}-table`);

        selectValue == ''
            ? table.rows[3].cells[1].innerHTML = '0'
            : table.rows[3].cells[1].innerHTML = `${selectValue}`;

        updateTotals(); // Update total scores for every table
    });
};

// (ON LAST TAB OPEN) Saves non-input abilities to hidden inputs for form submit
function saveAbilities() {
    const tables = document.querySelectorAll('.c-ability__table'); // Get all ability score tables
    tables.forEach(table => {
        const tableName = table.id.split('-')[0];
        document.getElementById(`${tableName}-racial_bonus`).value = table.rows[4].cells[1].innerHTML;  // Save racial bonuses to hidden input
        document.getElementById(`${tableName}-total_score`).value = table.rows[1].cells[1].innerHTML;   // Save total score to hidden input
        document.getElementById(`${tableName}-modifier`).value = table.rows[2].cells[1].innerHTML;  // Save modifier to hidden input

        // Save passive perception to hidden input
        if(tableName == 'wisdom') document.getElementById('js-passiveperception').value = 10 + parseInt(table.rows[2].cells[1].innerHTML);
    });

    const level = parseInt(document.getElementById('js-level').value);  // Get character level
    const profbonus = document.getElementById('js-profbonus');  // Get proficiency bonus hidden input

    // Update proficiency bonus hidden input value based on level
    if(level <= 4) { profbonus.value = 2; }
    else if(4 < level <= 8) { profbonus.value = 3; }
    else if(8 < level <= 12) { profbonus.value = 4; }
    else if(12 < level <= 16) { profbonus.value = 5; }
    else { profbonus.value = 6; }
};

/********** Spells **********/
// Add spell to character spell list
function addSpell(type, spells) {
    const spellSelect = document.getElementById('js-spellselect');  // Get spell select
    const selectValue = spellSelect.options[spellSelect.selectedIndex].value;   // Get spell select chosen spell

    // If no spell was chosen, exit function
    if(selectValue == -1) return;

    // Get spell level and id from selected spell option
    const spellLevel = selectValue.split(',')[0];
    const spellId = selectValue.split(',')[1];

    // Find and get spell object from 'spells' array
    const selectedLevel = spells[spellLevel];
    const selectedSpell = selectedLevel.filter(spell => spell._id == spellId)[0];

    // If racial button was pressed, get racial spells container. Else, get class spells container
    let sections = type == 'racial'
        ? document.querySelectorAll('.js-racialspells')
        : document.querySelectorAll('.js-classspells');

    
    // Activate level section for selected spell's level
    const levelSection = sections[spellLevel];
    if(levelSection.classList[1] == 'm-inactive') {
        levelSection.classList.remove('m-inactive');
        levelSection.classList.add('m-active');
    }
    
    // Added .lastChild because pug auto generates tbody, so i must target it as 'levelTable for add and remove to work'
    const levelTable = levelSection.children[1].lastChild;

    // SpellIdx is used when removing a spell from the list
    let spellIdx = -1;
    if(levelTable.childElementCount == 0) {
        spellIdx = 0;
    } else {
        spellIdx = parseInt(levelTable.lastChild.classList[0].split('_')[1]) + 1;
    }
    
    // Create spell row
    const spellRow = document.createElement('tr');
    spellRow.classList.add('c-spell', 'm-clickable', `js-spellidx_${spellIdx}`);
    type == 'racial'
        ? spellRow.setAttribute('id', `js-racial_${selectedSpell._id}`)
        : spellRow.setAttribute('id', `js-class_${selectedSpell._id}`);
    
    // Spell School Image tabledata
    const schoolData = document.createElement('td');
    const schoolImg = document.createElement('img');
    schoolImg.classList.add('c-spell__image');
    schoolImg.src = `/images/icons/schools/${selectedSpell.school.toLowerCase()}.png`;
    schoolImg.alt = `${selectedSpell.school} school image`;
    schoolData.appendChild(schoolImg);
    spellRow.appendChild(schoolData);

    // Spell Name and Components tabledata
    const nameData = document.createElement('td');
    nameData.appendChild(document.createTextNode(`${selectedSpell.name}`));
    const componentText = document.createElement('p');
    componentText.classList.add('m-color-lightgray');
    componentText.appendChild(document.createTextNode(`${selectedSpell.school} • ${selectedSpell.components.join(', ')}`));
    nameData.appendChild(componentText);
    spellRow.appendChild(nameData);

    // Spell casting time, duration, and range tabledata
    const castingData = document.createElement('td');
    castingData.appendChild(document.createTextNode(`${selectedSpell.casting_time}`));
    const durationData = document.createElement('td');
    durationData.appendChild(document.createTextNode(`${selectedSpell.duration}`));
    const rangeData = document.createElement('td');
    rangeData.appendChild(document.createTextNode(`${selectedSpell.range}`));
    spellRow.appendChild(castingData);
    spellRow.appendChild(durationData);
    spellRow.appendChild(rangeData);

    // Button tabledata for spell info dropdown
    const buttonData = document.createElement('td');
    buttonData.classList.add('c-dropdown-button');
    buttonData.innerHTML = '&nabla;';
    spellRow.appendChild(buttonData);

    // Spell info dropdown
    const dropdownRow = document.createElement('tr');
    dropdownRow.classList.add(`js-spellidx_${spellIdx}`);
    const dropdownData = document.createElement('td');
    dropdownData.classList.add('c-spell-description');
    dropdownData.colSpan = '6';

    // Spell info name
    const infoName = document.createElement('h4');
    infoName.appendChild(document.createTextNode(`${selectedSpell.name}`));
    dropdownData.appendChild(infoName);

    // Spell info level and school
    const infoLS = document.createElement('em');
    let infoLSText = '';
    switch(selectedSpell.level) {
        case 0:
            infoLSText = `${selectedSpell.school} cantrip ${selectedSpell.ritual ? '(ritual)' : ''} ${selectedSpell.concentration ? '(concentration)' : ''}`;
            break;
        case 1:
            infoLSText = `${selectedSpell.level}st-level ${selectedSpell.school.toLowerCase()} ${selectedSpell.ritual ? '(ritual)' : ''} ${selectedSpell.concentration ? '(concentration)' : ''}`;
            break;
        case 2:
            infoLSText = `${selectedSpell.level}nd-level ${selectedSpell.school.toLowerCase()} ${selectedSpell.ritual ? '(ritual)' : ''} ${selectedSpell.concentration ? '(concentration)' : ''}`;
            break;
        case 3:
            infoLSText = `${selectedSpell.level}rd-level ${selectedSpell.school.toLowerCase()} ${selectedSpell.ritual ? '(ritual)' : ''} ${selectedSpell.concentration ? '(concentration)' : ''}`;
            break;
        default:
            infoLSText = `${selectedSpell.level}th-level ${selectedSpell.school.toLowerCase()} ${selectedSpell.ritual ? '(ritual)' : ''} ${selectedSpell.concentration ? '(concentration)' : ''}`;
            break;
    }
    infoLS.appendChild(document.createTextNode(infoLSText));
    dropdownData.appendChild(infoLS);

    const infoMargin0 = document.createElement('div');
    infoMargin0.classList.add('l-margin--2');
    dropdownData.appendChild(infoMargin0);

    // Spell info castingtime, range, components, duration
    const infoInfo = document.createElement('div');
    infoInfo.innerHTML = `<p><strong>Casting Time: </strong> ${selectedSpell.casting_time}</p>
    <p><strong>Range: </strong> ${selectedSpell.range}</p>
    <p><strong>Components: </strong><span>${selectedSpell.components.join(', ')}</span><span>${selectedSpell.materials != '' && selectedSpell.materials != undefined ? ` (${selectedSpell.materials})` : ''}</span></p>
    <p><strong>Duration: </strong> ${selectedSpell.duration}</p>`;
    dropdownData.appendChild(infoInfo);

    const infoMargin1 = document.createElement('div');
    infoMargin1.classList.add('l-margin--2');
    dropdownData.appendChild(infoMargin1);

    // Spell info description
    if(selectedSpell.description != '' && selectedSpell.description != undefined) {
        let spellDescLines = selectedSpell.description.split(/(\r\n|\r|\n)/g);
        spellDescLines.forEach(line => {
            let text = document.createElement('p');
            text.appendChild(document.createTextNode(`${line}`));
            dropdownData.appendChild(text);
        });
    }

    // Append hidden input to dropdown
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    type == 'racial'
        ? hiddenInput.classList.add('js-hiddenracialspells')
        : hiddenInput.classList.add('js-hiddenclassspells');
    type == 'racial'
        ? hiddenInput.setAttribute('name', 'spells.racial[]')
        : hiddenInput.setAttribute('name', 'spells.class[]');
    type == 'racial'
        ? hiddenInput.setAttribute('id', `js-inputracial_${spellId},${selectedSpell.level}`)
        : hiddenInput.setAttribute('id', `js-inputclass_${spellId},${selectedSpell.level}`);
    hiddenInput.value = `${spellId}`;
    dropdownData.appendChild(hiddenInput);

    // Margin before remove spell button
    const marginRemove = document.createElement('div');
    marginRemove.classList.add('l-margin--2');
    dropdownData.appendChild(marginRemove);
    
    // Remove spell button
    const buttonRemove = document.createElement('button');
    buttonRemove.appendChild(document.createTextNode('Remove Spell'));
    buttonRemove.setAttribute('type', 'button');
    buttonRemove.classList.add('c-button', 'm-clickable');
    buttonRemove.addEventListener('click', () => {
        const rmSpellIdx = buttonRemove.parentElement.parentElement.classList[0].split('_')[1];
        levelTable.querySelectorAll(`.js-spellidx_${rmSpellIdx}`).forEach(element => {
            levelTable.removeChild(element);
        });
    });
    dropdownData.appendChild(buttonRemove);
    

    // Append children to parents
    dropdownRow.appendChild(dropdownData);
    levelTable.appendChild(spellRow);
    levelTable.appendChild(dropdownRow);

    // Add dropdown functionality to created spell
    spellRow.addEventListener('click', () => {
        dropdownData.style.display === '' || dropdownData.style.display === 'none'
            ? dropdownData.style.display = 'table-cell'
            : dropdownData.style.display = 'none';

        buttonData.innerHTML === '∇'
            ? buttonData.innerHTML = '&Delta;'
            : buttonData.innerHTML = '&nabla;';
    });
};

// Sets up spell dropdowns for loaded spells
function loadedSpellsListeners() {
    const spellBar = document.querySelectorAll('.js-spell-loaded'); // Get all spell bars
    const dropdownButton = document.querySelectorAll('.js-dropdown-button-loaded'); // Get all dropdown buttons
    const spellDescription = document.querySelectorAll('.js-spell-description-loaded'); // Get all spell dropdowns
    const removeButton = document.querySelectorAll('.js-removebutton-loaded');   // Get all remove spell buttons

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
        
        // Remove spell from spell container
        removeButton[index].addEventListener('click', () => {
            const levelTable = removeButton[index].parentElement.parentElement.parentElement;   // Get level table
            const rmSpellIdx = removeButton[index].parentElement.parentElement.classList[0].split('_')[1];  // Get index of spell
            // Remove spell row and dropdown from level table
            levelTable.querySelectorAll(`.js-spellidx_${rmSpellIdx}`).forEach(element => {
                levelTable.removeChild(element);
            });
        });
    }); 
};

/********** Saving Throws & Skills **********/
let previousST = [];
// Updates and changes selected class ST proficiencies
function updateSTProfs(savingThrows) {
    // If saving throws were saved to array previously, get all saving throws and uncheck them. Then, reset previousST array
    if(previousST.length != 0){
        previousST.forEach(st => {
            document.getElementById(`${st}-saving_throws`).removeAttribute('checked');
        });
        previousST = [];
    }

    // If there are no class saving throw proficiencies, exit function.
    if(savingThrows.length == 0) return;

    // Get class saving throw proficiencies, find corresponding checkboxes on tab 3, and check them.
    // Then, append these saving throw proficiencies to previousST array in case class changes.
    savingThrows.forEach(st => {
        document.getElementById(`${st}-saving_throws`).setAttribute('checked', 'true');
        previousST.push(st);
    });
};

let previousSkills = [];
// Updates and changes selected class skill proficiencies
function updateSkillProfs() {
    // If skills were saved to array previously, get all skills and uncheck them. Then, reset previousSkills array
    if(previousSkills.length != 0){
        previousSkills.forEach(skill => {
            document.getElementById(`${skill}-skill`).removeAttribute('checked');
        });
        previousSkills = [];
    }

    // Get selected class skill proficiencies, find corresponding checkboxes on tab 3, and check them.
    // Then, append these skill proficiencies to previousSkills array in case class skill proficiency selection changes.
    const skills = document.querySelectorAll('.skillprof-class');   // Gets all skills selects from tab 1
    skills.forEach(skill => {
        if(skill.options[skill.selectedIndex].value != -1) {
            document.getElementById(`${skill.options[skill.selectedIndex].value}-skill`).setAttribute('checked', 'true');
            previousSkills.push(skill.options[skill.selectedIndex].value);
        }  
    }); 
};

/********** Description **********/
let previousLangs = '';
// Updates and changes selected race languages on description languages textarea
function raceLanguages(languages) {
    // If there are race languages in selected race, then add them to Proficiencies & Languages description section.
    if(languages != '' && languages != undefined && languages != null) {
        // If previous languages is empty, add racial languages to Proficiencies & Languages description section.
        // Else, find the languages with regex and replace them with the new race languages.
        if(previousLangs == '') {
            document.getElementById('js-languages').value += `Race: ${languages}`;
        } else {
            const regexReplace = new RegExp(previousLangs, 'g');
            const text = document.getElementById('js-languages').value.replace(regexReplace, `Race: ${languages}`);
            document.getElementById('js-languages').value = text;
        }
        previousLangs = `Race: ${languages}`;
    }
};