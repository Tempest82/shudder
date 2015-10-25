(function (hud, $, undefined) {

    hud.degreesVisible = 114;
    hud.halfDegreesVisible = hud.degreesVisible/2;
    hud.determineVisible = function (targetCompassAngle, targetGroundAngle) {
        if ( 
            (
                (targetCompassAngle >= (hud.compassAngle - hud.halfDegreesVisible) && targetCompassAngle <= (hud.compassAngle + hud.halfDegreesVisible))
                  || (targetCompassAngle >= (hud.compassAngle + 360 - hud.halfDegreesVisible) && targetCompassAngle <= (hud.compassAngle + 360 + hud.halfDegreesVisible))
                )
            && (
                (targetGroundAngle >= (hud.groundAngle - hud.halfDegreesVisible) && targetCompassAngle <= (hud.groundAngle + hud.halfDegreesVisible))
                  || (targetGroundAngle >= (hud.groundAngle + 360 - hud.halfDegreesVisible) && targetCompassAngle <= (hud.groundAngle + 360 + hud.halfDegreesVisible))
                )

            ) {
            return true;
        }
        else { return false; }
    };
    hud.determineSize = function (targetDistance) {
        //reduce size by .05% every meter
        percentAdjust = 100;
        if (targetDistance < 5)
        { percentAdjust = 100 + (2 * targetDistance); }
        else
        { percentAdjust = 100 - (3.5 * targetDistance); }
        if (percentAdjust < 10) { percentAdjust = 10; }
        return (percentAdjust);
    };
    hud.determineLocation = function (targetCompassAngle, targetGroundAngle) {
        newCompassAngle = hud.compassAngle;
        newGroundAngle = hud.groundAngle;
        newTargetCompassAngle = targetCompassAngle;
        newTargetGroundAngle = targetGroundAngle;
        if (Math.abs(newTargetCompassAngle - newCompassAngle) > hud.halfDegreesVisible)
        {
            if (newCompassAngle > (360 - hud.halfDegreesVisible)) {
                newTargetCompassAngle += 360;
            }
            else
            {
                newCompassAngle += 360;
            }
        }
        var w = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        var h = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

        var degreeW = w / hud.degreesVisible;
        var degreeH = h / hud.degreesVisible;
        var leftmostAngle = newCompassAngle - hud.halfDegreesVisible;
        if (leftmostAngle < 0 )
            {leftmostAngle += 360;}
        var topMostAngle = newGroundAngle + hud.halfDegreesVisible;
        var topPosition = (topMostAngle - newTargetGroundAngle ) * degreeH;

        if (newTargetCompassAngle < leftmostAngle)
        {newTargetCompassAngle += 360;}
        var leftPosition = (newTargetCompassAngle - leftmostAngle) * degreeW;
        var result = { left: leftPosition, top: topPosition }
        return (result);
    };


}(window.hud = window.hud || {}, jQuery));