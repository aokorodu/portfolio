import gsap from 'gsap';
import * as PIXI from 'pixi.js'

export class Particle {
  constructor(x, y, color, bar = null) {
    this.x = x;
    this.y = y;
    this.radius = 2 + Math.random() * 3;
    this.speed = Math.random() * 2 - 1;
    this.angle = Math.random() * 2 * Math.PI;
    this.xv = Math.cos(this.angle) * this.speed;
    this.yv = Math.sin(this.angle) * this.speed;
    this.bar = bar;

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
    this.addToStage(stage);
    this.draw();
  }

  addToStage(stage) {
    this.g = new PIXI.Graphics();
    this.g.position.set(this.x, this.y);
    stage.addChild(this.g);
  }

  update() {
    if (this.bar.w < 2) {
      this.g.alpha = 0;
      return;
    } else {
      this.g.alpha = .4;
    }
    this.bounceAround();
    this.tween();
    this.draw();
  }

  draw() {
    this.g.clear();
    this.g.beginFill(this.color);
    this.g.drawCircle(0, 0, this.radius);
    this.g.endFill();
  }

  target(bar) {
    if (bar == this.bar) return;
    this.bar = bar;
    this.targeting = true;
  }

  tween() {
    if (!this.targeting) return;
    this.x = this.bar.x;
    this.y = this.bar.y + this.bar.h/2;
    this.g.x = this.x;
    this.g.y = this.y;
    this.targeting = false;
    this.color = this.bar.color;
    this.targeting = false;
    this.draw();
  }

  float() {
    if (targeting || this.bar) return;
  }

  bounceAround() {
    if (this.targeting) return;
    if (this.bar == null) return;

    this.x += this.xv;
    if (this.x > this.bar.right - 2 * this.radius) {
      this.x = this.bar.right - 2 * this.radius;
      this.xv *= -1;
    } else if (this.x < this.bar.left + 2 * this.radius) {
      this.x = this.bar.left + 2 * this.radius;
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
}