

(function (hud, $, undefined) {

    //requires svg or other tag to slide
    hud.setCompass = function (compassId, containerId) {
        var compass = document.getElementById(compassId);
        var container = document.getElementById(containerId);
        var hiphop = container.getBoundingClientRect().width;
        if (!hud.compassAngle) { hud.compassAngle = 0;}
        if (compass) {
            
            var overallSize = compass.getBoundingClientRect().width;
            var compassdegree = overallSize / 480;
            var overrunOffset = compassdegree * 90 ;
            var xOffset = (((hud.compassAngle * compassdegree) + overrunOffset) * -1) + (container.offsetWidth / 2);//(container.offsetWidth / 2)
            var transformAttr = ' translate(' + xOffset + ',0)';
            compass.setAttribute('transform', transformAttr);
            //console.log('transform' + xOffset + ' ' + compassdegree)
        }
    };
    


}(window.hud = window.hud || {}, jQuery));