import { ParticleFlow } from './particleFlow';
import { Particle } from './particle';
import { ParticleFuture } from './particleFuture';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export class ParticlePool {
  constructor(stage, money) {
    // flow
    this.flowIndex = 0;
    this.flowParticles = [];
    this.numFlowParticles = 100;

    //bar
    this.barParticles = [];
    this.numBarParticles = 100;

    // future
    this.futureParticles = [];
    this.numFutureParticles = 1000;
    this.futureRoth = [];
    this.futureFourK = [];
    this.floatX;
    this.floatY;
    this.recCirc;
    this.futureHolder;

    // stage
    this.stage = stage;

    // money
    this.money = money;

    // organized
    this.organized = false;
    this.spinning = true;
  }

  init(fourkBar, rothBar, floatX, floatY) {
    this.floatX = floatX;
    this.floatY = floatY;
    this.buildBarParticles();
    this.buildFlowParticles();
    this.buildFutureParticles(fourkBar, rothBar);
    // this.buildRecCirc(floatX, floatY);

  }

  buildRecCirc(floatX, floatY) {
    //console.log('build rec circ')
    this.recCirc = new PIXI.Graphics();
    this.recCirc.position.set(floatX, floatY);
    this.stage.addChild(this.recCirc);
    this.recCirc.clear();
    // this.recCirc.lineStyle(10, 0xff00ff, .1);
    // this.recCirc.drawCircle(0, 0, 75);
    // this.recCirc.lineStyle(2, 0xff00ff, .5);
    this.recCirc.beginFill(0xff00ff)
    this.recCirc.drawCircle(0, 0, 2);
    this.recCirc.endFill();
  }

  buildFutureParticles(fourkBar, rothBar) {
    this.futureHolder = new PIXI.Container();
    this.futureHolder.position.set(this.floatX, this.floatY);
    this.stage.addChild(this.futureHolder);
    const half = this.numFutureParticles / 2;
    let radius = 10;
    let angle = 0;
    for (let i = 0; i < half; i++) {
      const y = Math.sin(angle) * radius;
      const x = Math.cos(angle) * radius;
      let r = radius / 25 < 1 ? 1 : radius / 25;
      if (r > 6) r = 6;
      //console.log('r: ', r);
      const p = new ParticleFuture(0, 0, x, y, r, "purple");
      p.init(this.futureHolder);
      this.futureFourK.push(p);
      radius += .35;
      angle += 2 * Math.PI * 1.618;
    }

    for (let i = 0; i < half; i++) {
      const y = Math.sin(angle) * radius;
      const x = Math.cos(angle) * radius;
      let r = radius / 25 < 1 ? 1 : radius / 25;
      if (r > 6) r = 6;
      //console.log('r: ', r);
      const p = new ParticleFuture(0, 0, x, y, r, "gold")
      p.init(this.futureHolder);
      this.futureRoth.push(p);
      radius += .35;
      angle += 2 * Math.PI * 1.618;
    }

    gsap.to(this.futureHolder, {
      rotation: 2 * Math.PI,
      duration: 120,
      repeat: -1,
    });
  }

  spiralAlignFutureParticles() {
    if (!this.spinning) {
      gsap.killTweensOf(this.futureHolder)
      gsap.to(this.futureHolder, {
        rotation: 2 * Math.PI,
        duration: 120,
        repeat: -1,
      });
    } this.spinning = true;

    const half = this.numFutureParticles / 2;
    const numFourk = 2 * Math.round(half * this.money.fourOneKPerc / 100);
    const numRoth = 2 * Math.round(half * this.money.rothPerc / 100);
    let angle = 0;
    let radius = 10;
    let x, y, r;

    this.futureFourK.map((p, i) => {
      if (i < numFourk) {
        y = Math.sin(angle) * radius;
        x = Math.cos(angle) * radius;
        r = radius / 25 < 2 ? 2 : radius / 25;
        if (r > 6) r = 6;
        p.activate(x, y, r);
        radius += .35;
        angle += 2 * Math.PI * 1.618;
      } else {
        p.deactivate();
      }
    })

    this.futureRoth.map((p, i) => {
      if (i < numRoth) {
        y = Math.sin(angle) * radius;
        x = Math.cos(angle) * radius;
        r = radius / 25 < 2 ? 2 : radius / 25;
        if (r > 6) r = 6;
        p.activate(x, y, r);
        radius += .35;
        angle += 2 * Math.PI * 1.618;
      } else {
        p.deactivate();
      }
    })

  }

  // organizeFutureParticles() {
  //   //console.log('this.organized: ', this.organized)
  //   if (this.spinning) {
  //     console.log('killing tweens')
  //     gsap.killTweensOf(this.futureHolder);
  //     this.spinning = false;
  //     gsap.to(this.futureHolder, {
  //       rotation: 0,
  //       duration: 2,
  //     });
  //   }

  //   const half = this.numFutureParticles / 2;
  //   const numFourk = 2 * Math.round(half * this.money.fourOneKPerc / 100);
  //   const numRoth = 2 * Math.round(half * this.money.rothPerc / 100);
  //   const rothX = -200;
  //   const fourkX = 200;
  //   let x, y, r;
  //   let radius = 10;
  //   let angle = 0;

  //   this.futureFourK.map((p, i) => {
  //     if (i < numFourk) {
  //       y = Math.sin(angle) * radius;
  //       x = fourkX + Math.cos(angle) * radius;
  //       r = radius / 25 < 2 ? 2 : radius / 25;
  //       if (r > 6) r = 6;
  //       p.activate(x, y, r);
  //       radius += .35;
  //       angle += 2 * Math.PI * 1.618;
  //     } else {
  //       p.deactivate();
  //     }
  //   })

  //   radius = 10;
  //   angle = 0;

  //   this.futureRoth.map((p, i) => {
  //     if (i < numRoth) {
  //       y = Math.sin(angle) * radius;
  //       x = rothX + Math.cos(angle) * radius;
  //       r = radius / 25 < 2 ? 2 : radius / 25;
  //       if (r > 6) r = 6;
  //       p.activate(x, y, r);
  //       radius += .35;
  //       angle += 2 * Math.PI * 1.618;
  //     } else {
  //       p.deactivate();
  //     }
  //   })

  // }

  organizeFutureParticles() {
    if (this.spinning) {
      console.log('killing tweens')
      gsap.killTweensOf(this.futureHolder);
      this.spinning = false;
      gsap.to(this.futureHolder, {
        rotation: 0,
        duration: 2,
      });
    }

    const half = this.numFutureParticles / 2;
    const numFourk = 2 * Math.round(half * this.money.fourOneKPerc / 100);
    const numRoth = 2 * Math.round(half * this.money.rothPerc / 100);
    const rothX = -50;
    const fourkX = 50;
    let x, y, r;
    x = 0;
    y = 150;
    r = 3;
    let radius = 3;
    let angle = 0;

    this.futureFourK.map((p, i) => {
      if (i < numFourk) {
        const xpos = fourkX + x;
        p.activate(xpos, y, r);
        const incr = (2 * r + 2);
        x += incr
        if (x > 10 * incr) {
          x = 0;
          y -= incr;
        }
      } else {
        p.deactivate();
      }
    })

    x = 0;
    y = 150;
    r = 3;
    radius = 10;
    angle = 0;

    this.futureRoth.map((p, i) => {
      // if (i < numRoth) {
      //   y = Math.sin(angle) * radius;
      //   x = rothX + Math.cos(angle) * radius;
      //   r = radius / 25 < 2 ? 2 : radius / 25;
      //   if (r > 6) r = 6;
      //   p.activate(x, y, r);
      //   radius += .35;
      //   angle += 2 * Math.PI * 1.618;
      // } else {
      //   p.deactivate();
      // }

      if (i < numRoth) {
        const xpos = rothX + x;
        p.activate(xpos, y, r);
        const incr = (2 * r + 2);
        x -= incr
        if (x < -10 * incr) {
          x = 0;
          y -= incr;
        }
      } else {
        p.deactivate();
      }
    })

  }

  buildBarParticles() {
    for (let i = 0; i < this.numBarParticles; i++) {
      const p = new Particle(0, 0, 0xffffff);
      p.init(this.stage);
      this.barParticles.push(p);
    }
  }

  arrangeBarParticles(insBar, rothBar, takeHomeBar, taxBar, fourkBar) {
    const preTxPart = [];
    const fKPart = [];
    const insPart = [];

    const taxIncomPart = [];
    const taxPart = [];
    const postTaxPart = [];
    const cashPart = [];
    const rothPart = [];

    let num;

    // first, divide into pretax and taxable income
    num = this.barParticles.length;
    const ptNum = Math.floor(this.money.preTaxPerc / 100 * num);
    for (let i = 0; i < ptNum; i++) {
      let p = this.barParticles[i];
      preTxPart.push(p);
    }

    for (let i = ptNum; i < num; i++) {
      let p = this.barParticles[i];
      taxIncomPart.push(p);
    }

    // next divide pretax into insurance and 401k
    num = preTxPart.length;
    const insNum = Math.floor(this.money.insurance / this.money.preTax * num);

    for (let i = 0; i < insNum; i++) {
      insPart.push(preTxPart[i])
    }

    for (let i = insNum; i < num; i++) {
      fKPart.push(preTxPart[i])
    }

    // next divide taxable income into tax and post-tax
    num = taxIncomPart.length
    const tnum = Math.floor(this.money.tax / this.money.taxableIncome * num);
    for (let i = 0; i < tnum; i++) {
      taxPart.push(taxIncomPart[i]);
    }

    for (let i = tnum; i < num; i++) {
      postTaxPart.unshift(taxIncomPart[i]);
    }

    // finally, divide postTax into cash and roth
    num = postTaxPart.length;
    const cashNum = Math.floor(this.money.takeHome / this.money.afterTax * num);
    for (let i = 0; i < cashNum; i++) {
      cashPart.unshift(postTaxPart[i]);
    }

    for (let i = cashNum; i < num; i++) {
      rothPart.push(postTaxPart[i]);
    }


    insPart.map((p) => {
      p.target(insBar);
    });

    fKPart.map((p) => {
      p.target(fourkBar);
    });

    taxPart.map((p) => {
      p.target(taxBar);
    });


    cashPart.map((p) => {
      p.target(takeHomeBar);
    });

    rothPart.map((p) => {
      p.target(rothBar);
    });


  }

  buildFlowParticles() {
    for (let i = 0; i < this.numFlowParticles; i++) {
      const p = new ParticleFlow(0, 0, 0xffffff);
      p.init(this.stage);
      this.flowParticles.push(p);
    }
  }

  getIndex() {
    const i = this.flowIndex;
    this.flowIndex = ++this.flowIndex % this.numFlowParticles;
    return i;
  }

  sendFlowParticle(from, to, percentage = .5, curved = false) {
    if (Math.random() > percentage) return;

    const p = this.flowParticles[this.getIndex()];
    p.target(from, to, curved);
  }

  update(insBar, rothBar, takeHomeBar, taxBar, fourkBar) {
    this.arrangeBarParticles(insBar, rothBar, takeHomeBar, taxBar, fourkBar);
    this.barParticles.map((p) => {
      p.update();
    })
    //this.spiralAlignFutureParticles();
    this.organized ? this.organizeFutureParticles() : this.spiralAlignFutureParticles();
    this.flowParticles.map(p => p.update());

  }
}