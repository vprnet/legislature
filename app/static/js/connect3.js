//@codekit-prepend "d3.min.js"

var width = 702,
    height = 600,
    ltGray = "#dddedf",
    dkGray = "#979a9d",
    yellow = "#ffff99",
    green = "#b7e4a4";

var force = d3.layout.force()
    .size([width, height])
    .charge(-400)
    .linkDistance(60)
    .on("tick", tick);

var svg = d3.select("#network").append("svg")
    .attr("width", width)
    .attr("id", "d3-network")
    .attr("height", height);

var nextLink = d3.select("#next-link");

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

var clicks = 0;

var points = [
    [250, 450],
    [250,250]
];

var r = 4;

d3.json("static/data/graph.json", function(error, graph) {

    var nodeInfo = [
            {'name': false,
                'x': graph.nodes[0].x,
                'y': graph.nodes[0].y,
                'small': true,
                'offsetX': false,
                'multiLine': false,
                'id': 'user',
                'radius': 0},
            {'name': 'Vermont Health Connect',
                'x': graph.nodes[1].x,
                'y': graph.nodes[1].y,
                'small': false,
                'offsetX': false,
                'multiLine': [32, 20],
                'id': 'vhc',
                'radius': 60},
            {'name': false,
                'x': graph.nodes[2].x,
                'y': graph.nodes[2].y,
                'small': true,
                'offsetX': false,
                'multiLine': false,
                'id': 'link-node',
                'radius': 10},
            {'name': 'State Medicaid',
                'x': graph.nodes[3].x,
                'y': graph.nodes[3].y,
                'small': false,
                'offsetX': true,
                'multiLine': false,
                'id': 'medicaid',
                'radius': 20},
            {'name': 'Federal Data Hub',
                'x': graph.nodes[4].x,
                'y': graph.nodes[4].y,
                'small': false,
                'offsetX': false,
                'multiLine': [32, 15],
                'id': 'fdh',
                'radius': 40},
            {'name': 'Centers for Medicare & Medicaid Services',
                'x': graph.nodes[5].x,
                'y': graph.nodes[5].y,
                'small': true,
                'offsetX': false,
                'multiLine': false,
                'id': 'hhs',
                'radius': 20},
            {'name': 'Internal Revenue Service',
                'x': graph.nodes[6].x,
                'y': graph.nodes[6].y,
                'small': true,
                'offsetX': false,
                'multiLine': false,
                'id': 'irs',
                'radius': 20},
            {'name': 'Homeland Security',
                'x': graph.nodes[7].x,
                'y': graph.nodes[7].y,
                'small': true,
                'offsetX': false,
                'id': 'hs',
                'multiLine': false,
                'radius': 20},
            {'name': 'Social Security Adminstration',
                'x': graph.nodes[8].x,
                'y': graph.nodes[8].y,
                'small': true,
                'offsetX': false,
                'id': 'ssa',
                'multiLine': false,
                'radius': 20},
            {'name': 'Payment Processor',
                'x': graph.nodes[9].x,
                'y': graph.nodes[9].y,
                'small': false,
                'offsetX': false,
                'multiLine': true,
                'id': 'payments',
                'radius': 40},
            {'name': 'Health Insurance Carriers',
                'x': graph.nodes[10].x,
                'y': graph.nodes[10].y,
                'small': false,
                'offsetX': false,
                'multiLine': [32, 20],
                'id': 'insurures',
                'radius': 40}
        ];

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    link = link.data(graph.links)
        .enter().append("line")
            .attr("class", "link");

    node = node.data(graph.nodes)
                .enter().append("g")
                    .attr("class", "node");

    node.append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("id", function(d, i) { return ("node" + i); })
        .attr("class", "nodes")
        .attr("r", function(d,i) { return nodeInfo[i].radius; });

    node.append("text")
        .attr("dx", function(d, i) {
            if (nodeInfo[i].small) { return d.x + 30;
                } else if (nodeInfo[i].offsetX) { return d.x - 40;
                } else { return d.x; } })
        .attr("dy", function(d, i) {
            if (nodeInfo[i].offsetX) { return d.y - 30;
                } else { return d.y + 5; } })
        .style("stroke-width", 0)
        .text(function(d, i) {
            var name = nodeInfo[i].name;
            if (nodeInfo[i].name && !nodeInfo[i].multiLine) {
                return name;
            }
            } );

    node.append("foreignObject")
        .attr("x", function(d) {
            return d.x - 32; })
        .attr("y", function(d) {
            return d.y - 22; })
        .attr("width", 65)
        .attr("height", 100)
        .append("xhtml:p")
        .attr("class", "multi-line")
        .attr("id", function(d,i) {
            return nodeInfo[i].id; })
        .text(function(d,i) {
            if (nodeInfo[i].multiLine) {
                return nodeInfo[i].name; }});

    var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");

    svg.append("svg:image")
        .attr("xlink:href", "static/img/comp.jpg")
        .attr("x", "175")
        .attr("y", "30")
        .attr("width", "150")
        .attr("id", "comp")
        .attr("height", "123");

    function transition(path) {
        path.transition()
            .style("stroke", dkGray)
            .duration(1000)
            .attrTween("stroke-dasharray", tweenDash)
            .transition()
            .duration(500)
            .style("stroke", ltGray);
    }

    function delayTransition(path) {
        var wait = 1500;
        if (clicks === 1) {
            wait = 1000; }
        else if (clicks === 2) {
            wait = 2000; }

        path.transition()
            .delay(wait)
            .style("stroke", dkGray)
            .duration(1000)
            .attrTween("stroke-dasharray", tweenDash)
            .transition()
            .duration(500)
            .style("stroke", ltGray);
    }


    function tweenDash() {
        var l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l);
        return function(t) { return i(t); };
    }

    var steps = [
        [
            {'x': nodeInfo[0].x, 'y': nodeInfo[0].y + nodeInfo[0].radius + 8},
            {'x': nodeInfo[1].x, 'y': nodeInfo[1].y - nodeInfo[1].radius - r}
        ],
        [
            {'x': nodeInfo[1].x + nodeInfo[1].radius + r, 'y': nodeInfo[1].y},
            {'x': nodeInfo[2].x - nodeInfo[2].radius - r, 'y': nodeInfo[2].y}
        ],
        [
            {'x': nodeInfo[2].x, 'y': nodeInfo[2].y - nodeInfo[2].radius - r},
            {'x': nodeInfo[3].x, 'y': nodeInfo[3].y + nodeInfo[3].radius + r}
        ],
        [
            {'x': nodeInfo[2].x + nodeInfo[2].radius + r, 'y': nodeInfo[2].y},
            {'x': nodeInfo[4].x - nodeInfo[4].radius - r, 'y': nodeInfo[4].y}
        ],
        [
            {'x': nodeInfo[4].x, 'y': nodeInfo[4].y - nodeInfo[4].radius - r},
            {'x': nodeInfo[5].x, 'y': nodeInfo[5].y + nodeInfo[5].radius + r}
        ],
        [
            {'x': nodeInfo[4].x + ((nodeInfo[4].radius + r) * 0.866),
                'y': nodeInfo[4].y -((nodeInfo[4].radius + r) * 0.5)},
            {'x': nodeInfo[6].x - ((nodeInfo[6].radius + r) * 0.866),
                'y': nodeInfo[6].y +((nodeInfo[6].radius + r) * 0.5)}
        ],
        [
            {'x': nodeInfo[4].x + ((nodeInfo[4].radius + r) * 0.866),
                'y': nodeInfo[4].y + ((nodeInfo[4].radius + r) * 0.5)},
            {'x': nodeInfo[7].x - ((nodeInfo[7].radius + r) * 0.866),
                'y': nodeInfo[7].y -((nodeInfo[7].radius + r) * 0.5)}
        ],
        [
            {'x': nodeInfo[4].x, 'y': nodeInfo[4].y + nodeInfo[4].radius + r},
            {'x': nodeInfo[8].x, 'y': nodeInfo[8].y - nodeInfo[8].radius - r}
        ],
        [
            {'x': nodeInfo[1].x, 'y': nodeInfo[1].y + nodeInfo[1].radius + r},
            {'x': nodeInfo[9].x, 'y': nodeInfo[9].y - nodeInfo[9].radius - r}
        ],
        [
            {'x': nodeInfo[1].x - nodeInfo[1].radius - r, 'y': nodeInfo[4].y},
            {'x': nodeInfo[10].x + nodeInfo[10].radius + r, 'y': nodeInfo[10].y}
        ],
        [
            {'x': nodeInfo[1].x, 'y': nodeInfo[1].y - nodeInfo[1].radius - r},
            {'x': nodeInfo[0].x, 'y': nodeInfo[0].y + nodeInfo[0].radius + 8}
        ]
    ];

    var node1  = svg.select("circle#node1");
    var node2  = svg.select("circle#node2");
    var node3  = svg.select("circle#node3");
    var node4  = svg.select("circle#node4");
    var node5  = svg.select("circle#node5");
    var node6  = svg.select("circle#node6");
    var node7  = svg.select("circle#node7");
    var node8  = svg.select("circle#node8");
    var node9  = svg.select("circle#node9");
    var node10 = svg.select("circle#node10");
    var allNodes = svg.selectAll("circle.nodes");

    function clicksPlus() {
        clicks += 1;
        run = false;
        nextLink.transition().duration(200).style("background", "#64C552");
    }

    function step0(d,i) {
        nextLink.html("Next Step <span class='glyphicon glyphicon-forward'></span>");
        $('#par0').attr("class", "inactive");
        $('#par1').attr("class", "active");

        svg.append("path")
            .attr("d", lineFunction(steps[0]))
            .call(transition);

        node1.transition()
            .duration(1000)
            .delay(500)
            .style("stroke", dkGray)
            .style("fill", green)
            .each("end", clicksPlus);
    }

    function step1(d,i) {
        $('#par1').attr("class", "inactive");
        $('#par2').attr("class", "active");

        function step1a(d,i) {
            node1.transition()
                .duration(1000)
                .style("stroke", dkGray)
                .style("fill", yellow);

            svg.append("path")
                .attr("d", lineFunction(steps[1]))
                .call(transition);

            node2.transition()
                .duration(500)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", yellow)
                .each('start', step1b);
        }


        function step1b(d,i) {
            svg.append("path")
                .attr("d", lineFunction(steps[2]))
                .call(transition);

            svg.append("path")
                .attr("d", lineFunction(steps[3]))
                .call(transition);

            node3.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", green);

            node4.transition()
                .duration(500)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", yellow)
                .each('start', step1c);
        }

        function step1c(d,i) {
            svg.append("path")
                .attr("d", lineFunction(steps[4]))
                .call(transition);

            svg.append("path")
                .attr("d", lineFunction(steps[5]))
                .call(transition);

            svg.append("path")
                .attr("d", lineFunction(steps[6]))
                .call(transition);

            svg.append("path")
                .attr("d", lineFunction(steps[7]))
                .call(transition);

            node5.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", green);

            node6.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", green);

            node7.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", green);

            node8.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", green)
                .each("end", clicksPlus);
        }
        step1a(d,i);

    }

    function step2(d,i) {
        $('#par2').attr("class", "inactive");
        $('#par3').attr("class", "active");

        function step2a(d,i) {
            svg.append("path")
                .attr("d", lineFunction(steps[4].reverse()))
                .call(transition);

            svg.append("path")
                .attr("d", lineFunction(steps[5].reverse()))
                .call(transition);

            svg.append("path")
                .attr("d", lineFunction(steps[6].reverse()))
                .call(transition);

            svg.append("path")
                .attr("d", lineFunction(steps[7].reverse()))
                .call(transition);

            node4.transition()
                .duration(500)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", green)
                .each('start', step2b);
        }

        function step2b(d,i) {
            svg.append("path")
                .attr("d", lineFunction(steps[2].reverse()))
                .call(transition);

            svg.append("path")
                .attr("d", lineFunction(steps[3].reverse()))
                .call(transition);

            node2.transition()
                .duration(500)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", green)
                .each('start', step2c);
        }

        function step2c(d,i) {
            svg.append("path")
                .attr("d", lineFunction(steps[1].reverse()))
                .call(transition);

            node2.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", ltGray);

            node3.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", ltGray);

            node4.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", ltGray);

            node5.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", ltGray);

            node6.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", ltGray);

            node7.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", ltGray);

            node8.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", ltGray);

            node1.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", green)
                .each("end", clicksPlus);
        }

        step2a(d,i);

    }

    function step3(d,i) {
        $('#par3').attr("class", "inactive");
        $('#par4').attr("class", "active");

        function step3a(d,i) {
            node1.transition()
                .duration(800)
                .style("stroke", ltGray)
                .transition()
                .duration(800)
                .delay(800)
                .style("stroke", dkGray)
                .transition()
                .duration(800)
                .delay(1600)
                .style("stroke", ltGray)
                .transition()
                .duration(800)
                .delay(2400)
                .style("stroke", dkGray)
                .each("end", step3b);
        }

        function step3b(d,i) {
            svg.append("path")
                .attr("d", lineFunction(steps[0].reverse()))
                .call(transition);

            node1.transition()
                .duration(1000)
                .style("fill", yellow)
                .each("end", clicksPlus);

        }
        step3a(d,i);


    }

    function step4(d,i) {
        $('#par4').attr("class", "inactive");
        $('#par5').attr("class", "active");

        function step4a(d,i) {
            svg.append("path")
                .attr("d", lineFunction(steps[0].reverse()))
                .call(transition);

            node1.transition()
                .delay(500)
                .duration(1000)
                .style("fill", green)
                .each("end", step4b);
        }

        function step4b(d,i) {
            node1.transition()
                .duration(1000)
                .style("fill", yellow);

            svg.append("path")
                .attr("d", lineFunction(steps[8]))
                .call(transition);

            node9.transition()
                .duration(1000)
                .delay(500)
                .style("stroke", dkGray)
                .style("fill", green)
                .each("end", clicksPlus);
        }
        step4a(d,i);

    }

    function step5(d,i) {
        $('#par5').attr("class", "inactive");
        $('#par6').attr("class", "active");

        svg.append("path")
            .attr("d", lineFunction(steps[8].reverse()))
            .call(transition);

        node9.transition()
            .duration(1000)
            .style("stroke", ltGray);

        node1.transition()
            .duration(1000)
            .delay(500)
            .style("fill", green)
            .each("end", clicksPlus);
    }

    function step6(d,i) {
        $('#par6').attr("class", "inactive");
        $('#par7').attr("class", "active");

        svg.append("path")
            .attr("d", lineFunction(steps[9]))
            .call(transition);

        node1.transition()
            .duration(1000)
            .style("fill", yellow);

        node10.transition()
            .duration(1000)
            .delay(500)
            .style("stroke", dkGray)
            .style("fill", green)
            .each("end", clicksPlus);
    }

    function step7(d,i) {
        $('#par7').attr("class", "inactive");
        $('#par8').attr("class", "active");

        function step7a(d,i) {
            svg.append("path")
                .attr("d", lineFunction(steps[9].reverse()))
                .call(transition);

            node10.transition()
                .duration(1000)
                .style("stroke", ltGray);

            node1.transition()
                .duration(1000)
                .delay(500)
                .style("fill", green)
                .style("stroke", ltGray)
                .each("end", step7b);
        }

        function step7b(d,i) {

            allNodes.transition()
                .duration(800)
                .style("stroke", dkGray)
                .transition()
                .duration(800)
                .delay(800)
                .style("stroke", ltGray)
                .transition()
                .duration(800)
                .delay(1600)
                .style("stroke", dkGray)
                .each("end", step7c);
        }

        function step7c(d,i) {
            svg.append("path")
                .attr("d", lineFunction(steps[10]))
                .call(transition);

            svg.selectAll("circle")
                .transition()
                .duration(1500)
                .delay(500)
                .style("stroke", ltGray);

            d3.select('span.bolder')
                .transition()
                .duration(1500)
                .style("opacity", "1");
        }



        step7a(d,i);

    }

    var run;
    nextLink.on("click", function(d,i) {

        nextLink.transition().duration(200).style("background", ltGray);

        if (clicks === 0) {
            $('#refresh').css('display', 'block');
            if (!run) {
                $('#step1').attr("class", "active");
                step0(d,i);
                run = true;
            }
        } else if (clicks === 1) {
            if (!run) {
                $('#step2').attr("class", "active");
                step1(d,i);
                run = true;
            }
        } else if (clicks === 2) {
            if (!run) {
                $('#step3').attr("class", "active");
                step2(d,i);
                run = true;
            }
        } else if (clicks === 3) {
            if (!run) {
                $('#step4').attr("class", "active");
                step3(d,i);
                run = true;
            }
        } else if (clicks === 4) {
            if (!run) {
                $('#step5').attr("class", "active");
                step4(d,i);
                run = true;
            }
        } else if (clicks === 5) {
            if (!run) {
                $('#step6').attr("class", "active");
                step5(d,i);
                run = true;
            }
        } else if (clicks === 6) {
            if (!run) {
                $('#step7').attr("class", "active");
                step6(d,i);
                run = true;
            }
        } else if (clicks === 7) {
            if (!run) {
                $('#step8').attr("class", "active");
                step7(d,i);
                run = true;
            }
        }
    });

});




