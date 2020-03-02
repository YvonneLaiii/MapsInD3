let width = 800
let height = 600


const svg = d3.select("body")
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('id',"svg")

const g = svg.append('g')

d3.json('nygeo.json').then(function(data) {
    d3.csv('data.csv').then(function(pointData) {
        const albersProj = d3.geoAlbers()
            .scale(75000)
            .rotate([74.007, 0])
            .center([0, 40.712])
            .translate([width/2, height/2]);

        let point = pointData[0]
        let scaled = albersProj([ parseFloat(point['longitude']) , parseFloat(point['latitude']) ])

        const geoPath = d3.geoPath()
        .projection(albersProj)

        g.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
            .attr('stroke', 'black')
            .attr('fill', '#ccc')
            .attr('d', geoPath)
        g.selectAll('.circle')
            .data(pointData)
            .enter()
            .append('circle')
                .attr('cx', function(d) {
                    let scaledPoints = albersProj([parseFloat(d['longitude']) , parseFloat(d['latitude'])])
                    return scaledPoints[0]
                })
                .attr('cy', function(d) {
                    let scaledPoints = albersProj([parseFloat(d['longitude']) , parseFloat(d['latitude'])])
                    return scaledPoints[1]
                })
                .attr('r', 3)
                .attr('fill', 'steelblue')
                .on( "click", function(){
                  d3.select(this)
                    .attr("opacity",1)
                    .transition()
                    .duration(800)
                    .attr("cx",width * Math.round(Math.random()))
                    .attr("cy",height * Math.round(Math.random()))
                    .attr("opacity",0)
                    .on("end",function(){
                      d3.select(this).remove();
                    })
                })

        svg.append('text')
          .attr('x', 400)
          .attr('y', 20)
          .style('font-size', '20pt')
          .text('Airbnb locations in New York City');
    })

})
