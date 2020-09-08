import { Money } from './money';
import { Bar } from './bar';
import * as PIXI from 'pixi.js'
import { Particle } from './particle';
import { ParticlePool } from './particlePool';


export class App {
  constructor() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    // PIXI app
    this.papp;
    // bars
    this.insBar;
    this.fourkBar;
    this.taxBar;
    this.rothBar;
    this.takeHomeBar;
    this.matchBar;

    // bar scale
    this.barGap = 70;
    this.margin = this.w / 8;
    this.middle = this.w * 6 / 8;
    this.allLength = this.middle - (4 * this.barGap);
    this.scale = this.w / (5000);

    // sliders
    this.fourKSlider;
    this.rothSlider;
    this.money;

    // particles
    this.particlePool;

    // info holders
    this.futureValueHolder
  }

  init() {
    console.log('App init');
    this.initMoney();
    this.initSliders();
    this.initButtons();
    this.initInfoHolders();
    this.initPixi();

    this.initBars();

    this.initTicker();
    this.initParticlePool();
  }

  initButtons() {
    const spiralButton = document.getElementById("arrButton");
    spiralButton.addEventListener("click", ()=>{this.spiralClick()});
  }

  spiralClick(e) {
    console.log('spiral clicked');
    this.particlePool.organized = !this.particlePool.organized;
  }

  initInfoHolders() {
    this.futureValueHolder = document.getElementById('amtHolder');
    this.futureValueHolder.innerHTML = "hello world"
  }

  updateAmountHolder() {
    this.futureValueHolder.innerHTML = this.money.futureValue;
  }

  initParticlePool() {
    this.particlePool = new ParticlePool(this.papp.stage, this.money);
    this.particlePool.init(this.fourkBar, this.rothBar, this.w / 2, this.h / 3);
  }

  initPixi() {
    this.papp = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x130F15,
      antialias: true,
    });
    document.body.appendChild(this.papp.view);
    console.log('window.devicePixelRatio: ', window.devicePixelRatio)
    PIXI.settings.ROUND_PIXELS = true;

    console.log('PIXI.settings.RESOLUTION: ', PIXI.settings.RESOLUTION)
  }

  initTicker() {
    const ticker = new PIXI.Ticker();
    ticker.add(() => { this.animate() });
    ticker.start();
  }

  animate() {
    this.particlePool.update(this.insBar, this.rothBar, this.takeHomeBar, this.taxBar, this.fourkBar);
  }

  initMoney() {
    this.money = new Money();
    this.money.init();
    this.money.print();
  }

  initSliders() {
    this.fourKSlider = document.getElementById('kslider');
    this.fourKSlider.addEventListener('input', () => { this.updateFourkBar(this.fourKSlider.value) });
    this.rothSlider = document.getElementById('rothslider');
    this.rothSlider.addEventListener('input', () => { this.updateRothBar(this.rothSlider.value) })
  }

  initBars() {
    const incr = this.w / 5;
    const insX = incr / 2;
    const fourX = insX + incr;
    const taxX = fourX + incr;
    const cashX = taxX + incr;
    const rothX = cashX + incr;
    const ypos = 3 * this.h / 4;

    this.insBar = new Bar(insX, ypos, this.money.insurance * this.scale, 'ins', 0x73AD54);
    this.insBar.init(this.papp.stage);

    this.fourkBar = new Bar(fourX, ypos, 0, '401k', 0xEB0BCB);
    this.fourkBar.init(this.papp.stage);

    this.taxBar = new Bar(taxX, ypos, this.money.tax * this.scale, 'tax', 0xEB0B0D);
    this.taxBar.init(this.papp.stage);

    this.takeHomeBar = new Bar(cashX, ypos, this.money.takeHome * this.scale, 'cash', 0x0DE8CC);
    this.takeHomeBar.init(this.papp.stage);

    this.rothBar = new Bar(rothX, ypos, this.money.roth * this.scale, 'roth', 0x5DF40B);
    this.rothBar.init(this.papp.stage);

    this.matchBar = new Bar(rothX, ypos, this.money.roth * this.scale, 'match', 0xEB0BCB);
    this.matchBar.init(this.papp.stage);
  
    this.arrangeBars();
    this.updateAmountHolder();

  }

  updateFourkBar(value) {
    const delta = this.money.updateFourOneKPerc(value);
    this.launchFourkParticles(delta);
    this.fourkBar.update(this.money.fourOneK * this.scale);
    this.taxBar.update(this.money.tax * this.scale);
    this.takeHomeBar.update(this.money.takeHome * this.scale);

    this.updateRothBar(this.money.rothPerc);
    this.updateRothSlider(this.money.rothPerc);

    this.arrangeBars();
    this.updateAmountHolder();
  }

  launchFourkParticles(delta) {
    if (delta > 0) {
      this.particlePool.sendFlowParticle(this.taxBar, this.fourkBar);
      this.particlePool.sendFlowParticle(this.takeHomeBar, this.fourkBar, .7);
    } else if (delta < 0) {
      this.particlePool.sendFlowParticle(this.fourkBar, this.taxBar, .3);
      this.particlePool.sendFlowParticle(this.fourkBar, this.takeHomeBar, .7);
    }
  }

  updateRothBar(value) {
    const delta = this.money.updateRothPerc(value);
    this.launchRothParticles(delta);
    this.rothBar.update(this.money.roth * this.scale);
    this.takeHomeBar.update(this.money.takeHome * this.scale);
    //console.log('this.money.moneyMatch:', this.money.moneyMatch)
    this.matchBar.update(this.money.moneyMatch * this.scale);
    this.arrangeBars();
    this.updateAmountHolder();
  }

  launchRothParticles(delta) {
    if (delta < 0) {
      this.particlePool.sendFlowParticle(this.rothBar, this.takeHomeBar);
    } else if (delta > 0) {
      this.particlePool.sendFlowParticle(this.takeHomeBar, this.rothBar);
    }
  }

  updateRothSlider(value) {
    this.rothSlider.value = value;
  }

  arrangeBars() {
    const totalW = this.insBar.w + this.fourkBar.w + this.rothBar.w + this.taxBar.w + this.takeHomeBar.w + this.matchBar.w + (4 * this.barGap + this.barGap/2);
    const left = (this.w - totalW) / 2;
    const right = this.w - left;
    this.insBar.move(left + this.insBar.w / 2);
    this.rothBar.move(this.insBar.right + this.rothBar.w / 2 + this.barGap);
    this.takeHomeBar.move(this.rothBar.right + this.takeHomeBar.w / 2 + this.barGap);
    this.fourkBar.move(this.takeHomeBar.right + this.fourkBar.w / 2 + this.barGap);
    this.matchBar.move(this.fourkBar.right + this.matchBar.w / 2 + this.barGap/2);
    this.taxBar.move(right - this.taxBar.w / 2);
  }
}