import { Bar } from './bar';
import { BarTotal } from './barTotal';
import {BarSpecial} from './barSpecial';
//import gsap from 'gsap';
import { BarSummary } from './barSummary';
import { ProjectionWarning } from './projectionWarning';

export class BarView {
  constructor() {
    console.log('BarView')
    this.money;
    this.svg;
    this.svgPT;
    this.viewMenu;
    this.viewMenuItems = [];
    this.selectedView = "";
    this.w;
    this.h;

    this.bars = [];
    this.takeHomeBar, this.taxBar, this.insBar, this.rothBar, this.fourKBar, this.matchBar;
    this.projectedTotalBar;
    this.barGap = 15;
    this.barGapBig = 50;
    this.totalBarLength;
    this.ppp; // pixels per percent;

    this.barSummary_a;
    this.barSummary_b;
    this.barSummary_c;
    this.barSummary_Total;
    this.projectionWarning;
  }

  init(money) {
    console.log('BarView.init()');
    this.initSVG();
    this.initProps(money);
    this.initViewMenu();
    this.initBars();
    this.initBarSummary();
    this.initSalaryTotal();
    this.selectView("Full Paycheck", false)
  }

  initSalaryTotal(){
    const salary = document.getElementById('salary');
    salary.innerHTML = this.money.formatAmount(this.money.salary);
  }

  initSVG() {
    const holder = document.getElementById('bars-holder');
    this.svg = document.getElementById('bars-svg');
    this.w = holder.offsetWidth;
    this.h = holder.offsetHeight;
    this.svg.setAttribute("viewBox", `0 0 ${this.w} ${this.h}`);
    this.svg.addEventListener("mousemove", (e) => {
      this.moveHandler(e);
    });
    this.svg.addEventListener("mouseup", (e) => {
      this.bars.map((bar) => {
        bar.dragging = false;
      });
    });
    document.addEventListener("mouseup", (e) => {
      this.bars.map((bar) => {
        bar.dragging = false;
      });
    });

    this.svgPT = this.svg.createSVGPoint();
  }

  moveHandler(e) {

    this.svgPT.x = e.clientX - 7.5;
    this.svgPT.y = e.clientY;
    const svgP = this.svgPT.matrixTransform(this.svg.getScreenCTM().inverse());

    this.bars.map((bar, index) => {
      if (bar.dragging) {
        const w = svgP.x - bar.x;
        let percentage = w / this.ppp;
        percentage = percentage < 0 ? 0 : percentage > 50 ? 50 : percentage;
        bar.title == "roth" ? this.money.updateRothPerc(percentage) : this.money.updateFourOneKPerc(percentage);
        this.arrangeBars(false);
      }
    });
  }

  initProps(money) {
    this.money = money;
    this.totalBarLength = this.w - ((6 * 30) + (3 * this.barGap) + (2 * this.barGapBig));
    this.ppp = this.totalBarLength / 104; // divide by 104 because matching is 4%, so total % must = 104
  }

  initViewMenu() {
    this.viewMenu = document.getElementById('bar-view-menu');
    this.viewMenuItems = Array.from(document.getElementsByClassName('view-item'));
    this.viewMenuItems.map((item) => {
      item.addEventListener("click", () => {
        this.selectView(item.innerHTML)
        this.viewMenuItems.forEach((checkItem) => {
          item == checkItem ? checkItem.classList.add('view-item-selected') : checkItem.classList.remove('view-item-selected');
        })
      })
    })
    this.viewMenuItems[0].classList.add('view-item-selected');
  }

  selectView(newView, transition=true) {
    if (newView == this.selectedView) return;
    this.selectedView = newView;
    this.updateViewBarSummary();
    this.arrangeBars(transition);
  }

  initBars() {
    this.takeHomeBar = new BarSpecial("take home", 'blueGradient', 0, 0, 100, true);
    this.takeHomeBar.build(this.svg);

    this.taxBar = new Bar("tax", 'redGradient', 0, 0, 100, true);
    this.taxBar.build(this.svg);

    this.fourKBar = new Bar("401k", 'darkgreenGradient', 0, 0, 100, false);
    this.fourKBar.build(this.svg);

    this.rothBar = new Bar("roth", 'purpleGradient', 0, 0, 100, false);
    this.rothBar.build(this.svg);

    this.insBar = new Bar("ins", 'mangoGradient', 0, 0, 100, true);
    this.insBar.build(this.svg);
    this.insBar.resize((this.money.insurance / this.money.salary * 100) * this.ppp, this.money.formatAmount(this.money.insurance));
    this.insBar.updateAmount(this.money.formatAmount(this.money.insurance));
    this.insBar.moveTo(0);

    this.matchBar = new Bar("match", 'greenGradient', 0, 0, 100, true);
    this.matchBar.build(this.svg);

    this.bars.push(this.takeHomeBar, this.taxBar, this.fourKBar, this.rothBar, this.insBar, this.matchBar);

    this.projectedTotalBar = new BarTotal("Projected Total 2020", "projectionGradient", 0, 0, 115, 200);
    this.projectedTotalBar.build(this.svg);
  }

