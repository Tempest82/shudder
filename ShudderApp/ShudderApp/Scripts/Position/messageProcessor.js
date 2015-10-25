(function (msgProcessor, $, undefined) {
    var myPosition = function () { };

    msgProcessor.ProcessIncomingMessage = function(positionMessage) {
    var unit = positionMessage.unit;
    var network = positionMessage.network;
    var position = positionMessage.absolutePosition;
    var unitId = positionMessage.unitId;

    var positionData = msgProcessor.TranslatePosition(position.latitude, position.longitude, position.elevation, position.direction);

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
            elevationAngle: positionData.VerticalBearing,
            obstructions: positionData.Obstructions,
            totalObstructions: positionData.TotalObstructions
        },
        unitType: positionMessage.unit,
        timestamp: Date.now()
    });
}

    msgProcessor.TranslatePosition = function(lat, long, elevation, direction) {
        msgProcessor.GetCurrentLocation();

    var sofwerx = {
        "type": "LineString",
        "coordinates": [
          [-82.4636437,
            27.9607638
          ],
          [-82.4643819,
            27.9607669
          ],
          [-82.4643778,
            27.9615415
          ],
          [-82.4636332,
            27.9615384
          ],
          [-82.4636344,
            27.961315
          ],
          [-82.4637009,
            27.9613152
          ],
          [-82.4637018,
            27.9611526
          ],
          [-82.4636588,
            27.9611524
          ],
          [-82.4636592,
            27.9610946
          ],
          [-82.4636995,
            27.9610948
          ],
          [-82.4637034535408,
            27.961047192579947
          ],
          [-82.4637756,
            27.9610518
          ],
          [-82.4637759,
            27.9609919
          ],
          [-82.4636425,
            27.9609914
          ],
          [-82.4636437,
            27.9607638
          ]
        ]
    };

    var position1 = {
        "coordinates": [
          [
            myPosition.longitude,
            myPosition.latitude
          ],
          [
            long,
            lat
          ]
        ]
    };

    var intersectionPoints = msgProcessor.lineStringsIntersect(sofwerx, position1);

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
    var d = R * c * 1000; //meters

    var straightLineDistance = Math.sqrt(Math.pow(d, 2) + Math.pow(height, 2));

    var verticalAngle = Math.cos(d / straightLineDistance);
    verticalAngle *= 180 / pi;

    var x = Math.cos(myPosition.latitude) * Math.sin(lat) - Math.sin(myPosition.latitude) * Math.cos(lat) * Math.cos(dlong);
    var y = Math.sin(dlong) * Math.cos(lat);

    var bearing = Math.atan2(Math.sin(dlong) * Math.cos(lat), Math.cos(myPosition.latitude) * Math.sin(lat) -
      Math.sin(myPosition.latitude) * Math.cos(lat) * Math.cos(dlong));

    bearing *= 180 / pi;

    if (bearing < 0) {
        bearing = 360 + bearing;
    }

    var positionalData = function () { };

    positionalData.GroundDistance = d;
    positionalData.StraightDistance = straightLineDistance;
    positionalData.Bearing = bearing;
    positionalData.VerticalBearing = verticalAngle;
    positionalData.Obstructions = intersectionPoints;
    positionalData.TotalObstructions = intersectionPoints.length || 0;

    return positionalData;
}

    msgProcessor.GetCurrentLocation = function() {
    myPosition.latitude = window.hud.latitude;
    myPosition.longitude = window.hud.longitude;
    myPosition.elevation = window.hud.elevation;
}

    msgProcessor.lineStringsIntersect = function(l1, l2) {
    var intersects = [];
    for (var i = 0; i <= l1.coordinates.length - 2; ++i) {
        for (var j = 0; j <= l2.coordinates.length - 2; ++j) {
            var a1 = {
                x: l1.coordinates[i][1],
                y: l1.coordinates[i][0]
            },
              a2 = {
                  x: l1.coordinates[i + 1][1],
                  y: l1.coordinates[i + 1][0]
              },
              b1 = {
                  x: l2.coordinates[j][1],
                  y: l2.coordinates[j][0]
              },
              b2 = {
                  x: l2.coordinates[j + 1][1],
                  y: l2.coordinates[j + 1][0]
              },
              ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
              ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
              u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
            if (u_b != 0) {
                var ua = ua_t / u_b,
                  ub = ub_t / u_b;
                if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                    intersects.push({
                        'type': 'Point',
                        'coordinates': [a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)]
                    });
                }
            }
        }
    }

    return intersects;
}
}(window.msgProcessor = window.msgProcessor || {}, jQuery));