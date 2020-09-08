import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { PixiPlugin } from 'gsap/PixiPlugin';


export class ParticleFuture {
  constructor(originx, originy, x, y, radius, color) {
    this.originx = originx;
    this.originy = originy;
    this.x = x;
    this.y = y

    this.radius = radius;
    this.active = false;


    //pixi
    this.g;

    // tweening vars
    this.tweenDuration = 1;
    this.tweenDelay = 0;
    this.tl;

    // color
    this.type = color;
    this.color = color;
    this.COLORS = [0x69D2E7, 0xA7DBD8, 0xE0E4CC, 0xF38630, 0xFA6900, 0xFF4E50, 0xF9D423];
    this.PURPLES = [0x57044B, 0xFA01D6, 0xCD01AF, 0x93007E, 0x6C005D];
    this.GOLDS = [0x73AD54, 0x5DF40B, 0xA4F278, 0x00C10E, 0xAEE590];

    this.colorIndex = 0;
  }

  init(stage) {
    if (this.color == "purple") {
      console.log('mod:', Math.round(this.radius) % 5)
      // this.color = this.PURPLES[Math.round(this.radius) % this.PURPLES.length];
      this.color = this.PURPLES[Math.floor(Math.random() * this.PURPLES.length)];
    } else if (this.color == "gold") {
      this.color = this.GOLDS[Math.floor(Math.random() * this.GOLDS.length)];
    } else {
      this.color = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    }
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
    this.addToStage(stage);
    this.draw();
  }

  addToStage(stage) {
    this.g = new PIXI.Graphics();
    this.g.position.set(this.originx, this.originy);
    this.g.alpha = 0;
    stage.addChild(this.g);
  }

  draw() {
    console.log(`this.radius: ${this.radius}`)
    this.g.clear();
    this.g.beginFill(this.color);
    this.g.drawCircle(0, 0, this.radius);
    this.g.endFill();
  }

  activate(x, y, r) {
    if (this.active && (this.x === x) && (this.y === y)) return;
    this.active = true;
    this.x = x;
    this.y = y;
    this.radius = r;
    // gsap.to(this, {
    //   delay: .75,
    //   duration: 2, 
    //   radius:r,
    //   onUpdate:()=>{this.draw()}
    // })
    this.draw();
    this.zoomOut(r);
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;
    this.zoomIn();
  }

  zoomOut() {
    //if (this.zoomingOut) return;
    gsap.killTweensOf(this.g);
    this.zoomingOut = true;
    this.tl = new gsap.timeline();
    this.tl.to(this.g, {
      delay: .75,
      x: this.x,
      y: this.y,
      duration: 2,
      ease: "power2.out",
      alpha: .9,
      onComplete: () => { 
        this.zoomingOut = false;
        //this.draw();
      }
    })
    
  }

  zoomIn() {
    //if (this.zoomingIn) return;
    gsap.killTweensOf(this.g);
    this.zoomingOut = false;
    gsap.to(this.g, {
      duration: .75,
      x: this.type == "purple" ? this.originx: this.x,
      y: this.type == "purple" ? this.originy: this.y,
      alpha: 0,
      ease: "power2.out",
      onComplete: () => {
        this.zoomingIn = false;
      }
    })
  }

  arrange(x, y){
    gsap.killTweensOf(this.g);
    this.zoomingIn = false;
    this.zoomingOut = false;
    gsap.to(this.g, {
      duration: .75,
      x: x,
      y: y,
      ease: "power2.out",
      onComplete: () => {
        this.x = x;
        this.y = y;
      }
    })
  }


}