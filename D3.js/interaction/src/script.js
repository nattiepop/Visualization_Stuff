const width = 800;
const height = 400;

const corona_num = 20;
let nodes = [{ id: 0 }]
let links = [];
for (let i = 1; i <= corona_num; i++) {
  nodes.push({ id: i })
  links.push({ source: 0, target: i });
}

const link_length = 100;
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links)
    .id(d => d.id)
    .distance(link_length)
  )
  .force("charge", d3.forceManyBody()
    .strength(-10)
  )
  .force("collide", d3.forceCollide()
    .strength(1)
    .radius(2*Math.PI*link_length / corona_num / 2)
  );

const drag = simulation => {
  function dragstarted(d) {
    simulation.alphaTarget(1).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

const svg = d3.select("svg");

const link = svg.append("g")
  .selectAll("line")
  .data(links)
  .join(enter => enter.append("line")
    .attr("stroke", "#E60268")
    .attr("stroke-width", 5)
  );

const node = svg.append("g")
  .selectAll("circle")
  .data(nodes)
  .join(enter => enter.append("circle")
    .attr("fill", "#E60268")
    .attr("r", d => (d.id === 0) ? 80 : 10)
    .call(drag(simulation))
  );

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x + width / 2)
    .attr("y1", d => d.source.y + height / 2)
    .attr("x2", d => d.target.x + width / 2)
    .attr("y2", d => d.target.y + height / 2);

  node
    .attr("cx", d => d.x + width / 2)
    .attr("cy", d => d.y + height / 2);
});