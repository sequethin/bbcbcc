// 1. Player Profile page (Overview)
//  https://www.streetfighter.com/6/buckler/profile/1210570995

// JSON is available:
// User Card: https://www.streetfighter.com/6/buckler/api/en/card/1210570995 [sid]
importScripts('../bbclib/Card.js', '../bbclib/SFApiUrls.js', '../bbclib/BBCStorage.js');

async function getMatchDataPageCountAndPageOne(sid) {
    const response = await fetch (SFApiUrls.getPerMatchDataUrl(sid, 1));
    const resData = await response.json();
    const totalPages = resData.pageProps.total_page;

    // We only return the first page, if this isn't it... that's weird
    console.assert(resData.pageProps.current_page === 1);

    return {
        page_count: totalPages,
        first_page: resData.pageProps.replay_list
    }
}
async function fetchMatchData(sid, page) {
    // TODO: this is unsafe, obvs - should check the response first :)
    const response = await fetch (SFApiUrls.getPerMatchDataUrl(sid, page));
    const resData = await response.json();
    return resData.pageProps.replay_list;
}

function updateStoredUserFromRemote(user, cache_key) {
    SFApiUrls.setSid(user.sid).setCacheKey(cache_key);

    fetch(SFApiUrls.getUserPlayInfoUrl())
        .then((response) => response.json())
        .then(async (data) => {
            const userCardNow = Card.fromBattleInfo(data.pageProps);
            const countAndPageOne = await getMatchDataPageCountAndPageOne(sid);
            const totalPages = countAndPageOne.page_count;
            let dirty = false;

            // First, check the name
            if (user.name[0] !== userCardNow.name[0]) {
                user.name.push(userCardNow.name);
                dirty = true;
            }

            // Check the circle (aka club)
            if (user.circle[0].circle_id !== userCardNow.circle[0].circle_id ||
                user.circle[0].circle_name !== userCardNow.circle[0].circle_name) {
                    user.circle.push({
                      circle_id: userCardNow.circle[0].circle_id,
                      circle_name: userCardNow.circle[0].circle_name
                    });
                dirty = true;
            }

            // Current character
            if (user.current_selected_char_name[0] !== userCardNow.current_selected_char_name[0]) {
                user.current_selected_char_name.push(userCardNow.current_selected_char_name[0]);
                dirty = true;
            }

            // Title
            if (user.display_title[0] !== userCardNow.display_title[0]) {
                user.display_title.push(userCardNow.display_title[0]);
                dirty = true;
            }

            if (user.home_name[0] !== userCardNow.home_name[0]) {
                user.home_name.push(userCardNow.home_name[0]);
                dirty = true;
            }


            // TODO: battle history
            // add matches to history, ensuring there are no replayID collisions
            countAndPageOne.first_page.forEach((match) => {
                if (user.match_history[match.replay_id] !== undefined) {
                    // We're done, we found a match that's already in
                }
                match_history[match.replay_id] = match;
            });

            // TODO: what if there are none?
            if (totalPages > 1) {
                do {
                    await fetchMatchData(sid, page).then((replay_batch) => {
                        replay_batch.forEach((match) => {
                            match_history[match.replay_id] = match;
                        })
                    });

                    ++page;
                } while(page <= totalPages);
            }

            userCard.match_history = match_history;
            BBCStorage.updateUser(userCard);
        });
}

function buildAndStoreNewUserFromRemote(sid, cache_key) {
    // This is weird but makes sure that the URLs come out right
    SFApiUrls.setSid(sid).setCacheKey(cache_key);
    let page = 1;
    let totalPages = 1;
    let userCard = {};
    let match_history = {};

    // TODO: this is unsafe, the response might not be jsonifiable
    fetch(SFApiUrls.getUserPlayInfoUrl())
        .then((response) => response.json())
        .then(async (data) => {
            userCard = Card.fromBattleInfo(data.pageProps);
            const countAndPageOne = await getMatchDataPageCountAndPageOne(sid);
            totalPages = countAndPageOne.page_count;
            // add matches to history, ensuring there are no replayID collisions
            countAndPageOne.first_page.forEach((match) => {
                match_history[match.replay_id] = match;
            });

            // TODO: what if there are none?
            if (totalPages > 1) {
                do {
                    await fetchMatchData(sid, page).then((replay_batch) => {
                        replay_batch.forEach((match) => {
                            match_history[match.replay_id] = match;
                        })
                    });

                    ++page;
                } while(page <= totalPages);
            }

            userCard.match_history = match_history;
            BBCStorage.updateUser(userCard);
        });
}

function addOrUpdateUser(msg) {
    if (msg.name !== "UpdateUserCard") {
        return;
    }

    BBCStorage.userExists(msg.sid).then((userFromDB) => {
        //buildAndStoreNewUserFromRemote(msg.sid, msg.cache_key);
        if (userFromDB !== undefined) {
            console.log("USER EXISTS WE SHOULD SAFE UPDATE");
            console.log(userFromDB);
            chrome.storage.local.getBytesInUse(null).then((bytes) => {
               console.log("USER COSTS: " + bytes) ;
            });
            //updateStoredUserFromRemote(userFromDB, msg.cache_key);
        } else {
            console.log("USER DOES NOT EXIST SO WE WILL MAKE A NEW ONE");
            //buildAndStoreNewUserFromRemote(msg.sid, msg.cache_key);
        }
    })
}

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "bbcbuddy");
    port.onMessage.addListener(addOrUpdateUser);
});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
function sendMessageToTabs(tab) {
    const port = chrome.tabs.connect(tab.id, {name: "bbcbuddy"});
    port.onMessage.addListener(function(msg) {
        if (msg.msg === "Save Button Pressed") {
            console.log(msg);
        }
    });
    port.postMessage({msg: "gimme"})
}

// When User Clicks Extension Icon
chrome.action.onClicked.addListener((tab) => {

});