  arrangeBars(transition) {
    this.arrange_Paycheck_View(transition);
    this.arrange_Tax_View(transition);
    this.arrange_Investment_View(transition);
  }

  arrange_Paycheck_View(transition) {
    if (this.selectedView != "Full Paycheck") return;

    this.resizeBars();
    this.updateBarAmounts();

    this.insBar.moveTo(0, transition);
    this.fourKBar.moveTo(this.insBar.x + this.insBar.trueWidth() + this.barGap, transition);
    this.taxBar.moveTo(this.fourKBar.x + this.fourKBar.trueWidth() + this.barGap, transition);
    this.rothBar.moveTo(this.taxBar.x + this.taxBar.trueWidth() + this.barGap, transition);
    this.takeHomeBar.moveTo(this.rothBar.x + this.rothBar.trueWidth() + this.barGap, transition);
    this.matchBar.moveTo(this.takeHomeBar.x + this.takeHomeBar.trueWidth() + this.barGapBig, transition);
    this.projectedTotalBar.moveTo(this.w, transition);
    this.updateBarSummary_FullPaycheck();
  }

  updateBarSummary_FullPaycheck(){
    const totals = [this.money.formatAmount(this.money.fourOneK), this.money.formatAmount(this.money.roth), this.money.formatAmount(this.money.moneyMatch)];
    const total = this.money.formatAmount(this.money.totalInvested + this.money.moneyMatch);
    this.barSummary_a.update(totals, total, this.w/3);

  }

  arrange_Tax_View(transition) {
    if (this.selectedView != "Tax View") return;

    this.resizeBars();
    this.updateBarAmounts();

    this.insBar.moveTo(0, transition);
    this.fourKBar.moveTo(this.insBar.x + this.insBar.trueWidth() + this.barGap, transition);
    this.taxBar.moveTo(this.fourKBar.x + this.fourKBar.trueWidth() + this.barGapBig, transition);
    this.rothBar.moveTo(this.taxBar.x + this.taxBar.trueWidth() + this.barGap, transition);
    this.takeHomeBar.moveTo(this.rothBar.x + this.rothBar.trueWidth() + this.barGap, transition);
    this.matchBar.moveTo(this.takeHomeBar.x + this.takeHomeBar.trueWidth() + this.barGapBig, transition);
    this.projectedTotalBar.moveTo(this.w, transition);
    this.updateBarSummary_Tax()
  }

  updateBarSummary_Tax() {
    const pretaxSubtotals = [this.money.formatAmount(this.money.insurance), this.money.formatAmount(this.money.fourOneK)];
    const pretaxTotal = this.money.formatAmount(this.money.insurance + this.money.fourOneK);
    this.barSummary_a.update(pretaxSubtotals, pretaxTotal, this.insBar.trueWidth() + this.barGap + this.fourKBar.trueWidth());

    const taxIncomeSubtotals = [this.money.formatAmount(this.money.tax), this.money.formatAmount(this.money.roth), this.money.formatAmount(this.money.takeHome)];
    const taxIncomeTotal = this.money.formatAmount(this.money.taxableIncome)
    this.barSummary_b.update(taxIncomeSubtotals, taxIncomeTotal, (this.takeHomeBar.x - this.taxBar.x) + this.takeHomeBar.trueWidth(), this.taxBar.x);

    this.barSummary_c.update([this.money.formatAmount(this.money.moneyMatch)], "", this.matchBar.trueWidth(), this.matchBar.x)
  }

