'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {calculate} = require('./calculator.js');
const base = {hours:20,hourly:15,direct:100,overhead:40,contingency:0,feePercent:5,feeFixed:0.5,margin:30,tax:0};
const close = (actual, expected, tolerance=1e-8) => assert.ok(Math.abs(actual-expected) <= tolerance, `${actual} differs from ${expected}`);

test('a quote covers all costs and the payment fee before the requested margin', () => {
  const q = calculate(base);
  assert.equal(q.cost,440);
  assert.equal(q.price,677.70);
  close(q.fee,34.385);
  close(q.profit,203.315);
  close(q.price,q.cost+q.fee+q.profit);
  assert.ok(q.actualMargin>=30);
});
test('extra hours reduce fixed-price margin and require a higher replacement quote', () => {
  const q = calculate(base), more = calculate({...base,hours:25});
  assert.equal(more.cost-q.cost,75);
  assert.equal(more.price,793.08);
  assert.equal(((q.price-more.cost-q.fee)/q.price*100).toFixed(2),'18.93');
});
test('30 percent markup and 30 percent margin are different', () => {
  const q = calculate({...base,hours:0,direct:100,overhead:0,feePercent:0,feeFixed:0});
  assert.equal(q.price,142.86);
  assert.equal((30/130*100).toFixed(2),'23.08');
});
test('contingency applies to labor plus direct costs and overhead', () => {
  const q=calculate({...base,contingency:10});
  assert.equal(q.contingencyCost,44);
  assert.equal(q.cost,484);
});
test('tax is added after pricing; it does not change the modeled pretax fee', () => {
  const q=calculate(base), taxed=calculate({...base,tax:20});
  assert.equal(taxed.price,q.price);
  assert.equal(taxed.fee,q.fee);
  assert.equal(taxed.taxAmount,135.54);
  close(taxed.total,813.24);
});
test('upward cent rounding covers the inverse formula across representative inputs', () => {
  for(const cost of [0.01,1,99.99,440,10000]) for(const margin of [0,15,30,60]) for(const fee of [0,2.9,5]) {
    const q=calculate({...base,hours:0,direct:cost,overhead:0,margin,feePercent:fee});
    const exact=(cost+0.5)/(1-(margin+fee)/100);
    assert.ok(q.price+1e-8>=exact);
    assert.ok(q.price-exact<0.01+1e-8);
    close(q.price*100,Math.round(q.price*100),1e-6);
    assert.ok(q.profit+1e-8>=q.price*margin/100);
  }
});
test('impossible percentages, incomplete inputs and unusable amounts fail', () => {
  for(const patch of [{hours:''},{hours:undefined},{hours:null},{hours:true},{hours:'oops'},
    {hours:-1},{hourly:Infinity},{direct:NaN},{margin:95,feePercent:5},
    {contingency:101},{tax:101},{direct:1e13}]) assert.throws(()=>calculate({...base,...patch}));
});
test('numeric form strings work without mutating the input', () => {
  const strings=Object.fromEntries(Object.entries(base).map(([k,v])=>[k,String(v)]));
  const snapshot={...strings};
  assert.deepEqual(calculate(strings),calculate(base));
  assert.deepEqual(strings,snapshot);
});