function guide() {
    var guideX = 450,
        guideY = 55,
        textX = 30,
        dY = 30;

    svg.append("circle")
        .attr("cx", guideX)
        .attr("cy", guideY)
        .attr("r", 10)
        .attr("class", "stoplight")
        .attr("id", "means-stop");

    svg.append("text")
        .attr("x", guideX + textX)
        .attr("y", guideY + 5)
        .text("Unsuccesful");

    svg.append("circle")
        .attr("cx", guideX)
        .attr("cy", guideY + dY)
        .attr("r", 10)
        .attr("class", "stoplight")
        .attr("id", "means-wait");

    svg.append("text")
        .attr("x", guideX + textX)
        .attr("y", guideY + dY + 5)
        .text("Awaiting Response");

    svg.append("circle")
        .attr("cx", guideX)
        .attr("cy", guideY + 2*dY)
        .attr("r", 10)
        .attr("class", "stoplight")
        .attr("id", "means-go");

    svg.append("text")
        .attr("x", guideX + textX)
        .attr("y", guideY + 2*dY + 5)
        .text("Successful");

    svg.append("circle")
        .attr("cx", guideX)
        .attr("cy", guideY + 3*dY)
        .attr("r", 10)
        .attr("class", "stoplight")
        .attr("id", "means-no");

    svg.append("text")
        .attr("x", guideX + textX)
        .attr("y", guideY + 3*dY + 5)
        .text("Inactive");
}

guide();

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}
