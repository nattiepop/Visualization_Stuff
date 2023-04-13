const margin = 50;
const width = 800 - (margin*2);

const snake_thickness = 10;

d3.csv ("https://gist.githubusercontent.com/puripant/857f1981667e8b42da2c72328ba94ead/raw/296d212615ab076254da03573f8f2493007cc76c/medals.csv").then(data => {
  data = d3.nest()
    .key(d => d.year)
    .rollup(values => d3.sum(values, d => +d.gold))
    .map(data)
    .values();
  
  const w_scale = d3.scaleLinear()
    .domain([0, d3.sum(data)])
    .range([0, width]);
  const t_scale = d3.scaleLinear()
    .domain([0, d3.sum(data)])
    .range([0, 10000]);

  const svg = d3.select('svg').append('g')
    .attr('transform', `translate(${margin},${margin})`);

  let sum = 0;
  data.forEach((d, i) => {
    let rect = svg.append('rect')
      .attr('x', margin + w_scale(sum))
      .attr('y', 0)
      .attr('height', snake_thickness)
      .attr('width', 0)
      .transition()
        .duration(t_scale(d))
        .delay(t_scale(sum))
        .attr('width', w_scale(d));

    for (let j = i+1; j < data.length; j++) {
      rect = rect.transition()
        .duration(t_scale(data[j]))
        .attr('y', (j - i)*(snake_thickness));
    }
    
    sum += d;
  })
})