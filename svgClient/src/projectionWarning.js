import { Utils } from './utils/utils';

export class ProjectionWarning {
  constructor(x, y, min="$5,000", max="$19,500") {
    this.x = x;
    this.y = y;
    this.min = min;
    this.max = max
    this.group;
    this.overGroup;
    this.lowGroup;
    this.textGroup;
    this.ypositions = [0, 13, 32, 47, 62, 77, 95];
    this.overSentences = [
      "At this rate you will exceed",
      "your 2020 max contributions",
      `You can contribute up to ${max}`,
      "per year to your 401k (Not including",
      "matching). If you exceed the limit",
      "you will have to pay a penalty.",
      "Read More.",
    ];
    this.lowSentences = [
      "Your projected contributions ",
      "for 2020 are a little low.",
      `You should strive to contribute`,
      `at least ${max} per year to your `,
      "retirement account.",
      "",
      "Read More.",
    ];

    this.hidden = true;
  }

  show(over = true) {
    if(!this.hidden) return;
    this.hidden = false;
    over ? this.showOver() : this.showLow();
  }

  showLow(){
    this.lowGroup.classList.add('showing');
    this.lowGroup.classList.remove('hiding');
  }

  showOver(){
    this.overGroup.classList.add('showing');
    this.overGroup.classList.remove('hiding');
  }

  hide() {
    if(this.hidden) return;
    this.hidden = true;
    this.overGroup.classList.remove('showing');
    this.overGroup.classList.add('hiding');
    this.lowGroup.classList.remove('showing');
    this.lowGroup.classList.add('hiding');
  }

  init(svg){
    this.buildGroup(svg);
    this.buildText();
  }

  buildGroup(svg) {
    this.group = Utils.buildGroup();
    this.group.setAttribute("transform", `translate(${this.x} ${this.y})`);
    svg.appendChild(this.group);
  }

  buildText(){
    // over
    this.overGroup = Utils.buildGroup();
    this.overGroup.setAttribute("transform", `translate(${this.x} ${this.y})`);
    this.overGroup.classList.add('hiding');
    this.group.appendChild(this.overGroup);
    this.overSentences.map((sentence, i)=>{
      const style = i < 2 ? 'warning-header' : i == this.overSentences.length - 1 ? 'warning-link' : 'warning-text'
      const text = Utils.buildTextElement(0, this.ypositions[i], "start", "hanging", '#d8d8d8', style, sentence);
      this.overGroup.appendChild(text);
    })

    // low
    this.lowGroup = Utils.buildGroup();
    this.lowGroup.setAttribute("transform", `translate(${this.x} ${this.y})`);
    this.lowGroup.classList.add('hiding');
    this.group.appendChild(this.lowGroup);
    this.lowSentences.map((sentence, i)=>{
      const style = i < 2 ? 'warning-header' : i == this.lowSentences.length - 1 ? 'warning-link' : 'warning-text'
      const text = Utils.buildTextElement(0, this.ypositions[i], "start", "hanging", '#d8d8d8', style, sentence);
      this.lowGroup.appendChild(text);
    })
  }

  moveTo(xpos) {
    this.x = xpos;
    this.group.setAttribute("transform", `translate(${this.x} ${this.y})`);
  }

}