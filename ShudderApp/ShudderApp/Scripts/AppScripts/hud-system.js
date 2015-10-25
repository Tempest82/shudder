

(function (hud, $, undefined) {

    hud.compassAngle = null;
    hud.groundAngle = 30;
    hud.latitude = null;
    hud.longitude = null;
    hud.elevation = 30;
    hud.speed = null;
    hud.timestamp = null;
    hud.updatePosition = function (position) {
        hud.latitude = position.coords.latitude;
        hud.longitude = position.coords.longitude;
        hud.elevation = position.coords.altitude;
        hud.speed = position.coords.speed;
        hud.timestamp = position.coords.timestamp;
        console.log('Lat and long:' + hud.latitude + ',' + hud.longitude);
    };

    hud.setViewBoxSize = function (elementName) {
        var w = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

        var h = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

        document.getElementById(elementName).style.height = (h - (h * .01));
        document.getElementById(elementName).style.width = (w - (w * .01));
    };

    hud.errorCallback = function (e) {
        console.log('Reeeejected!', e);
    };

    hud.addPositionListener = function (success, errorCall) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, errorCall);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    };
    hud.addOrientationListener = function (success) {
        if (window.DeviceOrientationEvent) {
            // Our browser supports DeviceOrientation
            window.addEventListener("deviceorientation", success);
        } else {
            alert("Sorry, your browser doesn't support Device Orientation, Compass will not work.");
        }
    };


}(window.hud = window.hud || {}, jQuery));