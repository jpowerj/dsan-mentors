// Adapted from distributions.js
//*******************************************************************************//
//Discrete and Continuous
//*******************************************************************************//
function discrete_continuous() {
    //Constants
    var xMax = [-40, 40];
    var yMax = [0, 5];
    var currentView = [-5, 5];

    var parameters = {
        'bernoulli': ['Probability'],
        'binomialDiscrete': ['Number', 'Probability'],
        'negbin': ['Number', 'Probability'],
        'geometric': ['Probability'],
        'poisson': ['Lambda'],
        'uniform': ['Min', 'Max'],
        'normal': ['Mean', 'Std'],
        'studentt': ['Dof'],
        'chisquare': ['Dof'],
        'exponential': ['Lambda'],
        'centralF': ['Dof1', 'Dof2'],
        'gamma': ['Shape', 'Scale'],
        'beta': ['Alpha', 'Beta']
    };

    var initialParameters = {
        'bernoulli': [0.5],
        'binomialDiscrete': [5, 0.5],
        'negbin': [5, 0.5],
        'geometric': [0.5],
        'poisson': [5],
        'uniform': [-5, 5],
        'normal': [0, 1],
        'studentt': [5],
        'chisquare': [5],
        'exponential': [1],
        'centralF': [5, 5],
        'gamma': [1, 1],
        'beta': [1, 1]
    };

    var distributions = ['bernoulli',
        'binomialDiscrete',
        'negbin',
        'geometric',
        'poisson',
        'uniform',
        'normal',
        'studentt',
        'chisquare',
        'exponential',
        'centralF',
        'gamma',
        'beta'];

    var initialView = {
        'bernoulli': [-1, 5],
        'binomialDiscrete': [-1, 5],
        'negbin': [-1, 5],
        'geometric': [-1, 5],
        'poisson': [-1, 5],
        'uniform': [-6, 6],
        'normal': [-5, 5],
        'studentt': [-5, 5],
        'chisquare': [-1, 8],
        'exponential': [-1, 5],
        'centralF': [-1, 5],
        "": [-5, 5],
        'gamma': [-1, 5],
        'beta': [-0.5, 1.5]
    };

    var currentDist = "";
    var currentPercent = 0;


    // Create SVG and elements
    // var svgDist = d3.select("#graphDist").append("svg");
    // 1: Set up dimensions of SVG
    var margin = { top: 60, right: 20, bottom: 100, left: 20 },
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // 2: Create SVG
    var svgDist = d3.select("#graphDist").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xDist = svgDist.append("g").attr("class", "x axis");
    var yDist = svgDist.append("g").attr("class", "y axis");
    var clip = svgDist.append("clipPath").attr("id", "view").append("rect");
    var pdfPath = svgDist.append("path").attr("id", "pdf").attr("clip-path", "url(#view)");
    var pdfArea = svgDist.append("path").attr("id", "pdfArea").attr("clip-path", "url(#view)").moveToBack();
    var cdfPath = svgDist.append("path").attr("id", "cdf").attr("clip-path", "url(#view)");
    var shift = svgDist.append("rect").attr("fill", "transparent").attr("id", "shift");
    var control = svgDist.append("g");

    //Create scale functions
    var xScaleDist = d3.scale.linear().domain([-5, 5]);

    var yScaleDist = d3.scale.linear().domain([0, 1]);

    //Define X axis
    var xAxisDist = d3.svg.axis()
        .scale(xScaleDist)
        .orient("bottom")
        .ticks(5);

    //Define Y axis
    var yAxisDist = d3.svg.axis()
        .scale(yScaleDist)
        .orient("left")
        .ticks(5);


    //Handle zoom and scale
    var zoom = d3.behavior.zoom()
        .scaleExtent([0.25, 4])
        .on("zoom", zoomed);


    //Zoom function
    function zoomed() {
        if (xScaleDist.domain()[0] < xMax[0]) {
            var x = zoom.translate()[0] - xScaleDist(xMax[0]) + xScaleDist.range()[0];
            zoom.translate([x, 0]);
        }
        if (xScaleDist.domain()[1] > xMax[1]) {
            var x = zoom.translate()[0] - xScaleDist(xMax[1]) + xScaleDist.range()[1];
            zoom.translate([x, 0]);
        }
        if (yScaleDist.domain()[0] != yMax[0]) {
            var y = zoom.translate()[1] - yScaleDist(yMax[0]) + yScaleDist.range()[0];
            zoom.translate([zoom.translate()[0], y]);
        }
        if (yScaleDist.domain()[1] > yMax[1]) {
            var y = zoom.translate()[1] - yScaleDist(yMax[1]) + yScaleDist.range()[1];
            zoom.translate([zoom.translate()[0], y]);
        }
        //Update X axis
        xDist.call(xAxisDist);
        //Update Y axis
        yDist.call(yAxisDist);
        //Update current view area
        currentView = xScaleDist.domain();

        redrawPath(currentDist);
    }

    //Add control buttons for zoom and pan
    function move() {
        svgDist.call(zoom.event); // https://github.com/mbostock/d3/issues/2387

        // Record the coordinates (in data space) of the center (in screen space).
        var center0 = zoom.center(), translate0 = zoom.translate(), dir = +this.getAttribute("data-move");
        var translate = translate0[0] + center0[0] * dir;
        // Translate from center.
        zoom.translate([translate, 0]);

        svgDist.transition().duration(1000).call(zoom.event);
    }

    function scale() {
        svgDist.call(zoom.event); // https://github.com/mbostock/d3/issues/2387

        // Record the coordinates (in data space) of the center (in screen space).
        var center0 = zoom.center(), translate0 = zoom.translate(), coordinates0 = coordinates(center0);
        scale = zoom.scale() * Math.pow(2, +this.getAttribute("data-zoom"));
        zoom.scale(Math.max(0.25, Math.min(scale, 4)));

        // Translate back to the center.
        var center1 = point(coordinates0);
        zoom.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]]);

        svgDist.transition().duration(1000).call(zoom.event);
    }

    function coordinates(point) {
        var scale = zoom.scale(), translate = zoom.translate();
        return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
    }

    function point(coordinates) {
        var scale = zoom.scale(), translate = zoom.translate();
        return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
    }

    control.selectAll('image.move')
        .data(['left', 'right'])
        .enter()
        .append('image')
        .attr("xlink:href", function (d, i) { return "./img/" + d + ".png"; })
        .attr("x", function (d, i) { return i * 50; })
        .attr("y", 10)
        .attr("width", 25)
        .attr("height", 25)
        .attr("class", "move")
        .attr("data-move", function (d, i) { return 1 + i * -2; })
        .on("click", move);

    control.selectAll('image.scale')
        .data(['plus', 'minus'])
        .enter()
        .append('image')
        .attr("xlink:href", function (d, i) { return "./img/" + d + ".png"; })
        .attr("x", 25)
        .attr("y", function (d, i) { return i * 25; })
        .attr("width", 25)
        .attr("height", 25)
        .attr("class", "scale")
        .attr("data-zoom", function (d, i) { return 1 + i * -2; })
        .on("click", scale);

    // Draw PDF/CDF Path
    function redrawPath(dist) {
        if (dist != "") {
            var line = d3.svg.line()
                .x(function (d) { return xScaleDist(d[0]) })
                .y(function (d) { return yScaleDist(d[1]) })
                .interpolate("linear");
            var area = d3.svg.area()
                .x(function (d) { return xScaleDist(d[0]) })
                .y0(yScaleDist(0))
                .y1(function (d) { return yScaleDist(d[1]) })
                .interpolate("linear");
            var parameter = parameters[dist];
            var params = parameter.map(function (x) { return parseFloat(document.getElementById(dist + x).value) });
            params.unshift(0);
            pdfPath
                .datum(d3.range(Math.floor(currentView[0]), Math.ceil(currentView[1]) + 0.01, 0.01).map(function (x) {
                    params[0] = x;
                    return [x, Math.min(jStat[dist].pdf.apply(null, params), yMax[1])];
                }))
                .attr("d", line)
                .style("stroke-width", "5px");
            pdfArea
                .datum(d3.range(currentView[0], currentView[0] + 0.01 + (currentView[1] - currentView[0]) * currentPercent, 0.01).map(function (x) {
                    params[0] = x;
                    return [x, Math.min(jStat[dist].pdf.apply(null, params), yMax[1])];
                }))
                .attr("d", area)
                .style("opacity", "0.5");
            cdfPath
                .datum(d3.range(currentView[0], currentView[0] + 0.01 + (currentView[1] - currentView[0]) * currentPercent, 0.01).map(function (x) {
                    params[0] = x;
                    return [x, jStat[dist].cdf.apply(null, params)];
                }))
                .attr("d", line)
                .style("stroke-width", "5px");
        } else {
            pdfPath.style("stroke-width", "0px");
            pdfArea.style("opacity", "0");
            cdfPath.style("stroke-width", "0px");
        }
    }

    //Update Range Input
    $(".inputDist").on("input", function (e) {
        updateRangeInput($(this).val(), this.id);
        redrawPath(this.parentNode.id);
    });
    function updateRangeInput(n, id) {
        d3.select("#" + id + "-value").text(round(n, 2));
    };

    // //Update Percent Input
    // $("#percentDist").on("input", function(e) {
    // 	currentPercent = $(this).val();
    // 	redrawPath(currentDist);
    // 	});
    // slide function
    function slide(val) {
        currentPercent = val;
        redrawPath(currentDist);
    }

    //Handles discrete/continuous radio buttons
    $("input[name='distributions']").on("change", function () {
        $('.definition').toggle();
        $('.distribution').css('display', 'none');
        $('.distributions').val(function () {
            return $(this).find('option').filter(function () {
                return $(this).prop('defaultSelected');
            }).val();
        });
        currentDist = "";
        $('#descriptionTable').css('display', 'none');
        $('#resetDist').css('display', 'none').click();
        $('.giant-slider').css('display', 'none');
    });

    //Draw Distribution
    $('.distributions').on('change', function () {
        var dist = $(this).find("option:selected").prop('value');
        $('.distribution').css('display', 'none');
        $('.' + dist).toggle();
        currentDist = dist;
        $('#descriptionTable').css('display', 'table');
        $('#resetDist').css('display', 'inline-block').click();
        $('.giant-slider').css('display', 'block');
    });


    //Reset function
    $('#resetDist').on('click', function () {
        distributions.map(function (x) {
            var paramNames = parameters[x];
            var paramValues = initialParameters[x];
            for (var i = paramNames.length - 1; i >= 0; i--) {
                updateRangeInput(paramValues[i], x + paramNames[i]);
                $('#' + x + paramNames[i]).val(paramValues[i]);
            };
        });
        currentView = initialView[currentDist];
        xScaleDist.domain(currentView);
        yScaleDist.domain([0, 1]);
        zoom.x(xScaleDist).y(yScaleDist);
        xDist.call(xAxisDist);
        yDist.call(yAxisDist);
        currentPercent = 0;
        $("#percentDist").val(0);
        reset_slider();
        redrawPath(currentDist);
    });

    //Update SVG based on width of container
    var wpad = 10;
    var hpad = 40;

    var reset_slider = create_slider(slide, svgDist, width - 2 * wpad, height, wpad);


    yScaleDist.range([height - hpad, hpad]);
    xScaleDist.range([wpad, width - wpad]);
    zoom.x(xScaleDist).y(yScaleDist).center([width / 2, height / 2]);

    control.attr("transform", "translate(" + (width - 120) + "," + hpad + ")")

    xDist.attr("transform", "translate(0," + (height - hpad) + ")").call(xAxisDist);
    yDist.attr("transform", "translate(" + wpad + ",0)").call(yAxisDist);
    shift.attr("x", wpad).attr("y", hpad).attr("width", width - 2 * wpad).attr("height", height - 2 * hpad).call(zoom);
    clip.attr("x", wpad).attr("y", hpad - 2).attr("width", width - 2 * wpad).attr("height", height - 2 * hpad + 4);

    redrawPath(currentDist);

}
