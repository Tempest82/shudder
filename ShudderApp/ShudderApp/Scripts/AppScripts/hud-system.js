

(function (hud, $, undefined) {

    hud.compassAngle = null;
    hud.groundAngle = 0;
    hud.latitude = null;
    hud.longitude = null;
    hud.elevation = null;
    hud.speed = null;
    hud.timestamp = null;
    hud.updatePosition = function (position) {
        hud.latitude = position.coords.latitude;
        hud.longitude = position.coords.longitude;
        hud.elevation = position.coords.altitude;
        hud.speed = position.coords.speed;
        hud.timestamp = position.coords.timestamp;
        console.log('Lat and long:' + hud.latitude + ',' + hud.longitude);
    }

}(window.hud = window.hud || {}, jQuery));