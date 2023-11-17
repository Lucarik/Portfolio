const  margin = {top: 30, right: 30, bottom: 55, left: 60};
const w = 700 - margin.left - margin.right;
const h = 500 - margin.top - margin.bottom;

// Initialize svg, set width, height 
const svg = d3.select(".chart")
    .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// Function to get data
async function getData() {
    try {
        return fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
            .then(async (response) => await response.json())
    } catch(e) {
        return e;
    }
}

(async function(){
    // Get data, set titles
    let dataset = await getData();
    let title = dataset.source_name;
    let yAxisTitle = dataset.name.substring(0,22);
    dataset = dataset.data;
    
    let barw = w / dataset.length;

    // Tooltip
    const tooltip = d3.select(".chart")
        .append("g")
            .attr("id", "tooltip")
            .attr("data-date", "")
            .attr("data-data", 0)
            .style("left", "0px")
            .style("visibility", "hidden");
    
    tooltip.append("text")
            .attr("class", "tooltip-text")
            .text("hidden");
    
    // Function called when moving mouse out of bar 
    const mouseout = function() {
        d3.select(this).style("fill", "aliceblue");
        tooltip.style("visibility", "hidden");
    } 

    // Function called when moving mouse into bar
    const mouseover = function() {
        d3.select(this).style("fill", "rgba(200,250,250,.7)");
        tooltip.style("visibility", "visible");
    }

    // Function called when mouse moves on bar
    // Sets tooltip text and changes location
    const mousemove = function(data) {
        tooltip.attr("data-date", data[0]);
        tooltip.attr("data-data", data[1]);
        const text = d3.select('.tooltip-text');
        text.text(`Date: ${tooltip.attr("data-date")} GDP: ${tooltip.attr("data-data")} Billion`);
        const [x, y] = d3.mouse(this);
        tooltip.style("left", `${x-50}px`)
            //.style("bottom", "20px")
            .style("top", `${y-510}px`)
    };

    // Append title and y axis title
    svg.append('text')
        .attr("class", "text")
        .attr('transform', 'rotate(-90)')
        .attr('x', -250)
        .attr('y', 30)
        .style("font-size", "18px")
        .text(yAxisTitle);
        svg.append('text')
        .attr("class", "text")
        .attr('x', 300)
        .attr('y', 470)
        .style("font-size", "18px")
        .text("Year");
    svg.append('text')
        .attr("class", "text")
        .attr("id", "title")
        .style("font-size", "25px")
        .attr('x', 200)
        .attr('y', 30)
        .text(title);

    // Create x scale, append x axis
    const x = d3.scaleTime()
        .domain([d3.min(dataset, (d) => new Date(d[0])), d3.max(dataset, (d) => new Date(d[0]))])
        .range([0, w])
    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .attr("id", "x-axis")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("fill", "white");

    // Create y scale, append y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([h, 0]);
        
    svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(y))
        .selectAll("text")
            .style("fill", "white");
    
    // Create bars, fill data points of chart
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
            .attr("x", d => x(new Date(d[0])))
            .attr("y", d => y(d[1]))
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1])
            .attr("width", barw)
            .attr("height", d => h - y(d[1]))
            .attr("class", "bar")
            .attr("fill", "aliceblue")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            
})();