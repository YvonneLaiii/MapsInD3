let width = 800
let height = 600


const svg = d3.select("body")
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('id',"svg")
    .style('margin-right',5)
    .style('margin-left', 5)
    .style('margin-top',5)
    .style('margin-bottom',5)

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

        let g = svg.append("g").attr("id","g")
        g.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
            .attr('stroke', 'black')
            .attr('fill', '#999999')
            .attr('d', geoPath)
        let points = svg.append("g").attr("id","points")
        points.selectAll('.circle')
            .data(pointData)
            .enter()
            .append('circle')
                .attr('cx', function(d) {
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[0]
                })
                .attr('cy', function(d) {
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[1]
                })
                .attr('r', 3)
                .attr('fill', 'steelblue')
                .attr("stroke", "black")
                .on( "click", function(){
                  let ani = d3.select(this)
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


    })

})
