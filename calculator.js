(function (root) {
  'use strict';
  function calculate(input) {
    const keys = ['hours','hourly','direct','overhead','contingency','feePercent','feeFixed','margin','tax'];
    const x = {};
    for (const key of keys) {
      const raw = input[key];
      if (raw === '' || raw === null || raw === undefined || typeof raw === 'boolean') throw new Error('Completa todos los campos con números.');
      x[key] = Number(raw);
      if (!Number.isFinite(x[key]) || x[key] < 0) throw new Error('Usa números válidos, iguales o mayores que cero.');
    }
    if (x.margin + x.feePercent >= 100) throw new Error('El margen y la comisión deben sumar menos de 100%.');
    if (x.contingency > 100 || x.tax > 100) throw new Error('La contingencia y el impuesto deben estar entre 0% y 100%.');
    const labor = x.hours*x.hourly;
    const base = labor+x.direct+x.overhead;
    const contingencyCost = base*x.contingency/100;
    const cost = base+contingencyCost;
    const priceRaw = (cost+x.feeFixed)/(1-(x.feePercent+x.margin)/100);
    const price = Math.ceil((priceRaw-1e-9)*100)/100;
    const fee = price*x.feePercent/100+x.feeFixed;
    const profit = price-cost-fee;
    const taxAmount = Math.round(price*x.tax)/100;
    const total = price+taxAmount;
    const breakEven = (cost+x.feeFixed)/(1-x.feePercent/100);
    if (![labor,base,cost,price,fee,profit,total,breakEven].every(Number.isFinite) || price > 1e12) throw new Error('Los valores son demasiado grandes. Reduce los importes.');
    return {labor,base,contingencyCost,cost,priceRaw,price,fee,profit,taxAmount,total,breakEven,actualMargin:price ? profit/price*100 : 0};
  }
  const api = {calculate};
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
  root.MargenClaro=api;
})(typeof globalThis === 'undefined' ? this : globalThis);
