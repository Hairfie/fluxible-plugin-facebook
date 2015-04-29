'use strict';

var getSdk = require('./getSdk');

function facebookPlugin(options) {
    var options = options;

    return {
        name: 'FacebookPlugin',
        plugContext: function () {
            return {
                plugComponentContext: function (componentContext) {
                    console.log(options);
                    componentContext.getFacebookSdk = getSdk.bind(null, options);
                }
            };
        },
        dehydrate: function () {
            return { options: options };
        },
        rehydrate: function (state) {
            options = state.options;
        }
    };
}

module.exports = facebookPlugin;
