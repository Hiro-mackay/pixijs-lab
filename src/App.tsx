import React from "react";
import * as PIXI from "pixi.js";

abstract class ModelBase<TDisplayObject extends PIXI.DisplayObject> {
  public constructor(
    public readonly displayObject: TDisplayObject,
    x: number,
    y: number
  ) {
    this.displayObject.position.set(x, y);
  }

  public update(x: number, y: number): void {
    this.doUpdate(x, y);
  }

  protected abstract doUpdate(x: number, y: number): void;
}

class Rectangle extends ModelBase<PIXI.Graphics> {
  constructor() {
    super(new PIXI.Graphics(), 0, 0);
    this.displayObject.beginFill(0xde3249);
    this.displayObject.drawRect(50, 50, 100, 100);
    this.displayObject.endFill();

    this.displayObject.interactive = true;
    this.displayObject.buttonMode = true;

    this.displayObject
      .on("mousedown", (e: PIXI.InteractionEvent, _t = this) =>
        this.onDragStart(e, _t)
      )
      .on("mouseup", (e: PIXI.InteractionEvent, _t = this) =>
        this.onDragEnd(e, _t)
      )
      .on("mouseupoutside", (e: PIXI.InteractionEvent, _t = this) =>
        this.onDragEnd(e, _t)
      )
      .on("mousemove", (e: PIXI.InteractionEvent, _t = this) =>
        this.onDragMove(e, _t)
      );
  }

  protected doUpdate(x: number, y: number) {
    this.displayObject.x = x;
    this.displayObject.y = y;
  }

  private onDragStart(e: PIXI.InteractionEvent, t: this) {
    t.displayObject.alpha = 0.5;
    console.log("onDragStart");
  }
  private onDragEnd(e: PIXI.InteractionEvent, t: this) {
    t.displayObject.alpha = 1;
  }
  private onDragMove(e: PIXI.InteractionEvent, t: this) {
    const mousePosition = e.data.getLocalPosition(e.currentTarget.parent);
    t.update(
      mousePosition.x - t.displayObject.width,
      mousePosition.y - t.displayObject.height
    );
  }
}

const t = new Rectangle();

function App() {
  const [pixiApp, setPixiApp] = React.useState<PIXI.Application | null>(null);
  const canvasRef = React.useRef(null);

  function drawRectangle() {
    if (!pixiApp) return;

    pixiApp.stage.addChild(t.displayObject);
  }

  React.useEffect(() => {
    const canvas: HTMLCanvasElement | undefined =
      canvasRef.current || undefined;

    const app = new PIXI.Application({
      view: canvas,
      antialias: true,
      resolution: 1,
    });

    app.renderer.backgroundColor = 0xfcfcfc;

    setPixiApp(app);
  }, []);

  return (
    <>
      <div
        style={{
          padding: "2vw",
          backgroundColor: "#333",
          display: "inline-block",
        }}
      >
        <canvas id="canvas" ref={canvasRef} width={600} height={400}></canvas>
      </div>
      <div style={{ padding: 30 }}>
        <button onClick={() => drawRectangle()}>四角</button>
        <button>三角</button>
        {/* <button onClick={() => drawCircle()}>丸</button> */}
      </div>
    </>
  );
}

export default App;
