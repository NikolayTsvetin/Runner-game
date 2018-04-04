function createBackground(options) {
    const backgroundCanvas = document.getElementById('background-canvas');
    const backgroundContext = backgroundCanvas.getContext('2d');
    const backgroundImg = document.getElementById('background');

    backgroundCanvas.height = options.height;
    backgroundCanvas.width = options.width;

    function render() {
        backgroundContext.drawImage(
            this.image,
            this.coordinates.x,
            0
        );

        backgroundContext.drawImage(
            this.image,
            this.image.width - Math.abs(this.coordinates.x),
            0
        );
    }

    function update() {
        this.coordinates.x -= this.speedX;

        if (Math.abs(this.coordinates.x) > this.image.width) {
            this.coordinates.x = 0;
        }
    }

    const background = {
        image: backgroundImg,
        speedX: options.speedX,
        coordinates: { x: 0, y: 0 },
        render,
        update
    };

    return background;
}
