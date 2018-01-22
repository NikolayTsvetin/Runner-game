function createPhysicalBody(options) {
    'use strict';

    function move() {
        //var lastCoordinates = JSON.parse(JSON.stringify(this.coordinates));
        var lastCoordinates = { x: this.coordinates.x, y: this.coordinates.y };

        this.coordinates.x += this.speed.x;
        this.coordinates.y += this.speed.y;

        return lastCoordinates;
    }

    function collidesWith(otherPhysicalBody) {
        var x1 = this.coordinates.x + this.width / 2,
            y1 = this.coordinates.y + this.height / 2,
            x2 = otherPhysicalBody.coordinates.x + otherPhysicalBody.width / 2,
            y2 = otherPhysicalBody.coordinates.y + otherPhysicalBody.height / 2;

        var distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

        return distance <= (this.radius + otherPhysicalBody.radius);
    }

    var physicalBody = {
        coordinates: options.coordinates,
        defaultAcceleration: options.defaultAcceleration,
        speed: options.speed || { x: 0, y: 0 },
        height: options.height,
        width: options.width,
        radius: ((options.width / 2) + (options.height / 2)) / 2,
        accelerate: function(axis, dir) {
            this.speed[axis] += this.defaultAcceleration[axis] * dir;
        },
        move: move,
        collidesWith: collidesWith
    };

    return physicalBody;
}