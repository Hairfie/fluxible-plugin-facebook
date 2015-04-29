'use strict';

var Promise = require('es6-promise').Promise;
var loading = false;
var resolvers = [];

var debug = require('debug')('Fluxible:FacebookPlugin');

var DEFAULT_VERSION = 'v2.3';

function getSdk(options) {
    var options = {
        appId               : options.appId,
        version             : options.version || DEFAULT_VERSION,
        cookie              : !!options.cookie,
        status              : !!options.status,
        xfbml               : !!options.status,
        frictionlessRequests: !!options.frictionlessRequests,
        hideFlashCallback   : options.hideFlashCallback || null
    };

    debug('SDK asked');

    if (typeof window === 'undefined') {
        debug('server side, aborting');
        return Promise.reject(new Error('facebook: cannot get SDK in server side'));
    }

    if (window.FB) {
        return Promise.resolve(window.FB);
    }

    return new Promise(function (resolve, reject) {
        debug('appending resolver');
        resolvers.push(resolve);
        loadIfNecessary(options);
    });
}

module.exports = getSdk;

function loadIfNecessary(options) {
    if (!loading) {
        loading = true;
        load(options);
    }
}

function load(options) {
    debug('loading SDK');
    window.fbAsyncInit = fbAsyncInit.bind(null, options);

    (function(d, s, id){
        var fbRoot = document.createElement('div');
        fbRoot.setAttribute('id', 'fb-root');
        document.body.appendChild(fbRoot);
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

function fbAsyncInit(options) {
    window.FB.init(options);

    debug('finished loading SDK, resolving all promises');
    resolvers.map(function (resolve) { resolve(window.FB) });
    resolvers = [];
}
