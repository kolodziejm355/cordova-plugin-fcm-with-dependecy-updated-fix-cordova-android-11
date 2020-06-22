'use strict';


var execAsPromise = function (command, args) {
    if (args === void 0) { args = []; }
    return new Promise(function (resolve, reject) {
        window.cordova.exec(resolve, reject, 'FCMPlugin', command, args);
    });
};

var asDisposableListener = function (eventTarget, eventName, callback, options) {
    if (options === void 0) { options = {}; }
    var once = options.once;
    var handler = function (event) { return callback(event.detail); };
    eventTarget.addEventListener(eventName, handler, { passive: true, once: once });
    return {
        dispose: function () { return eventTarget.removeEventListener(eventName, handler); },
    };
};

var FCMPlugin = (function () {
    function FCMPlugin() {
        this.eventTarget = EventTarget ? new EventTarget() : document.createElement('div');
        execAsPromise('ready')
            .then(function () { return console.log('FCM: Ready!'); })
            .catch(function (error) { return console.log('FCM: Ready error: ', error); });
        console.log('FCM: has been created');
    }
    FCMPlugin.prototype.clearAllNotifications = function () {
        return execAsPromise('clearAllNotifications');
    };
    FCMPlugin.prototype.createNotificationChannel = function (channelConfig) {
        if (window.cordova.platformId !== 'android') {
            return Promise.resolve();
        }
        return execAsPromise('createNotificationChannel', [channelConfig]);
    };
    FCMPlugin.prototype.getAPNSToken = function () {
        return window.cordova.platformId !== 'ios'
            ? Promise.resolve('')
            : execAsPromise('getAPNSToken');
    };
    FCMPlugin.prototype.getInitialPushPayload = function () {
        return execAsPromise('getInitialPushPayload');
    };
    FCMPlugin.prototype.getToken = function () {
        return execAsPromise('getToken');
    };
    FCMPlugin.prototype.hasPermission = function () {
        return window.cordova.platformId !== 'ios'
            ? Promise.resolve(true)
            : execAsPromise('hasPermission');
    };
    FCMPlugin.prototype.onNotification = function (callback, options) {
        return asDisposableListener(this.eventTarget, 'notification', callback, options);
    };
    FCMPlugin.prototype.onTokenRefresh = function (callback, options) {
        return asDisposableListener(this.eventTarget, 'tokenRefresh', callback, options);
    };
    FCMPlugin.prototype.requestPushPermission = function (options) {
        var _a, _b, _c, _d;
        if (window.cordova.platformId !== 'ios') {
            return Promise.resolve(true);
        }
        var ios9SupportTimeout = (_b = (_a = options === null || options === void 0 ? void 0 : options.ios9Support) === null || _a === void 0 ? void 0 : _a.timeout) !== null && _b !== void 0 ? _b : 10;
        var ios9SupportInterval = (_d = (_c = options === null || options === void 0 ? void 0 : options.ios9Support) === null || _c === void 0 ? void 0 : _c.interval) !== null && _d !== void 0 ? _d : 0.3;
        return execAsPromise('requestPushPermission', [ios9SupportTimeout, ios9SupportInterval]);
    };
    FCMPlugin.prototype.subscribeToTopic = function (topic) {
        return execAsPromise('subscribeToTopic', [topic]);
    };
    FCMPlugin.prototype.unsubscribeFromTopic = function (topic) {
        return execAsPromise('unsubscribeFromTopic', [topic]);
    };
    return FCMPlugin;
}());

var FCM = new FCMPlugin();

module.exports = FCM;
