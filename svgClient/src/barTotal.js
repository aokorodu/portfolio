import { Utils } from './utils/utils';

export class BarTotal {
  constructor(title, fill, x, y, w, h) {
    this.title = title;
    this.fill = fill.indexOf("#") > -1 ? fill : `url('#${fill}')`;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.titleText = null;
    this.titleTextWidth = 0;
    this.amountText = null;
    this.track = null;
    this.bar = null;
    this.group = null;
    this.margin = 0;

    this.danger = false;
    this.warning = false;
  }

  trueWidth(){
    return this.w;
  }

  build(svg) {
    this.buildGroup(svg);
    this.buildTrack();
    this.buildBar()
    this.buildLines();
    this.buildText();
  }

  buildGroup(svg) {
    this.group = Utils.buildGroup();
    this.group.setAttribute("transform", `translate(${this.x} ${this.y})`)
    svg.appendChild(this.group);
  }

  buildTrack() {
    this.track = Utils.buildRect(0, this.margin, this.w, this.h, this.fill);
    this.track.setAttribute("opacity", 0.2);
    this.group.appendChild(this.track);
  }

  buildBar() {
    this.bar = Utils.buildRect(0, this.margin, this.w, this.h/2, this.fill);
    this.group.appendChild(this.bar);
  }

  buildLines(){
    const ypos = this.margin + this.h * .7;
    const lowLine = Utils.buildLine(0, ypos, this.w, ypos, '#D8d8d8', 1);
    lowLine.setAttribute("opacity", 0.5)
    this.group.appendChild(lowLine);
  }

  buildText() {
    this.buildAmountText();
  }

  buildAmountText() {
    this.amountText = Utils.buildTextElement(this.w/2, 25 + this.h, "middle", "hanging", "#ffffff", "bar-projection-amount", "0")
    
    this.group.appendChild(this.amountText);
  }

  updateAmount(newAmount, percentage){
    this.amountText.textContent = newAmount;
    let h = this.h * percentage/100;
    if (h > this.h) h = this.h;
    let y = this.h - h;
    this.bar.setAttribute("height", h);
    this.bar.setAttribute("y", this.margin + y);
    //percentage > 100 || percentage < 30 ? this.setDanger() : this.removeDanger();
    if(percentage > 100){
      this.setDanger();
    } else if(percentage < 30) {
      this.setWarning();
    } else {
      console.log('remove')
      this.removeDanger();
      this.removeWarning();
    }
    let textY = y - 20;
    if(textY < 10) textY = 10;
    this.amountText.setAttribute("y", textY);
  }

  setDanger(){
    if(this.danger) return;
    this.danger = true;
    this.bar.setAttribute("fill", " url('#dangerGradient')");
  }

  removeDanger(){
    if(!this.danger) return;
    console.log('removing danger')
    this.danger = false;
    this.bar.setAttribute("fill", this.fill);
  }

  setWarning(){
    if(this.warning) return;
    this.warning = true;
    this.bar.setAttribute("fill", " url('#warningGradient')");
  }

  removeWarning(){
    if(!this.warning) return;
    console.log('removing danger')
    this.warning = false;
    this.bar.setAttribute("fill", this.fill);
  }

  moveTo(xpos) {
    this.x = xpos;
    this.group.setAttribute("transform", `translate(${this.x} ${this.y})`);
  }
}