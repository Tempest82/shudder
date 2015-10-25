

(function (hud, $, undefined) {


    hud.hdConstraints = {
        video: {
            mandatory: {
                minWidth: 1280,
                minHeight: 720
            }
        },
        audio: false
    };
    hud.vgaConstraints = {
        video: {
            mandatory: {
                maxWidth: 640,
                maxHeight: 360
            }
        }
    };

    hud.hasGetUserMedia = function () {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                  navigator.mozGetUserMedia || navigator.msGetUserMedia);
    };
    hud.testForVideo = function () {
        if (hud.hasGetUserMedia) {
            // Good to go!
        } else {
            alert('getUserMedia() is not supported in your browser. No background video will be displayed.');
        }
    };
    hud.startVideo = function () {
        navigator.getUserMedia(hud.hdConstraints, function (localMediaStream) {
            var video = document.querySelector('video');
            video.src = window.URL.createObjectURL(localMediaStream);

            // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            // See crbug.com/110938.
            video.onloadedmetadata = function (e) {
                // Ready to go. Do some stuff.
            };
        }, errorCallback);
    };


}(window.hud = window.hud || {}, jQuery));