const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const taxRate = [
  { id:0, min:0, max: 9700, tax: .10, amount:970 },
  { id:1, min:9701, max: 39475, tax: .12, amount:4542},
  { id:2, min:39476, max: 84200, tax: .22, amount:14381},
  { id:3, min:84201, max: 160725, tax: .24, amount:32746},
  { id:4, min:160726, max: 204100, tax: .32, amount:32244},
  { id:5, min:204101, max: 510300, tax: .35, amount:139413},
  { id:6, min:510301, max: 100000000, tax: .37, amount:0 },
];


// routes
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/taxrate/:bracketid/:state/:city', (req, res) => {
  res.send(req.params);
})

app.get('/api/taxrate/:salary', (req, res) =>{
  const salary = parseInt(req.params.salary);
 const taxes = getTaxes(salary);
  res.send(`taxes ${taxes}`);
})

const getTaxes = (salary)=>{
  const trate = taxRate.find(s =>(salary >= s.min) && (salary <= s.max));
  const marginalTaxRate = trate.tax;
  const marginalAmount = (salary - trate.min) * marginalTaxRate;
  let id = trate.id;
  let amount = id > 0 ? taxRate[id-1].amount + marginalAmount : marginalAmount;

  return Math.round(amount);
}

// start listening to the server
app.listen(port, () => { console.log(`listening on the port ${port}!`) });