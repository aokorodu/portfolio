import { Utils } from './utils/utils';

export class BarSummary {
  constructor(x, y, title, w, centered = false) {
    this.x = x;
    this.y = y;
    this.title = title;
    this.w = w;
    this.group;
    this.titleText;
    this.line;

    this.subtitleElements;
    this.amountElements;
    this.footerSubtitle;
    this.footerAmount;

    this.lineY = 4;
    this.centered = centered;
    
  }

  show() {
    this.group.setAttribute("opacity", "1")
  }

  hide() {
    this.group.setAttribute("opacity", "0")
  }

  init(svg) {
    this.buildGroup(svg);
    this.initLine();
  }

  buildGroup(svg) {
    this.group = Utils.buildGroup();
    this.group.setAttribute("transform", `translate(${this.x} ${this.y})`)
    svg.appendChild(this.group);
  }

  initLine() {
    this.line = Utils.buildLine(0, this.lineY, 0, this.lineY, '#777777')
    this.group.appendChild(this.line)
  }

  initTitles(title, subtitles, footer) {
    this.initTitleText(title);
    this.initSubtitles(subtitles);
    this.initSubAmounts();
    this.initFooterSubtitle(footer);
    this.initFooterAmount();
  }

  initTitleText(title) {
    if (!this.titleText) {
      this.titleText = Utils.buildTextElement(0, 0, "start", "baseline", "#FFFFFF", "bar-summary-name");
      this.group.appendChild(this.titleText);
      this.title = title;
    }
    this.titleText.textContent = title;
  }

  initSubtitles(subtitles) {
    if (this.subtitleElements) {
      this.subtitleElements.map((textElement) => {
        this.group.removeChild(textElement);
      })
    }

    this.subtitleElements = [];
    subtitles.map((subtitle, i) => {
      const text = Utils.buildTextElement(0, 10 + (i * 15), "start", "hanging", "#FFFFFF", "bar-name", subtitle);
      this.subtitleElements.push(text);
      this.group.appendChild(text);
    })
  }

  initSubAmounts() {
    if (this.amountElements) {
      this.amountElements.map((textElement) => {
        this.group.removeChild(textElement);
      })
    }

    this.amountElements = [];
    const num = this.subtitleElements.length;

    for (let i = 0; i < num; i++) {
      const text = Utils.buildTextElement(0, 10 + (i * 15), "start", "hanging", "#FFFFFF", "bar-summary-title");
      this.centered ? text.setAttribute("text-anchor", "middle") : text.setAttribute("text-anchor", "end");
      this.amountElements.push(text);
      this.group.appendChild(text);
    }
  }

  initFooterSubtitle(footer) {
    if (!this.footerSubtitle) {
      this.footerSubtitle = Utils.buildTextElement(0, 10 + ((this.subtitleElements.length) * 15), "start", "hanging", "#FFFFFF", "bar-summary-footer");
      this.group.appendChild(this.footerSubtitle);
    }
    this.footerSubtitle.setAttribute("y", 10 + (this.subtitleElements.length * 15))
    
    this.footerSubtitle.textContent = footer;
  }

  initFooterAmount() {
    if (!this.footerAmount) {
      this.footerAmount = Utils.buildTextElement(0, 10 + (this.subtitleElements.length * 15), "middle", "hanging", "#FFFFFF", "bar-summary-footer");
      this.group.appendChild(this.footerAmount);
    }
    this.footerAmount.setAttribute("y", 10 + (this.subtitleElements.length * 15))
    this.centered ? this.footerAmount.setAttribute("text-anchor", "middle") : this.footerAmount.setAttribute("text-anchor", "end");
    this.footerAmount.textContent = "_";
  }

  updateTitle(newTitle) {
    this.title = newTitle;
    this.titleText.textContent = this.title;
  }

  update(subamounts, amount, w, newX = null) {
    this.w = w;
    this.updateSubAmounts(subamounts, w);
    this.footerAmount.textContent = amount;
    this.footerAmount.setAttribute("x", w);
    this.line.setAttribute("x2", w);
    if (newX) {
      this.x = newX;
      this.group.setAttribute("transform", `translate(${this.x} ${this.y})`);
    }
  }

  updateSubAmounts(subamounts, w) {
    const xpos = this.centered ? w / 2 : w;
    if (!this.amountElements) return;

    this.amountElements.map((text, i) => {
      text.setAttribute("x", xpos);
      text.textContent = subamounts[i];

    })
  }
}