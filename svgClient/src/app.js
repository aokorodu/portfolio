import {Money} from './money';
import {BarView} from './barView';

export class App{
  constructor(){
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.money;
    this.barView;
  }

  init(){
    this.initMoney();
    this.initBarView();
  }

  initMoney(){
    this.money = new Money();
    this.money.init(2000, 120);
    this.money.updateFourOneKPerc(10);
    this.money.updateRothPerc(4);
  }

  initBarView(){
    this.barView = new BarView();
    this.barView.init(this.money);
  }
}