// ==UserScript==
// @name         Bandcamp Tab Continuous Play
// @namespace    http://tampermonkey.net/
// @version      2024-05-07
// @description  Open multiple bandcamp pages and play through all the songs on every tab.
// @author       dmertl
// @match        https://*.bandcamp.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// ==/UserScript==


(function () {
    'use strict';

    function getNextTrack(e, playlist) {
        for (; e < playlist.length; e++) {
            if (playlist[e].file) {
                return e;
            }
        }
        return null;
    }

    function hasNextTrack(e, playlist) {
        return getNextTrack(e, playlist) !== null;
    }

    function markSelfPlayed() {
        GM_getTab(function (tab_self) {
            tab_self.is_finished = true;
            console.log('Marked ourselves, ' + tab_self.id + ', as finished');
            GM_saveTab(tab_self);
        });
    }

// Need to coordinate between players about who starts up next
// Could just race for it and write a flag as a semaphore
// Would be better if they played in tab order left to right
// Can we determine tab position within a window?
// Could at least play in order tabs were opened
// Each tab can iterate through all other bandcamp tabs
// Check if the tab has played yet
// Check if the tab has a lower ID than them
// If they are the lowest, unplayed tab, start playing

    function notifyEndOfPlaylist() {
        GM_setValue('trigger_bandcamp_playlist_end', Date.now());
    }

    function onEndOfPlaylist() {
        return weAreOldestUnplayed();
    }

    // Older tab could be stopped or gone and not play. Should have some kind of timeout to check if no tabs have started playing and re-do this check.
    async function weAreOldestUnplayed() {
        let r = false;
        let tab_self = await GM.getTab();
        let tabs = await GM.getTabs();

        for (const i in tabs) {
            let tab = tabs[i];
            console.log(tab);
            // Skip any tabs without id, they aren't ours
            if (!tab.id) {
                continue;
            }
            // Skip self
            if (tab.id === tab_self.id) {
                continue;
            }
            // Skip any finished tabs
            if (tab.is_finished) {
                continue;
            }
            // If tab is older, we are not oldest, abort
            if (tab.id < tab_self.id) {
                console.log('Found ' + tab.id + ' older than us, ' + tab_self.id);
                return;
            }
        }
        console.log('We, ' + tab_self.id + ', are the oldest');
        startPlaylist();
        //
        //
        // GM_getTab(function (tab_self) {
        //     if (tab_self.is_finished) {
        //         return;
        //     }
        //     GM_getTabs(function (tabs) {
        //         for (const i in tabs) {
        //             let tab = tabs[i];
        //             console.log(tab);
        //             // Skip any tabs without id, they aren't ours
        //             if (!tab.id) {
        //                 continue;
        //             }
        //             // Skip self
        //             if (tab.id === tab_self.id) {
        //                 continue;
        //             }
        //             // Skip any finished tabs
        //             if (tab.is_finished) {
        //                 continue;
        //             }
        //             // If tab is older, we are not oldest, abort
        //             if (tab.id < tab_self.id) {
        //                 console.log('Found ' + tab.id + ' older than us, ' + tab_self.id);
        //                 return;
        //             }
        //         }
        //         // We have gone through all the tabs and we are the oldest unplayed
        //         r = true;
        //     });
        // });
        // return r;
    }

    function startPlaylist() {
        console.log('Start playlist');
        unsafeWindow.gplaylist._play();
    }

    function monkeyPatchPlaylist() {
        console.log(unsafeWindow.gplaylist.next_track);
        let og = unsafeWindow.gplaylist.next_track;
        let rep = function () {
            console.log('replaced');
            if (hasNextTrack(unsafeWindow.gplaylist._track, unsafeWindow.gplaylist._playlist)) {
                console.log('Has next track, calling original next_track');
                og.call(unsafeWindow.gplaylist);
            } else {
                console.log('No next track, notifying other tabs to start');
                markSelfPlayed();
                notifyEndOfPlaylist();
            }
        }
        unsafeWindow.gplaylist.next_track = rep;

        console.log(unsafeWindow.gplaylist._handle_state);
        let og_handle_state = unsafeWindow.gplaylist._handle_state;
        let rep_handle_state = function (e) {
            console.log('handle_state ', e);
            // if (!this.seeking) {
            //     if (this._track + 1 <= this.last_playable_track) {
            //         console.log('IDLE Stopped');
            //     }
            // }
            og_handle_state.call(unsafeWindow.playlist, [e]);
            if (e.oldstate === 'IDLE' && e.newstate === 'COMPLETED') {
                console.log('Completed playlist, onto next tab');
                markSelfPlayed();
                notifyEndOfPlaylist();
            }
        }
        unsafeWindow.gplaylist._handle_state = rep_handle_state;
    }

    function pageIsPlayable() {
        if (typeof unsafeWindow.gplaylist !== 'undefined') {
            console.log('Playlist detected');
            return true;
        } else {
            console.log('Playlist not detected');
            return false;
        }
    }

    async function init() {
        // If we are an iframe, do not register
        if (window.self !== window.top) {
            return;
        }

        // Register ourselves as a new tab
        let tab_self = await GM.getTab();
        tab_self.id = Date.now();
        tab_self.is_finished = false;
        await GM.saveTab(tab_self);
        console.log('Registered self as tab id ' + tab_self.id);

        // Listen for trigger event
        GM_addValueChangeListener('trigger_bandcamp_playlist_end', function (key, oldValue, newValue, remote) {
            console.log('trigger_bandcamp_playlist_end change');
            onEndOfPlaylist();
        });

        monkeyPatchPlaylist();
    }

    if (pageIsPlayable()) {
        init();
    }


//
// next_track: function() {
//     let e = this._track;
//     do {
//         e++
//     } while (e < this._playlist.length && !this._playlist[e].file);
//     e == this._playlist.length && (e = 0),
//     this._track = e,
//     this._isplaying() && (this._state = "IDLE",
//     this._player.stop()),
//     this.play()
// },
// this._comm.subscribe($.proxy(this._comm_recv, this))),
// this._comm.startListening()

// $("#play-limits-dialog-buy-btn", a).click((function(l) {
//             if (l.preventDefault(),
//             a.dialog("close"),
//             t = !1,
//             i || !e && !r(o).is_downloadable)
//                 if (TralbumData.album_url) {
//                     new Cookie.CommChannel("playlist").send("stop");
//                     const e = Url.addQueryParams(TralbumData.album_url, {
//                         action: "download",
//                         from: "ltngtpbn"
//                     });
//                     window.top.location.href = e
//                 } else
//
//             }
// TODO: _statechanged
// TODO: register_listener
//
// _handle_state: function(e) {
//     if (this._state != e.newstate) {
//         if ("PLAYING" != e.newstate && "BUFFERING" != e.newstate && ("PAUSED" != e.newstate && (this._position = 0),
//         this._clearstate()),
//         this._state = e.newstate,
//         "COMPLETED" != e.newstate || "PLAYING" != e.oldstate && "BUFFERING" != e.oldstate && "PAUSED" != e.oldstate)
//             this._statechanged(e);
//
//
})();
