// ==UserScript==
// @name         IMDB nzb.su link
// @namespace    https://dmertl.com/imdb_nzb_link
// @version      0.1
// @description  Link to nzb.su search for movies on watchlists
// @author       Me
// @match        https://www.imdb.com/user/*/watchlist*
// @match        https://www.imdb.com/list/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const SEARCH_URL = 'https://www.nzb.su/search/';
    const SEARCH_MOVIE_TYPE = '2000';

    function addLink(e_item) {
        // TODO: Movie vs. TV show search
        let e_title = e_item.getElementsByClassName('ipc-title__text')[0];
        let title = e_title.textContent.replace(/^[0-9]+\.\s*/, '');
        let metadata = e_item.getElementsByClassName('dli-title-metadata-item');
        let year = metadata[0].textContent.replace(/[^0-9]/g, '').slice(0, 4);
        let search = title + ' ' + year;
        let e_link = document.createElement('a');
        e_link.innerHTML = '&#128252;';
        e_link.href = SEARCH_URL + encodeURIComponent(search) + '/?t=' + SEARCH_MOVIE_TYPE;
        e_link.target = '_blank';
        e_title.append(' ');
        e_title.append(e_link);
    }

    let e_list = document.getElementsByTagName('main')[0].getElementsByTagName('ul')[0];
    for(const e_item of e_list.getElementsByTagName('li')) {
        addLink(e_item);
    }

    const obs = new MutationObserver(function(mutationList, observer) {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                addLink(node);
            }
        }
    });
    obs.observe(e_list, {"childList": true});
})();
