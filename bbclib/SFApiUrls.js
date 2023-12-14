const SFApiUrls = {
    base: 'https://www.streetfighter.com/6/buckler',
    cache_key: '',
    stubs: {
        user_card: '/api/en/card/',
        profile: '/profile',
        login: '/auth/loginep?redirect_url=/',
        cached: '/_next/data/',
        play_info: '/en/profile/',
    },
    sid: 0,
    // TODO: private methods?
    buildUrl(stub) {
        return `${this.base}${stub}`;
    },
    buildCachedUrl(stub) {
        return `${this.base}${this.stubs.cached}${this.cache_key}${stub}`;
    },
    getProfileBaseUrl() {
        return this.buildUrl(this.stubs.profile) + '/';
    },
    getUserPlayInfoUrl() {
        // -> /_next/data/YJHN3L525lQtfqSpBviyT/en/profile/1210570995.json?sid=1210570995
        return this.buildCachedUrl(`${this.stubs.play_info}${this.sid}.json`);
    },
    getPerMatchDataUrl(sid, page) {
        // -> _next/data/YJHN3L525lQtfqSpBviyT/en/profile/1210570995/battlelog.json?sid=1210570995
       return this.buildCachedUrl(`${this.stubs.play_info}${this.sid}/battlelog.json?page=${page}`);
    },
    setCacheKey(key) {
        this.cache_key = key;
        return this;
    },
    setSid(sid) {
        this.sid = sid;
        return this;
    }
}