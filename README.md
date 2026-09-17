# MargenClaro Open Calculator

The pricing engine behind the free calculator at [margenclaro.com/en/](https://margenclaro.com/en/) (Spanish: [margenclaro.com](https://margenclaro.com/)). This repository is an isolated copy of that already public engine, released under the MIT License. It is one dependency-free file, `calculator.js`, that works as a CommonJS module in Node and also registers `MargenClaro` as a global in browsers. Amounts are unitless: use one currency consistently. Pricing uses two decimals, without currency conversion or currency-specific rounding rules.

## Use the calculator without code

Open the **[free installable calculator in English](https://margenclaro.com/app/en/)** or **[español](https://margenclaro.com/app/)**. Estimate a service project's price from your time, costs, contingency, payment fees and target margin. Choose from 46 currency labels; amounts are not converted.

The page includes installation instructions for your browser. Once it reports **“Ready for offline use”**, the calculator and examples work without a connection. Your figures are not saved or sent; closing, reloading, updating or changing language may lose them. The website, toolkit purchase and support links still need a connection.

This is an installable web app, not an App Store or Google Play listing. This repository contains the MIT-licensed calculation engine; the hosted interface is not included in this source release.

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

## Agree the change before starting

Use the free [scope-change worksheet and client message](https://margenclaro.com/en/resources/scope-change-template/) ([Spanish version](https://margenclaro.com/recursos/cambios-de-alcance/)) to apply the example above. Download a four-page printable PDF and editable TXT messages in English and Spanish, without signing up or providing an email. The web calculator runs in your browser; Node is not required.

Check the current agreement first: revisions already included stay included. For work outside that scope, recalculate costs privately and confirm the scope, additional charge and delivery date in writing before scheduling it. A first reply you can adapt:

> Thanks for the request. I'll check what our agreement includes, then confirm any additional charge and revised delivery date before we schedule the change.

The separate download has its own use permission in its LEEME file. It is not included in this MIT repository; the paid toolkit is a separate product.

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

The engine source is public in this GitHub repository under the MIT License. There are no usage figures, benchmarks or endorsements to report, and nothing here is tax, accounting or legal advice.

## Resumen en español

Este repositorio es una copia aislada del motor de la calculadora gratuita de [margenclaro.com](https://margenclaro.com/), con licencia MIT. Calcula el precio a partir de horas, costo interno por hora, costos directos, gastos generales, contingencia, comisiones, margen e impuesto. Con 20 horas a 15, 100 de costos directos, 40 de gastos generales, comisión del 5% más 0,50 fijo y margen del 30%, el precio es 677,70. Si el proyecto requiere 5 horas más sin cambiar el precio, el margen baja al 18,93%. El recurso gratuito de cambios de alcance ([margenclaro.com/recursos/cambios-de-alcance/](https://margenclaro.com/recursos/cambios-de-alcance/)) usa este mismo ejemplo (nuevo precio 793,08) y se descarga sin registro: PDF imprimible, mensajes TXT editables y LEEME con su propio permiso de uso; no forma parte de este repositorio ni tiene licencia MIT. El kit de pago (US$19 antes de impuestos, con presupuestos guardados, escenarios y PDF para el cliente) es un producto separado y no forma parte de este repositorio. No es una herramienta de cumplimiento fiscal.

También puedes abrir la **[calculadora gratuita instalable en español](https://margenclaro.com/app/)** ([English](https://margenclaro.com/app/en/)) sin usar código. Sigue las instrucciones de la página para añadirla a tu pantalla de inicio. Cuando indique «Lista para usar sin conexión», podrás calcular sin internet. Las cifras no se guardan ni se envían; los enlaces al sitio, compra y soporte requieren conexión. Es una app web, todavía sin publicación en App Store o Google Play; este repositorio solo contiene el motor con licencia MIT.

