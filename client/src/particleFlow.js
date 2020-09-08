import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { PixiPlugin } from 'gsap/PixiPlugin';


export class ParticleFlow {
  constructor(x, y, color, bar = null) {
    this.x = x;
    this.y = y;
    this.bar = bar;
    
  
    this.radius = 2 + Math.random() * 3;
    this.speed = Math.random() - 0.5;
    this.angle = Math.random() * 2 * Math.PI;
    this.xv = Math.cos(this.angle) * this.speed;
    this.yv = Math.sin(this.angle) * this.speed;

    this.targeting = false;
    

    //pixi
    this.g;

    // tweening vars
    this.tweenDuration = 1;
    this.tweenDelay = 0;

    // color
    this.color = color;
  }

  init(stage) {
    console.log('particle init');
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
    this.addToStage(stage);
    this.draw();
  }

  addToStage(stage) {
    this.g = new PIXI.Graphics();
    this.g.position.set(this.x, this.y);
    this.g.alpha = .4;
    this.g.visible = false;
    stage.addChild(this.g);
  }

  draw() {
    this.g.clear();
    this.g.beginFill(this.color);
    this.g.drawCircle(0, 0, this.radius);
    this.g.endFill();
  }

  target(startBar, endBar, curved=true) {
    if (this.targeting) return;
    this.targeting = true;
    this.bar = endBar;
    let startX, endX;
    if (startBar.x > endBar.x) {
      startX = startBar.left + this.radius;
      endX = endBar.right - this.radius
    } else {
      startX = startBar.right -  this.radius;
      endX = endBar.left + this.radius
    }
    // const startX = startBar.x > endBar.x ? startBar.left : startBar.right;
    // const endX =  startBar.x > endBar.x ? endBar.right - this.radius: endBar.left + this.radius;
    const endY = endBar.y + endBar.h / 2 + (Math.random() * 6 - 3);
    this.g.x = startX;
    this.g.y = startBar.y + this.radius + (Math.random() * (startBar.h-2*this.radius));
    this.g.alpha = .1 + Math.random() * .4;
    this.color = startBar.color;
    this.draw();
    if(curved){
      var tl = gsap.timeline();
      tl.to(this.g, { y: endY-30, duration: .3 });
      tl.to(this.g, { y: endY, duration: .3 });
    }
    
    gsap.to(this.g, {
      duration: 1,
      x: endX,
      y: endBar.y + endBar.h/2 + (Math.random() * 6 - 3),
      pixi: { fillColor: endBar.color },
      modifiers: {
        x: (x) => {
          const end = startBar.x > endBar.x ? endBar.right - this.radius : endBar.left + this.radius;//startBar.x > endBar.x ? endBar.right : endBar.left;
          let dx = (end - x) * .1;
          if (Math.abs(dx) > 3) dx = dx / Math.abs(dx) * 3;
          return x + dx;
        }
      },
      onStart: () => {
        this.g.visible = true;
        //this.g.y = startBar.y + this.radius + (Math.random() * (startBar.h-2*this.radius));

      },
      onComplete: () => {
        this.x = this.g.x;
        this.y = this.g.y;
        this.targeting = false;
      }
    })
  }

  bounceAround() {
    if (this.targeting) return;
    if (this.bar == null) return;
    if(this.g.alpha < 0) return;
    this.g.alpha -= 1/150;
    this.x += this.xv;
    if (this.x > this.bar.right - 2*this.radius) {
      this.x = this.bar.right - 2*this.radius;
      this.xv *= -1;
    } else if (this.x < this.bar.left + 2*this.radius) {
      this.x = this.bar.left + 2*this.radius;
      this.xv *= -1;
    }

    this.y += this.yv;
    if (this.y > this.bar.bottom - this.radius) {
      this.y = this.bar.bottom - this.radius;
      this.yv *= -1;
    } else if (this.y < this.bar.top + this.radius) {
      this.y = this.bar.top + this.radius;
      this.yv *= -1;
    }

    this.g.position.set(this.x, this.y)

  }

  update() {
    if(!this.bar) return;

    if (this.bar.w < 4) {
      this.g.alpha = 0;
      return;
    }
    
    this.bounceAround();
  }


}