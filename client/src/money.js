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
  }

  init(salary = 3000, insurance = 150) {
    console.log('Money init()')
    this.initProps(salary, insurance);
    this.initFormatter();
    this.update();
  }

  initProps(salary, insurance){
    this.salary = salary;
    this.insurance = insurance;
    this.fourOneKPerc = this.moneyyMatchPerc = 0;
    this.rothPerc = 0;
  }

  initFormatter() {
    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  getSalary() {

  }

  updateFourOneKPerc(newPerc) {
    if (this.fourOneK == newPerc) return 0;

    const delta = newPerc - this.fourOneKPerc;
    this.fourOneKPerc = newPerc;
    this.update();
    
    return delta;
  }

  updateRothPerc(newPerc) {
    if (this.rothPerc == newPerc) return false;
    if (this.salary * newPerc / 100 > this.afterTax) return false;
    const delta = newPerc - this.rothPerc;
    this.rothPerc = newPerc;
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
    this.moneyMatchPerc = Number(this.fourOneKPerc) + Number(this.rothPerc);
    
    if(this.moneyMatchPerc > 4) this.moneyMatchPerc = 4;
    this.moneyMatch = this.salary * this.moneyMatchPerc / 100;
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

    //console.log('this.futureValue: ', this.futureValue)
    //console.log('this.moneyMatch ', this.moneyMatch)
  }
}