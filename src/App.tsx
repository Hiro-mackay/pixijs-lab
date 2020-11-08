import React from "react";
import * as PIXI from "pixi.js";

// abstract class ModelBase<TDisplayObject extends PIXI.DisplayObject> {
//   public constructor(
//     public readonly displayObject: TDisplayObject,
//     x: number,
//     y: number
//   ) {
//     this.displayObject.position.set(x, y);
//   }

//   public update(x: number, y: number): void {
//     this.doUpdate(x, y);
//   }

//   protected abstract doUpdate(x: number, y: number): void;
// }

// class Rectangle extends ModelBase<PIXI.Graphics> {
//   constructor() {
//     super(new PIXI.Graphics(), 0, 0);
//     this.displayObject.beginFill(0xde3249);
//     this.displayObject.drawRect(50, 50, 100, 100);
//     this.displayObject.endFill();

//     this.displayObject.interactive = true;
//     this.displayObject.buttonMode = true;

//     this.displayObject
//       .on("pointerdown", (e: PIXI.InteractionEvent, _t = this) =>
//         this.onDragStart(e, _t)
//       )
//       .on("pointerdown", (e: PIXI.InteractionEvent, _t = this) =>
//         this.onDragEnd(e, _t)
//       )
//       .on("pointerdown", (e: PIXI.InteractionEvent, _t = this) =>
//         this.onDragEnd(e, _t)
//       )
//       .on("pointermove", (e: PIXI.InteractionEvent, _t = this) =>
//         this.onDragMove(e, _t)
//       );
//   }

//   protected doUpdate(x: number, y: number) {
//     this.displayObject.x = x;
//     this.displayObject.y = y;
//   }

//   private onDragStart(e: PIXI.InteractionEvent, t: this) {
//     t.displayObject.alpha = 0.5;
//     console.log("onDragStart");
//   }
//   private onDragEnd(e: PIXI.InteractionEvent, t: this) {
//     t.displayObject.alpha = 1;
//   }
//   private onDragMove(e: PIXI.InteractionEvent, t: this) {
//     const mousePosition = e.data.getLocalPosition(e.currentTarget.parent);
//     console.log("object", mousePosition);
//     t.update(
//       mousePosition.x - t.displayObject.width,
//       mousePosition.y - t.displayObject.height
//     );
//   }
// }

function App() {
  const [pixiApp, setPixiApp] = React.useState<PIXI.Application | null>(null);
  const canvasRef = React.useRef(null);

  function onDragStart(
    this: PIXI.Graphics,
    event: PIXI.InteractionEvent
  ): void {
    this.on("pointermove", onDragMove);
  }
  function onDragEnd(this: PIXI.Graphics, event: PIXI.InteractionEvent): void {
    this.off("pointermove");
  }
  function onDragMove(this: PIXI.Graphics, event: PIXI.InteractionEvent): void {
    const newPosition = event.data.getLocalPosition(this.parent);
    this.x = newPosition.x - this.width;
    this.y = newPosition.y - this.height;
  }

  function drawRectangle() {
    if (!pixiApp) return;

    const g = new PIXI.Graphics();

    g.beginFill(0xde3249);
    g.drawRect(50, 50, 100, 100);
    g.endFill();

    g.interactive = true;
    g.buttonMode = true;

    g.on("pointerdown", onDragStart)
      .on("pointerup", onDragEnd)
      .on("pointerupoutside", onDragEnd);

    pixiApp.stage.addChild(g);
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
