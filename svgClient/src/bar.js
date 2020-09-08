import { Utils } from './utils/utils';
import gsap from 'gsap';

export class Bar {
  constructor(title, fill, x, y, w, locked = false) {
    this.title = title;
    this.fill = fill.indexOf("#") > -1 ? fill : `url('#${fill}')`;
    this.x = x;
    this.y = y;
    this.min = 30;
    this.w = w;
    this.titleText = null;
    this.titleTextWidth = 0;
    this.amountText = null;
    this.rect = null;
    this.handle = null;
    this.dragging = false;
    this.group = null;
    this.h = 50;
    this.locked = locked;
    this.ns = "http://www.w3.org/2000/svg";

    this.hidden = false;
  }

  trueWidth() {
    return this.w + this.min;
  }

  build(svg, amount = "$0") {
    this.buildGroup(svg);
    this.buildBody();

    if (!this.locked) {
      this.buildHandle();
      this.addHandleListeners();
    }

    this.buildText(amount);
  }

  buildGroup(svg) {
    this.group = Utils.buildGroup();
    this.group.setAttribute("class", `bar`);
    this.group.setAttribute("transform", `translate(${this.x} ${this.y})`)
    svg.appendChild(this.group);
  }

  buildBody() {
    this.rect = document.createElementNS(this.ns, "rect");
    this.rect.setAttribute("x", 0);
    this.rect.setAttribute("y", 25);
    this.rect.setAttribute("width", this.w + this.min);
    this.rect.setAttribute("height", this.h - 10);
    this.rect.setAttribute("rx", 4);
    this.rect.setAttribute("opacity", 1);
    this.rect.setAttribute("fill", this.fill);

    this.group.appendChild(this.rect);
  }

  buildText() {
    this.buildTitleText();
    this.buildAboutText();
  }

  buildTitleText() {
    this.titleText = Utils.buildTextElement(0, 0, "start", "hanging", "#D8D8D8", "bar-name", this.title);
    this.group.appendChild(this.titleText);

  }

  buildAboutText() {
    this.amountText = Utils.buildTextElement(0, 25 + this.h, "middle", "hanging", "#ffffff", "bar-number")
    this.group.appendChild(this.amountText);
  }

  buildHandle() {
    this.handle = document.createElementNS(this.ns, "rect");
    this.handle.setAttribute("x", this.w);
    this.handle.setAttribute("y", 20);
    this.handle.setAttribute("width", this.min);
    this.handle.setAttribute("height", this.h);
    this.handle.setAttribute("rx", 4);
    //this.handle.setAttribute("opacity", 0.6);
    this.handle.setAttribute("fill", "#d8d8d8");

    this.group.appendChild(this.handle);
  }

  addHandleListeners() {
    this.handle.addEventListener("mousedown", () => {
      if (this.locked) return;
      this.dragging = true;
    });
    this.handle.addEventListener("mouseup", () => {
      if (this.locked) return;
      this.dragging = false;
    });
  }

  resize(newWidth) {
    if (this.w == newWidth) return;

    this.w = newWidth;
    const actualWidth = this.w + this.min
    this.rect.setAttribute("width", actualWidth);
    if (actualWidth < this.titleTextWidth) {
      this.titleText.setAttribute("dx", (actualWidth - this.titleTextWidth) / 2);
    } else {
      this.titleText.setAttribute("dx", 0);
    }
    if (!this.locked) this.handle.setAttribute("x", this.w);
  }

  updateAmount(newAmount) {
    this.amountText.textContent = newAmount;
    const xpos = this.locked ? (this.w + this.min) / 2 : this.w + this.min / 2;
    this.amountText.setAttribute("x", xpos);
  }

  moveTo(xpos, transition) {
    this.show();

    if (!transition) {
      this.x = xpos;
      this.group.setAttribute("transform", `translate(${this.x} ${this.y})`);
      return;
    }

    const oldX = this.x;
    this.x = xpos;
    const xObj = { x: oldX };
    gsap.to(xObj, {
      duration: .5, ease: "power2.out", x: xpos, onUpdate: () => {
        this.group.setAttribute("transform", `translate(${xObj.x} ${this.y})`);
      }
    })
  }

  show() {
    if (!this.hidden) return;
    this.hidden = false;
    
    this.group.setAttribute("opacity", 1);
    this.group.setAttribute("pointer-events", "visible");
  }

  hide() {
    if (this.hidden) return;
    this.hidden = true;
    this.group.setAttribute("opacity", 0);
    this.group.setAttribute("pointer-events", "none");
  }
}