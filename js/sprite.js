function createSprite(options) {

    // I think this is not needed
    var clearOffset = 5;

    function render(drawCoordinates, clearCoordinates) {

        //this.context.clearRect(
        //    clearCoordinates.x,
        //    clearCoordinates.y,
        //    this.width,
        //    this.height
        //);
        this.context.clearRect(
            clearCoordinates.x - clearOffset,
            clearCoordinates.y - clearOffset,
            this.width + clearOffset * 2,
            this.height + clearOffset * 2
        );
        // I think the offset isn't neccessary - to be checked!

        this.context.drawImage(
            this.spritesheet,
            this.frameIndex * this.width,
            0,
            this.width,
            this.height,
            drawCoordinates.x,
            drawCoordinates.y,
            this.width,
            this.height
        );
    }

    function update() {

        this.loopTicksCount += 1;

        if (this.loopTicksCount >= this.loopTicksPerFrame) {
            this.loopTicksCount = 0;

            this.frameIndex += 1;

            if (this.frameIndex >= this.numberOfFrames) {
                this.frameIndex = 0;
            }
        }

    }

    var sprite = {
        spritesheet: options.spritesheet,
        context: options.context,
        width: options.width,
        height: options.height,
        numberOfFrames: options.numberOfFrames,
        loopTicksPerFrame: options.loopTicksPerFrame,
        frameIndex: 0,
        loopTicksCount: 0,
        render: render,
        update: update
    };

    return sprite;
}