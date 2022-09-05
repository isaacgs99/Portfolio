function setEleDisplay(selector, display) {
    var ele = document.querySelector(selector);
    if (!ele) {
        console.error('Element with selector ' + selector + ' not found in document.');
        return;
    }
    ele.style.display = display;
};

function showEle(selector) { setEleDisplay(selector, 'flex'); };
function hideEle(selector) { setEleDisplay(selector, 'none'); };

function buildCharCards(characters) {
    const output = [];
    for(const character of characters) {
        output.push(`
        <a class="c-card" href="/characters/${character.name}">
            <div class="c-card__header">
                <div class="c-card__header-left">
                    <h2>${character.name}</h2>
                </div>
                <div class="c-card__header-right"></div>
            </div>
        `);

        character.image != '' && character.image != undefined
            ? output.push(`<img class="c-card__image" src="http://res.cloudinary.com/duezou4td/image/upload/${character.image}.png" alt="${character.name}'s Image">`)
            : output.push(`<img class="c-card__image" src="https://lunawood.com/wp-content/uploads/2018/02/placeholder-image.png">`);
        output.push('</a>');
    }
    return output;
};

function searchCharacters() {
    const searchName = document.getElementById('search-name');
    const searchRelationship = document.getElementById('search-relationship');
    const searchPlace = document.getElementById('search-place');
    const searchRace = document.getElementById('search-race');

    const url = `/characters/search?name=${searchName.value || ''}&relationship=${searchRelationship.value || ''}&place=${searchPlace.value || ''}&race=${searchRace.value || ''}`;

    const ajax = new XMLHttpRequest();

    ajax.open("POST", url, true);

    ajax.onload = () => {
        hideEle('.c-loadingbg')
        const characterData = JSON.parse(ajax.responseText);
        
        output = buildCharCards(characterData);
        document.querySelector('.l-cards--4').innerHTML = output.join('\r');
        
        // Could use this in conjunction with res.render
        // document.write(ajax.responseText);
    }

    ajax.onerror = () => {
        hideEle('.c-loadingbg')
        console.log('error');
    }

    ajax.send();
    showEle('.c-loadingbg')
};

function buildCharRows(characters, dropdowns) {
    let output = [];

    for(let i = 0; i < characters.length; i++) {
        const character = characters[i];
        const dropdown = dropdowns[i];

        output.push('<tr class="c-spell c-spell--display m-clickable js-loadedresult">');
        output.push('<td>');
        character.image != '' && character.image != undefined
            ? output.push(`<img class="c-spell__image c-spell__herotableimage" src="http://res.cloudinary.com/duezou4td/image/upload/${character.image}.png" alt="${character.name}'s Image">`)
            : output.push('<p>No Image</p>');
        output.push('</td>');
        output.push(`
        <td>${character.name}</td>
        <td>${character.race || '???'} ${character.class || '???'}<p class="m-color-lightgray">Size: ${character.size || '???'}</p></td>
        <td class="m-responsive-display--table">Met in ${character.place || '???'}</td>
        <td>Age: ${character.age || '???'}</td>
        <td class="c-dropdown-button js-loadedresult--button">&nabla;</td>
        `);
        output.push('</tr>');
        output.push('<tr class="js-loadedresult--description">');
        output.push(dropdown);
        output.push('</tr>');
    }

    return output;
};

function searchCharsDM(route) {
    const searchName = document.getElementById('search-charname');

    const url = `${route}?name=${searchName.value || ''}`;

    const ajax = new XMLHttpRequest();

    ajax.open("GET", url, true);

    ajax.onload = () => {
        hideEle('#js-char-loading');
        showEle('#js-charbutton');

        const responseData = JSON.parse(ajax.responseText);

        if(responseData.errors) {
            document.getElementById('js-charsearch').innerHTML = responseData.errors;
            return;
        }

        const characterData = responseData.characters;
        const dropdownData = responseData.dropdowns;
        
        const output = buildCharRows(characterData, dropdownData);
        document.getElementById('js-charsearch').innerHTML = output.join('\r');
        // setupLoadedResult();
        setupSpellTables();
    }

    ajax.onerror = () => {
        hideEle('#js-char-loading');
        showEle('#js-charbutton');
        console.log('error');
    }

    ajax.send();
    showEle('#js-char-loading');
    hideEle('#js-charbutton');
};