  arrange_Investment_View(transition) {
    if (this.selectedView != "Contributions View") return;

    this.resizeBars();
    this.updateBarAmounts();

    this.fourKBar.moveTo(0, transition);
    this.rothBar.moveTo(this.fourKBar.x + this.fourKBar.trueWidth() + this.barGap, transition);
    this.matchBar.hide();
    this.takeHomeBar.hide();
    this.insBar.hide();
    this.taxBar.hide();

    const investSubTotals = [this.money.formatAmount(this.money.fourOneK), this.money.formatAmount(this.money.roth), this.money.formatAmount(this.money.moneyMatch)];
    const investTotal = this.money.formatAmount(this.money.totalInvested);
    let w = this.rothBar.x + this.rothBar.trueWidth();
    if(w < 120) w = 120;
    this.barSummary_a.update(investSubTotals, investTotal, w);


    const investProjections = [this.money.formatAmount(this.money.fourOneK_projected), this.money.formatAmount(this.money.roth_projected)];
    let xpos = this.rothBar.x + this.rothBar.trueWidth() + this.barGapBig;
    if (xpos < this.w / 2) xpos = this.w / 2;
    this.barSummary_Total.update(investProjections, "", 200, xpos);


    this.projectionWarning.moveTo(xpos);
    if(this.money.totalInvested_projected_Perc < this.money.suggested_minimum_Invesment_Perc || this.money.totalInvested_projected_Perc > 100){
      this.money.totalInvested_projected_Perc < this.money.suggested_minimum_Invesment_Perc ? this.projectionWarning.show(false) : this.projectionWarning.show(true)
    } else {
      this.projectionWarning.hide();
    }
    //this.money.totalInvested_projected_Perc > 100 ? this.projectionWarning.show() : this.projectionWarning.hide();

    this.projectedTotalBar.updateAmount(this.money.formatAmount(this.money.totalInvested_projected), this.money.totalInvested_projected_Perc);
    
    this.projectedTotalBar.moveTo(this.barSummary_Total.x + this.barSummary_Total.w + this.barGap);

    
  }

  resizeBars() {
    this.fourKBar.resize(this.money.fourOneKPerc * this.ppp, this.money.formatAmount(this.money.fourOneK));
    this.taxBar.resize((this.money.tax / this.money.salary * 100) * this.ppp, this.money.formatAmount(this.money.tax));
    this.rothBar.resize(this.money.rothPerc * this.ppp, this.money.formatAmount(this.money.roth));
    this.takeHomeBar.resize((this.money.takeHome / this.money.salary * 100) * this.ppp, this.money.formatAmount(this.money.takeHome));
    this.matchBar.resize(this.money.moneyMatchPerc * this.ppp, this.money.formatAmount(this.money.moneyMatch));
  }

  updateBarAmounts() {
    this.fourKBar.updateAmount(`${Math.round(this.money.fourOneKPerc)}%`);
    this.taxBar.updateAmount(this.money.formatAmount(this.money.tax));
    this.rothBar.updateAmount(`${Math.round(this.money.rothPerc)}%`);
    this.takeHomeBar.updateAmount(this.money.formatAmount(this.money.takeHome));
    this.matchBar.updateAmount(`${Math.round(this.money.moneyMatchPerc)}%`);
  }

  initBarSummary() {
    this.barSummary_a = new BarSummary(0, 125, "", 100);
    this.barSummary_a.init(this.svg);

    this.barSummary_b = new BarSummary(0, 125, "", 100);
    this.barSummary_b.init(this.svg);

    this.barSummary_c = new BarSummary(0, 125, "", 100, true);
    this.barSummary_c.init(this.svg);

    this.barSummary_Total = new BarSummary(0, 125, 'Projected 2020 Total', 100);
    this.barSummary_Total.init(this.svg);

    this.projectionWarning = new ProjectionWarning(0, 0);
    this.projectionWarning.init(this.svg);
  }

  updateViewBarSummary() {
    switch (this.selectedView) {
      case "Tax View":
        this.barSummary_a.initTitles("Pre-tax", ["Ins.", "401k"], "Total");
        this.barSummary_b.initTitles("Taxable Income", ["Tax", "Roth", "Take Home"], "Total");
        this.barSummary_c.initTitles("Match", [""], "");
        this.barSummary_Total.initTitles("Procjected 2020 Total", ["401k", "Roth"], "");

        this.barSummary_a.show();
        this.barSummary_b.show();
        this.barSummary_c.show();
        this.barSummary_Total.hide();
        this.projectionWarning.hide();
        break;

      case "Contributions View":
        this.barSummary_a.initTitles("Contributions", ["401k", "Roth", "Match **"], "Total");
        this.barSummary_Total.initTitles("Procjected 2020 Total", ["401k", "Roth"], "");

        this.barSummary_a.show();
        this.barSummary_b.hide();
        this.barSummary_c.hide();
        this.barSummary_Total.show();
        this.projectionWarning.hide();
        break;

      case "Full Paycheck":
        this.barSummary_a.initTitles("Total Invested", ["401k.", "Roth", "Matching"], "Total");

        this.barSummary_a.show();
        this.barSummary_b.hide();
        this.barSummary_c.hide();
        this.barSummary_Total.hide();
        this.projectionWarning.hide();

        break;
    }

  }






}