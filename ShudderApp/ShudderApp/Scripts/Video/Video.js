﻿

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
            },
            optional: [{
                sourceId: document.querySelector('select#videoSource').value
            }]
        }
    };


    document.querySelector('select#videoSource').onchange = hud.startVideo;

    function gotSources(sourceInfos) {
        for (var i = 0; i !== sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];
            var option = document.createElement('option');
            option.value = sourceInfo.id;
            if (sourceInfo.kind === 'video') {
                option.text = sourceInfo.label || 'camera ' + (document.querySelector('select#videoSource').length + 1);
                document.querySelector('select#videoSource').appendChild(option);
            } else {
                console.log('Some other kind of source: ', sourceInfo);
            }
        }
    }

    hud.hasGetUserMedia = function () {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                  navigator.mozGetUserMedia || navigator.msGetUserMedia);
    };
    navigator.getUserMedia = (navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia);
    hud.testForVideo = function () {
        if (hud.hasGetUserMedia) {
            // Good to go!
        } else {
            alert('getUserMedia() is not supported in your browser. No background video will be displayed.');
        }
    };

    hud.startVideo = function () {

        if (typeof MediaStreamTrack === 'undefined' ||
    typeof MediaStreamTrack.getSources === 'undefined') {
            alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
        } else {
            MediaStreamTrack.getSources(gotSources);
        }

        navigator.getUserMedia(hud.hdConstraints, function (localMediaStream) {
            var video = document.querySelector('video');
            video.src = window.URL.createObjectURL(localMediaStream);

            // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            // See crbug.com/110938.
            video.onloadedmetadata = function (e) {
                // Ready to go. Do some stuff.
            };
        }, hud.errorCallback);
    };


}(window.hud = window.hud || {}, jQuery));