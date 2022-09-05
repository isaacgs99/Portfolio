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

function searchSpells() {
    const searchName = document.getElementById('search-name');
    const searchLevel = document.getElementById('search-level');
    const searchSchool = document.getElementById('search-school');

    const url = `/users/spells/search?name=${searchName.value || ''}&level=${searchLevel.value || ''}&school=${searchSchool.value || ''}`;

    const ajax = new XMLHttpRequest();

    ajax.open("GET", url, true);

    ajax.onload = () => {
        hideEle('.c-loadingbg')
        const rowData = JSON.parse(ajax.responseText);
        
        document.querySelector('.l-spells').innerHTML = rowData.join('\r');
        setupSpellTables();
    }

    ajax.onerror = () => {
        hideEle('.c-loadingbg')
        console.log('error');
    }

    ajax.send();
    showEle('.c-loadingbg')
};

function searchSpellsDM(route) {
    const searchName = document.getElementById('search-name');

    const url = `${route}?name=${searchName.value || ''}`;

    const ajax = new XMLHttpRequest();

    ajax.open("GET", url, true);

    ajax.onload = () => {
        hideEle('#js-spell-loading');
        showEle('#js-spellbutton');

        const rowData = JSON.parse(ajax.responseText);
        
        document.getElementById('js-spellsearch').innerHTML = rowData.join('\r');
        setupSpellTables();
        // setupLoadedResult();
    }

    ajax.onerror = () => {
        hideEle('#js-spell-loading');
        showEle('#js-spellbutton');
        console.log('error');
    }

    ajax.send();
    showEle('#js-spell-loading');
    hideEle('#js-spellbutton');
};