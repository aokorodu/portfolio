import {Bar} from './bar';
import { Utils } from './utils/utils';

export class BarSpecial extends Bar{
  constructor(title, fill, x, y, w, locked = false) {
    
    super(title, fill, x, y, w, locked);
    this.shrunk = false;
  }

  buildAboutText() {
    this.amountText = Utils.buildTextElement(0, 22 + this.h/2, "middle", "middle", "#ffffff", "bar-number-large")
    this.amountText.setAttribute("opacity", 0.7)
    this.group.appendChild(this.amountText);
  }

  updateAmount(newAmount) {
    this.amountText.textContent = newAmount;
    const w = 90; //this.amountText.getBBox();
    w > this.w ?  this.shrink() : this.expand();
    const xpos = this.shrunk ? (this.w + this.min) / 2  : (this.w + this.min) / 2;
    this.amountText.setAttribute("x", xpos);
  }

  shrink(w){
    if(this.shrunk) return;
    this.shrunk = true;
    this.amountText.setAttribute("class", "bar-number");
    this.amountText.setAttribute("y", 30 + this.h);
    this.amountText.setAttribute("opacity", 1);
    this.amountText.setAttribute("text-anchor", "middle");
  }

  expand(){
    if(!this.shrunk) return;
    this.shrunk = false;
    this.amountText.setAttribute("class", "bar-number-large");
    this.amountText.setAttribute("y", 22 + this.h/2);
    this.amountText.setAttribute("opacity", 0.7);
    this.amountText.setAttribute("text-anchor", "middle");
  }
}