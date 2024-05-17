// https://observablehq.com/@mbostock/the-wealth-health-of-nations@202
import define1 from "./450051d7f1174df8@255.js";

function _1(md){return(
md`# 国の富と健康
このグラフは、過去209年間にわたるさまざまな国の豊かさと健康さを示しています。一つ一つの〇は国を表しています。<br><br>

x軸：一人当たりの所得<br>
　国の一人あたりの平均的な収入を示しています。右にある国ほど、お金持ちの国です。\n

y軸：平均寿命<br>
　国の人々がどれくらい長生きするかを示しています。上にある国ほど、長生きの人が多いです。\n

円の大きさ：人口<br>
　その国にどれくらいの人が住んでいるかを示しています\n

<br><br>
このグラフからどんなことが読み取れるだろう？
<br>
視点のヒント：お金持ちの国の平均寿命はどうなっているだろう
`
)}

function _date(Scrubber,dates){return(
Scrubber(dates, {format: d => d.getUTCFullYear(), loop: false})
)}

function _legend(DOM,html,margin,color)
{
  const id = DOM.uid().id;
  return html`<style>

.${id} {
  display: inline-flex;
  align-items: center;
  margin-right: 1em;
}

.${id}::before {
  content: "";
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
  background: var(--color);
}

</style><div style="display: flex; align-items: center; min-height: 33px; font: 10px sans-serif; margin-left: ${margin.left}px;"><div>${color.domain().map(region => html`<span class="${id}" style="--color: ${color(region)}">${document.createTextNode(region)}</span>`)}`;
}


function _chart(d3,width,height,xAxis,yAxis,grid,dataAt,x,y,radius,color)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("g")
      .call(grid);

  const circle = svg.append("g")
      .attr("stroke", "black")
    .selectAll("circle")
    .data(dataAt(1800), d => d.name)
    .join("circle")
      .sort((a, b) => d3.descending(a.population, b.population))
      .attr("cx", d => x(d.income))
      .attr("cy", d => y(d.lifeExpectancy))
      .attr("r", d => radius(d.population))
      .attr("fill", d => color(d.region))
      .call(circle => circle.append("title")
        .text(d => [d.name, d.region].join("\n")));

  return Object.assign(svg.node(), {
    update(data) {
      circle.data(data, d => d.name)
          .sort((a, b) => d3.descending(a.population, b.population))
          .attr("cx", d => x(d.income))
          .attr("cy", d => y(d.lifeExpectancy))
          .attr("r", d => radius(d.population));
    }
  });
}


function _update(chart,currentData){return(
chart.update(currentData)
)}

function _currentData(dataAt,date){return(
dataAt(date)
)}

function _x(d3,margin,width){return(
d3.scaleLog([200, 1e5], [margin.left, width - margin.right])
)}

function _y(d3,height,margin){return(
d3.scaleLinear([14, 86], [height - margin.bottom, margin.top])
)}

function _radius(d3,width){return(
d3.scaleSqrt([0, 5e8], [0, width / 24])
)}

function _color(d3,data){return(
d3.scaleOrdinal(data.map(d => d.region), d3.schemeCategory10).unknown("black")
)}

function _xAxis(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80, ","))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", width)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text("一人当たりの所得（ドル） →"))
)}

function _yAxis(margin,d3,y){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ 寿命（年）"))
)}

function _grid(x,margin,height,y,width){return(
g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)
    .call(g => g.append("g")
      .selectAll("line")
      .data(x.ticks())
      .join("line")
        .attr("x1", d => 0.5 + x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom))
    .call(g => g.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right))
)}

function _dataAt(data,valueAt){return(
function dataAt(date) {
  return data.map(d => ({
    name: d.name,
    region: d.region,
    income: valueAt(d.income, date),
    population: valueAt(d.population, date),
    lifeExpectancy: valueAt(d.lifeExpectancy, date)
  }));
}
)}

function _valueAt(bisectDate){return(
function valueAt(values, date) {
  const i = bisectDate(values, date, 0, values.length - 1);
  const a = values[i];
  if (i > 0) {
    const b = values[i - 1];
    const t = (date - a[0]) / (b[0] - a[0]);
    return a[1] * (1 - t) + b[1] * t;
  }
  return a[1];
}
)}

async function _data(FileAttachment,parseSeries){return(
(await FileAttachment("nations.json").json())
  .map(({name, region, income, population, lifeExpectancy}) => ({
    name,
    region,
    income: parseSeries(income),
    population: parseSeries(population),
    lifeExpectancy: parseSeries(lifeExpectancy)
  }))
)}

function _interval(d3){return(
d3.utcMonth
)}

function _dates(interval,d3,data){return(
interval.range(
  d3.min(data, d => {
    return d3.min([
      d.income[0], 
      d.population[0], 
      d.lifeExpectancy[0]
    ], ([date]) => date);
  }),
  d3.min(data, d => {
    return d3.max([
      d.income[d.income.length - 1], 
      d.population[d.population.length - 1], 
      d.lifeExpectancy[d.lifeExpectancy.length - 1]
    ], ([date]) => date);
  })
)
)}

function _parseSeries(){return(
function parseSeries(series) {
  return series.map(([year, value]) => [new Date(Date.UTC(year, 0, 1)), value]);
}
)}

function _bisectDate(d3){return(
d3.bisector(([date]) => date).left
)}

function _margin(){return(
{top: 20, right: 20, bottom: 35, left: 40}
)}

function _height(){return(
560
)}

function _d3(require){return(
require("d3@6.7.0/dist/d3.min.js")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["nations.json", {url: new URL("./files/nations.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof date")).define("viewof date", ["Scrubber","dates"], _date);
  main.variable(observer("date")).define("date", ["Generators", "viewof date"], (G, _) => G.input(_));
  main.variable(observer("legend")).define("legend", ["DOM","html","margin","color"], _legend);
  main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","yAxis","grid","dataAt","x","y","radius","color"], _chart);
  main.variable(observer("update")).define("update", ["chart","currentData"], _update);
  main.variable(observer("currentData")).define("currentData", ["dataAt","date"], _currentData);
  main.variable(observer("x")).define("x", ["d3","margin","width"], _x);
  main.variable(observer("y")).define("y", ["d3","height","margin"], _y);
  main.variable(observer("radius")).define("radius", ["d3","width"], _radius);
  main.variable(observer("color")).define("color", ["d3","data"], _color);
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], _yAxis);
  main.variable(observer("grid")).define("grid", ["x","margin","height","y","width"], _grid);
  main.variable(observer("dataAt")).define("dataAt", ["data","valueAt"], _dataAt);
  main.variable(observer("valueAt")).define("valueAt", ["bisectDate"], _valueAt);
  main.variable(observer("data")).define("data", ["FileAttachment","parseSeries"], _data);
  main.variable(observer("interval")).define("interval", ["d3"], _interval);
  main.variable(observer("dates")).define("dates", ["interval","d3","data"], _dates);
  main.variable(observer("parseSeries")).define("parseSeries", _parseSeries);
  main.variable(observer("bisectDate")).define("bisectDate", ["d3"], _bisectDate);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  return main;
}
