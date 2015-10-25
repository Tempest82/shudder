(function (positionData, $, undefined) {
    positionData.LoadTargetData = function() {
        var td = {
            "targets": [{
                "unitId": 1,
                "network": "Opfor",
                "unitType": "Robot",
                "positions": [{
                    "latitude": 27.961527,
                    "longitude": -82.464414,
                    "elevation": 30,
                    "bearing": 180,
                }, {
                    "latitude": 27.961292,
                    "longitude": -82.464417,
                    "elevation": 30,
                    "bearing": 270
                }, {
                    "latitude": 27.961034,
                    "longitude": -82.46442,
                    "elevation": 30,
                    "bearing": 180
                }, {
                    "latitude": 27.960795,
                    "longitude": -82.464406,
                    "elevation": 30,
                    "bearing": 90
                }]
            },
               {
                   "unitId": 2,
                   "network": "Opfor",
                   "unitType": "Drone",
                   "positions": [{
                       "latitude": 27.961524,
                       "longitude": -82.463124,
                       "elevation": 125,
                       "bearing": 180
                   }, {
                       "latitude": 27.961152,
                       "longitude": -82.463135,
                       "elevation": 125,
                       "bearing": 90
                   }, {
                       "latitude": 27.960799,
                       "longitude": -82.463146,
                       "elevation": 125,
                       "bearing": 0
                   }, {
                       "latitude": 27.960593,
                       "longitude": -82.463406,
                       "elevation": 125,
                       "bearing": 290
                   }]
               }
            ]
        };


        window.targetdata = td;
    }

    positionData.GetLatestData =  function() {
        window.targets = [];
        for (i in window.targetdata.targets) {
            var value = window.targetdata.targets[i];

            lastPosition = value.positions.pop();

            var positionMessage = {
                unit: value.unitType,
                network: value.network,
                absolutePosition: {
                    latitude: lastPosition.latitude,
                    longitude: lastPosition.longitude,
                    elevation: lastPosition.elevation
                },
                unitId: value.unitId,
                direction: lastPosition.bearing
            };

            msgProcessor.ProcessIncomingMessage(positionMessage);
        }
    }
}(window.positionData = window.positionData || {}, jQuery));