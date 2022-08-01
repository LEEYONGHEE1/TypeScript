var DrawingApp = /** @class */ (function () {
    function DrawingApp(canvas) {
        var _this = this;
        this.circles = [];
        this.colors = ["red", "green", "blue"];
        this.colorsCount = 0;
        this.gravity = 0.1;
        this.redraw = function () {
            _this.context.fillStyle = "white";
            _this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
            for (var _i = 0, _a = _this.circles; _i < _a.length; _i++) {
                var circle = _a[_i];
                _this.drawCircle(circle);
                _this.moveCircle(circle);
            }
            requestAnimationFrame(_this.redraw);
        };
        this.addCircles = function (numbers) {
            var color = _this.getColor();
            for (var i = 0; i < numbers; i++) {
                _this.circles.push({
                    x: _this.canvas.width * Math.random(),
                    y: _this.canvas.height * Math.random(),
                    radius: 32 * Math.random() + 8,
                    xInc: 5 * Math.random() + 1,
                    yInc: 5 * Math.random() + 1,
                    color: color
                });
            }
        };
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.addCircles(10);
        requestAnimationFrame(this.redraw);
    }
    DrawingApp.prototype.drawCircle = function (circle) {
        this.context.fillStyle = circle.color;
        this.context.beginPath();
        this.context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        this.context.fill();
    };
    DrawingApp.prototype.getColor = function () {
        var result = this.colors[this.colorsCount];
        this.colorsCount = (this.colorsCount + 1) % this.colors.length;
        return result;
    };
    DrawingApp.prototype.moveCircle = function (circle) {
        circle.x += circle.xInc;
        circle.y += circle.yInc;
        if (circle.x < 0 || circle.x > this.canvas.width) {
            circle.xInc *= -1;
        }
        if (circle.y < 0 || circle.y > this.canvas.height - this.canvas.height * this.gravity) {
            circle.yInc *= -1;
        }
    };
    return DrawingApp;
}());
