class DrawingApp {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private readonly circles: Circle[] = [];
    private readonly colors: readonly string[] = ["red", "green", "blue"];
    private colorsCount: number = 0;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.addCircles(10, "Bounce");

        requestAnimationFrame(this.redraw);
    }

    private redraw = () => {
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const circle of this.circles) {
            this.drawCircle(circle);
            circle.actor.moveCircle(circle, this.canvas.width, this.canvas.height);
        }

        requestAnimationFrame(this.redraw);
    }

    private drawCircle(circle: Circle) {
        this.context.fillStyle = circle.color;
        this.context.beginPath();
        this.context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        this.context.fill();
    }

    private getColor(): string {
        let result = this.colors[this.colorsCount];
        this.colorsCount = (this.colorsCount + 1) % this.colors.length;
        return result;
    }

    public addCircles = (numbers: number, actorKind: "Bounce" | "Gravity") => {
        var color = this.getColor();
        for (var i = 0; i < numbers; i++) {
            this.circles.push({
                x: this.canvas.width * Math.random(),
                y: this.canvas.height * Math.random(),
                radius: 32 * Math.random() + 8,
                xInc: 5 * Math.random() + 1,
                yInc: 5 * Math.random() + 1,
                color: color,
                actor: actorKind === "Bounce" ? new BounceActor() : new GravityActor()
            });
        }
    }
}

type Circle = {
    x: number,
    y: number,
    readonly radius: number,
    readonly color: string,
    xInc: number,
    yInc: number,
    readonly actor: IActor,
};

interface IActor {
    moveCircle(circle: Circle, canvasWidth: number, canvsHeight: number)
}

class BounceActor implements IActor {
    public moveCircle(circle: Circle, canvasWidth: number, canvsHeight: number) {
        circle.x += circle.xInc;
        circle.y += circle.yInc;

        if (circle.x < 0 || circle.x > canvasWidth) {
            circle.xInc *= -1;
        }
        if (circle.y < 0 || circle.y > canvsHeight) {
            circle.yInc *= -1;
        }
    }
}

class GravityActor implements IActor {
    public moveCircle(circle: Circle, canvasWidth: number, canvsHeight: number) {
        circle.y += circle.yInc;

        circle.yInc += 0.01;

        const radius = circle.radius;

        if (circle.y - radius < 0) {
            circle.y = radius;
            circle.yInc *= -0.7;
        }
        else if (circle.y + radius > canvsHeight) {
            circle.y = canvsHeight - radius;
            circle.yInc *= -0.7;
        }

        //

        circle.x += circle.xInc;

        circle.xInc *= 0.9988;

        if (circle.x < 0 || circle.x > canvasWidth) {
            circle.xInc *= -1;
        }
    }
}