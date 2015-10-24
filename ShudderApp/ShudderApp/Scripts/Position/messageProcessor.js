var myPosition = function () { };

function ProcessIncomingMessage(positionMessage) {
    var unit = positionMessage.unit;
    var network = positionMessage.network;
    var position = positionMessage.absolutePosition;
    var unitId = positionMessage.unitId;

    var positionData = TranslatePosition(position.latitude, position.longitude, position.elevation, position.direction);

    if (typeof (window.targets) === "undefined") {
        window.targets = [];
    }

    window.targets.push({
        id: unitId,
        position: {
            distance: positionData.GroundDistance,
            bearing: positionData.Bearing,
            latitude: position.latitude,
            longitude: position.longitude,
            elevation: position.elevation,
            elevationAngle: positionData.VerticalBearing
        },
        unitType: positionMessage.unit,
        timestamp: Date.now()
    });
}

function TranslatePosition(lat, long, elevation, direction) {
    GetCurrentLocation();

    var pi = Math.PI;
    lat *= pi / 180;
    long *= pi / 180;
    myPosition.longitude *= pi / 180;
    myPosition.latitude *= pi / 180;
    var height = myPosition.elevation - elevation;

    dlong = (long - myPosition.longitude);
    dlat = (lat - myPosition.latitude);

    // Haversine formula:
    var R = 6371;
    var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(myPosition.latitude) * Math.cos(lat) * Math.sin(dlong / 2) * Math.sin(dlong / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; //meters

    var straightLineDistance = Math.sqrt(Math.pow(d, 2) + Math.pow(height, 2));

    var verticalAngle = Math.cos(d / straightLineDistance);
    verticalAngle *= 180 / pi;

    var x = Math.cos(myPosition.latitude) * Math.sin(lat) - Math.sin(myPosition.latitude) * Math.cos(lat) * Math.cos(dlong);
    var y = Math.sin(dlong) * Math.cos(lat);

    var bearing = Math.atan2(Math.sin(dlong) * Math.cos(lat), Math.cos(myPosition.latitude) * Math.sin(lat) -
      Math.sin(myPosition.latitude) * Math.cos(lat) * Math.cos(dlong));

    bearing *= 180 / pi;

    var positionalData = function () { };

    positionalData.GroundDistance = d;
    positionalData.StraightDistance = straightLineDistance;
    positionalData.Bearing = bearing;
    positionalData.VerticalBearing = verticalAngle;

    return positionalData;
}

function GetCurrentLocation() {
    myPosition.latitude = window.hud.latitude;
    myPosition.longitude = window.hud.longitude;
    myPosition.elevation = window.hud.elevation;
}
