'use strict';
const {calculate} = require('./calculator.js');
const project = {hours:20, hourly:15, direct:100, overhead:40, contingency:0, feePercent:5, feeFixed:0.5, margin:30, tax:0};
const quote = calculate(project);
const revised = calculate({...project, hours:25});
const unchangedPriceMargin = (quote.price - revised.cost - quote.fee) / quote.price * 100;
const fixed = value => value.toFixed(2);
console.log('Illustrative project, one currency, before tax');
console.log(`Internal cost: ${fixed(quote.cost)}; target-margin price: ${fixed(quote.price)}`);
console.log(`Five additional hours at 15/hour add ${fixed(revised.cost-quote.cost)} to cost.`);
console.log(`Keep the original price: remaining margin ${fixed(unchangedPriceMargin)}%.`);
console.log(`Reprice to preserve 30%: ${fixed(revised.price)} (+${fixed(revised.price-quote.price)}).`);
const marginQuote = calculate({...project,hours:0,hourly:0,direct:100,overhead:0,feePercent:0,feeFixed:0});
console.log(`Cost 100 + 30% markup = 130 (margin ${fixed(30/130*100)}%).`);
console.log(`Cost 100 with a 30% margin = ${fixed(marginQuote.price)}.`);

