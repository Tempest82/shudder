

(function (hud, $, undefined) {


    hud.test =  // Obtain a new *world-oriented* Full Tilt JS DeviceOrientation Promise
  var fulltiltPromise = FULLTILT.getDeviceOrientation({ 'type': 'world' });

    // Wait for Promise result
    fulltiltPromise.then(function(deviceOrientation) { // Device Orientation Events are supported

        // Register a callback to run every time a new 
        // deviceorientation event is fired by the browser.
        deviceOrientation.listen(function() {

            // Get the current *screen-adjusted* device orientation angles
            var currentOrientation = deviceOrientation.getScreenAdjustedEuler();

            // Calculate the current compass heading that the user is 'looking at' (in degrees)
            var compassHeading = 360 - currentOrientation.alpha;

            // Do something with `compassHeading` here...

        });

    }).catch(function(errorMessage) { // Device Orientation Events are not supported

        console.log(errorMessage);

        // Implement some fallback controls here...

    });

}(window.hud = window.hud || {}, jQuery));