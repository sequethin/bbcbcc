const BBCStorage = {
    updateUser(userdata) {
        const userkey = `user_${userdata.sid}`;
        const setObj = {};
        setObj[userkey] = userdata;

        chrome.storage.local.set( setObj )
            .then((result) => {
                console.log("the result of the set", result);
            }).catch((reason) => {
                console.log(reason);
            });

        // demo after save to ensure storage for now
        chrome.storage.local.get(userkey).then((result) => {
          console.log("THIS IS WHAT I GOT BACK AFTER GET()", result[userkey]);
        });
    },
    async userExists(sid) {
        const userkey = `user_${sid}`;
        return chrome.storage.local.get((userkey)).then((result) => {
            return result[userkey];
        }).catch((err) => {
            return undefined;
        });
    }
}