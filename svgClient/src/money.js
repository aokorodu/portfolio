export class Money {
  constructor() {
    this.salary;
    // pretax 
    this.insurance;
    this.fourOneK;
    this.fourOneKPerc;
    this.preTax;
    this.preTaxPerc;

    // tax
    this.taxableIncome;
    this.tax
    // post tax
    this.afterTax;
    this.roth;
    this.rothPerc;
    // take home
    this.takeHome
    // amount invested
    this.totalInvested;
    this.futureValue;
    // movable money - 401k, tax, cash, and roth
    this.movableMoney;

    // match
    this.moneyMatch;
    this.moneyMatchPerc;

    // current yearly totals - hard coded values
    this.fourOneK_soFar = 2000;
    this.roth_soFar = 1200;
    this.totalInvested_soFar = 3200;
    this.totalInvested_soFar_Perc = 0;

    this.fourOneK_projected = 5000;
    this.roth_projected = 1200;
    this.totalInvested_projected = 6200;
    this.totalInvested_projected_Perc = 0;

    

    this.yearlyLimit = 19500;
    this.suggested_minimum_Invesment_Perc = 30; // suggested minimum percentage of yearly limit
    this.remainingPayPeriods = 16;
  }

  init(salary, insurance) {
    console.log('Money init()')
    this.salary = salary;
    this.insurance = insurance;
    this.fourOneKPerc = this.moneyyMatchPerc = 0;
    this.rothPerc = 0;
    this.initFormatter();
    this.update();
  }

  initFormatter() {
    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  }

  getSalary() {

  }

  updateFourOneKPerc(newPerc) {
    if (this.fourOneK == newPerc) return 0;

    const delta = newPerc - this.fourOneKPerc;
    //console.log('new 401k %: ', newPerc);
    this.fourOneKPerc = newPerc;
    // this.moneyMatchPerc = (this.fourOneKPerc + this.rothPerc) > 4 ? 4 : (this.fourOneKPerc + this.rothPerc);

    this.update();
    return delta;
  }

  updateRothPerc(newPerc) {
    if (this.rothPerc == newPerc) return false;
    if (this.salary * newPerc / 100 > this.afterTax) return false;
    const delta = newPerc - this.rothPerc;
    this.rothPerc = newPerc;
    // this.moneyMatchPerc = (this.fourOneKPerc + this.rothPerc) > 4 ? 4 : (this.fourOneKPerc + this.rothPerc);
    this.update();
    return delta;
  }

  update() {
    this.fourOneK = this.salary * this.fourOneKPerc / 100;
    
    this.taxableIncome = this.salary - this.insurance - this.fourOneK;
    this.preTax = this.salary - this.taxableIncome;
    this.preTaxPerc = this.preTax/this.salary * 100;
    this.tax = (this.taxableIncome * this.getFedTaxRate()) + (this.taxableIncome * this.getFedTaxRate()) + (this.taxableIncome * this.getCityTaxRate())
    this.afterTax = this.taxableIncome - this.tax;
    this.roth = this.salary * this.rothPerc / 100;
    if (this.roth > this.afterTax) {
      this.roth = this.afterTax;
      this.rothPerc = this.roth / this.salary * 100;
    }
    this.takeHome = this.afterTax - this.roth;
    this.totalInvested = this.fourOneK + this.roth;
    this.movableMoney = this.fourOneK + this.tax + this.takeHome + this.roth;

    this.futureValue = this.formatter.format(this.totalInvested * this.totalInvested);
    //console.log('f4: ', Number(this.fourOneKPerc), 'roth: ', this.rothPerc);
    this.moneyMatchPerc = Number(this.fourOneKPerc) + Number(this.rothPerc);
    
    if(this.moneyMatchPerc > 4) this.moneyMatchPerc = 4;
    //console.log('moneyMatchPerc:', this.moneyMatchPerc);
    this.moneyMatch = this.salary * this.moneyMatchPerc / 100;

    // yearly stuff
    this.fourOneK_projected = this.fourOneK_soFar + (this.fourOneK * this.remainingPayPeriods);
    this.roth_projected = this.roth_soFar + (this.roth * this.remainingPayPeriods);
    this.totalInvested_projected = this.fourOneK_projected + this.roth_projected;
    this.totalInvested_projected_Perc = this.totalInvested_projected/this.yearlyLimit * 100

    
    this.print();
  }

  // stub code for taxes

  getFedTaxRate() {
    return .14;
  }

  getStateTaxRate() {
    return .2;
  }

  getCityTaxRate() {
    return .1;
  }

  formatAmount(amount){
    return this.formatter.format(amount);
  }

  // print out all values

  print() {
    // console.log('salary: ', this.salary);
    // console.log('insurance: ', this.insurance);
    // console.log('fourOneK: ', this.fourOneK);
    // console.log('fourOneKPerc: ', this.fourOneKPerc);
    // console.log('taxableIncome: ', this.taxableIncome);
    // console.log('taxes: ', this.tax);
    // console.log('after tax: ', this.afterTax);
    // console.log('rothPerc: ', this.rothPerc);
    // console.log('roth: ', this.roth);
    // console.log('takeHome: ', this.takeHome);
    // console.log('totalInvested: ', this.totalInvested);

    // console.log('this.futureValue: ', this.futureValue)
    // console.log('this.moneyMatch ', this.moneyMatch)

    // console.log(`fourOneK projected: ${this.fourOneK_projected}`);
    // console.log(`roth projected: ${this.roth_projected}`);
    // console.log(`total invested projected: ${Math.round(this.totalInvested_projected)}`);
    // console.log(`total invested projected %: ${Math.round(this.totalInvested_projected_Perc)}%`);
    // console.log('----------------------------')
  }
}