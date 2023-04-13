const margin = 50;
const width = 800 - (margin*2);
const height = 400 - (margin*2);

d3.csv ("https://gist.githubusercontent.com/puripant/857f1981667e8b42da2c72328ba94ead/raw/296d212615ab076254da03573f8f2493007cc76c/medals.csv").then(data => {
  data = d3.rollups(
    data, 
    values => d3.mean(values, d => +d.gold), 
    d => d.name, 
    d => d.host
  );

  const group_scale = d3.scaleBand()
    .domain(data.map(d => d[0]))
    .range([margin, margin + width])
    .paddingInner(0.1)
    .paddingOuter(0);

  const bar_scale = d3.scaleBand()
    .domain(["n", "y"])
    .range([0, group_scale.bandwidth()])
    .paddingInner(0.1)
    .paddingOuter(0);

  const y_scale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.max(d[1], d => d[1]))])
    .range([height + margin, margin]);

  const color_scale = d3.scaleOrdinal(d3.schemeTableau10)
    .domain(data.map(d => d[0]));

  const svg = d3.select("svg")
    .attr("transform", "translate(50,0)");

  const group = svg.selectAll("g")
    .data(data)
    .join(enter => enter.append("g"))
    .attr("transform", d => `translate(${group_scale(d[0])},0)`)
    .attr("fill", d => color_scale(d[0]));

  group.selectAll("rect")
    .data(d => d[1])
    .join(enter => enter.append("rect"))
    .attr("x", d => bar_scale(d[0]))
    .attr("y", d => y_scale(d[1]))
    .attr("width", bar_scale.bandwidth())
    .attr("height", d => height + margin - y_scale(d[1]));
  
  svg.append("g")
    .attr("transform", `translate(${margin},0)`)
    .call(d3.axisLeft(y_scale)
      .ticks(5)
    );
  svg.append("g")
    .attr("transform", `translate(0,${margin + height})`)
    .call(d3.axisBottom(group_scale));
})