function setVideoSize() {
    var w = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    var h = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    document.getElementById('background-video').style.height = (h - (h * .01));
    document.getElementById('background-video').style.width = (w - (w * .01));
}
//window.addEventListener("resize", setVideoSize);
//setVideoSize();
function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
    // Good to go!
} else {
    alert('getUserMedia() is not supported in your browser. No background video will be displayed.');
}

//Alpha 0-180
var errorCallback = function (e) {
    console.log('Reeeejected!', e);
};
var hdConstraints = {
    video: {
        mandatory: {
            minWidth: 1280,
            minHeight: 720
        }
    },
    audio: false
};
var vgaConstraints = {
    video: {
        mandatory: {
            maxWidth: 640,
            maxHeight: 360
        }
    }
};
function fakecompass() {
    var c = document.getElementById("compassCanvas");
    var ctx = c.getContext("2d");
    var x = c.width / 2;
    var y = c.height / 2;
    ctx.font = '40px Calibri';
    ctx.textAlign = 'center';
    ctx.fillStyle = "#FF7777";
    ctx.fillText('|  | 10\xB0  |  |', x, y);
}
var oa = null;
var og = null;
var ob = null;
function deviceOrientationListener(event) {
    //TODO: repurpose this code to be a compass.
    if (oa != event.alpha || ob != event.beta || og != event.gamma) {
        console.log(event.alpha + ' ' + event.beta + ' ' + event.gamma + ' ');

        oa = event.alpha;
        ob = event.beta;
        og = event.gamma;

        console.log(compassHeading(oa, ob, og));
        var c = document.getElementById("compassCanvas");
        var ctx = c.getContext("2d");

        ctx.clearRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#FF7777";
        ctx.font = "14px Verdana";
        ctx.fillText("Alpha: " + Math.round(event.alpha), 10, 20);
        ctx.beginPath();
        ctx.moveTo(180, 75);
        ctx.lineTo(210, 75);
        ctx.arc(180, 75, 60, 0, event.alpha * Math.PI / 180);
        ctx.fill();

        ctx.fillStyle = "#FF6600";
        ctx.fillText("Beta: " + Math.round(event.beta), 10, 140);
        ctx.beginPath();
        ctx.fillRect(180, 150, event.beta, 90);

        ctx.fillStyle = "#FF0000";
        ctx.fillText("Gamma: " + Math.round(event.gamma), 10, 270);
        ctx.beginPath();
        ctx.fillRect(90, 340, 180, event.gamma);
    }
}
if (window.DeviceOrientationEvent) {
    // Our browser supports DeviceOrientation
    window.addEventListener("deviceorientation", deviceOrientationListener);
} else {
    alert("Sorry, your browser doesn't support Device Orientation, Compass will not work.");
}
function startVideo() {
    navigator.getUserMedia(hdConstraints, function (localMediaStream) {
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(localMediaStream);

        // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
        // See crbug.com/110938.
        video.onloadedmetadata = function (e) {
            // Ready to go. Do some stuff.
        };
    }, errorCallback);
}
startVideo();
//navigator.getUserMedia(hdConstraints, successCallback, errorCallback);
function compassHeading(alpha, beta, gamma) {

    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var cB = Math.cos(betaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    var rA = -cA * sG - sA * sB * cG;
    var rB = -sA * sG + cA * sB * cG;
    var rC = -cB * cG;

    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
        compassHeading += Math.PI;
    } else if (rA < 0) {
        compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;

}

window.addEventListener('deviceorientation', function (evt) {

    var heading = null;

    if (evt.absolute === true && evt.alpha !== null) {
        heading = compassHeading(evt.alpha, evt.beta, evt.gamma);
    }
    //correct header for surface weirdness on the compass.
    heading = heading + 90;
    if (heading >= 360) { heading = heading - 360; }

    // Do something with 'heading'...
    document.getElementById("hud-top-left").innerHTML = 'Compass: ' + heading;
}, false);