import * as PIXI from 'pixi.js';
export class ParticleSimple {
  constructor() {
    this.g;
  }

  init(x,y, color, radius) {
    this.initGraphic(x, y)
    this.draw(color, radius);
  }

  initGraphic(){
    this.g = new PIXI.Graphics();
    this.g.position.set(x,y);
    this.addToStage(stage);
  }

  draw(color, radius){
    this.g.clear();
    this.g.beginFill(color);
    this.g.drawCircle(0, 0, radius);
    this.g.endFill();
  }
}