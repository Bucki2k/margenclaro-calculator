# MargenClaro Open Calculator

The pricing engine behind the free calculator at [margenclaro.com/en/](https://margenclaro.com/en/) (Spanish: [margenclaro.com](https://margenclaro.com/)). This repository is an isolated copy of that already public engine, released under the MIT License. It is one dependency-free file, `calculator.js`, that works as a CommonJS module in Node and also registers `MargenClaro` as a global in browsers. Amounts are unitless: use one currency consistently. Pricing uses two decimals, without currency conversion or currency-specific rounding rules.

## Quick start

```js
const { calculate } = require('./calculator.js');

const quote = calculate({
  hours: 20, hourly: 15, direct: 100, overhead: 40,
  contingency: 0, feePercent: 5, feeFixed: 0.5, margin: 30, tax: 0
});

console.log(quote.price); // 677.7
```

```sh
node examples.js   # runs the worked example below
node --test        # runs the test suite (Node 18+)
```

## Worked example: a freelance project

A designer estimates 20 hours at an internal time cost of 15 per hour (labor 300), spends 100 on direct costs (stock assets, fonts) and assigns 40 of overhead (software, workspace). The hourly input excludes the margin added later. The client pays through a platform that charges 5% plus a 0.50 fixed fee. The designer wants a 30% margin.

- cost = 300 + 100 + 40 = 440
- price = (440 + 0.50) / (1 − 0.30 − 0.05) = 677.6923…, rounded up to **677.70**
- fee = 677.70 × 5% + 0.50 = 34.385
- profit = 677.70 − 440 − 34.385 = 203.315, an actual margin of 30.00%

Now the project takes 5 extra hours. Cost rises to 515. If the price cannot change, profit falls to 128.315 and the margin drops to **18.93%**. Re-pricing with `hours: 25` instead gives 793.08. The engine always re-prices; it has no fixed-price mode, so the 18.93% is derived from the returned `price`, `fee` and the new `cost`.

## Margin is not markup

Margin is profit as a share of price. Markup is profit as a share of cost. On a 440 cost, a 30% markup yields 572, which is only a 23.1% margin (fees ignored). A 30% margin needs 628.58 after rounding the price upward to cents, before fees. The engine works with margin, which is why it divides instead of multiplying:

```
price = (cost + fixedFee) / (1 − margin − feeRate)
```

## Assumptions the engine makes

- **Contingency** is a percentage of labor + direct + overhead, added to cost before pricing.
- **Percentage fees** are applied to the pretax price, then the fixed fee is added. If your platform charges fees on the taxed total, adjust the inputs yourself.
- **Price** uses upward rounding to two decimals, with standard JavaScript floating-point precision. `actualMargin` reports the modeled margin after rounding; a zero-price result returns zero.
- **Tax** is applied after pricing as a flat percentage of the price, rounded to the nearest cent. This is not a tax compliance engine: no jurisdictions, VAT rules, withholdings or invoicing logic.
- **Inputs** are the nine keys above, each a number or numeric string, zero or greater. Margin plus fee percent must stay below 100; contingency and tax cannot exceed 100. Error messages are in Spanish.
- **Outputs** also include `breakEven` (the price at which profit is zero), `labor`, `base`, `contingencyCost`, `priceRaw`, `taxAmount` and `total`.

## About the optional paid kit

MargenClaro also sells a separate, proprietary offline kit for a one-time US$19 before tax. It adds saved quotes, scenarios and a client PDF workflow. None of that is in this repository; only the calculator engine is MIT licensed here. The free web calculator and this engine do not require the kit.

## Status

This is a source release prepared for distribution. There are no usage figures, benchmarks or endorsements to report, and nothing here is tax, accounting or legal advice.

## Resumen en español

Este repositorio es una copia aislada del motor de la calculadora gratuita de [margenclaro.com](https://margenclaro.com/), con licencia MIT. Calcula el precio a partir de horas, costo interno por hora, costos directos, gastos generales, contingencia, comisiones, margen e impuesto. Con 20 horas a 15, 100 de costos directos, 40 de gastos generales, comisión del 5% más 0,50 fijo y margen del 30%, el precio es 677,70. Si el proyecto requiere 5 horas más sin cambiar el precio, el margen baja al 18,93%. El kit de pago (US$19 antes de impuestos, con presupuestos guardados, escenarios y PDF para el cliente) es un producto separado y no forma parte de este repositorio. No es una herramienta de cumplimiento fiscal.
