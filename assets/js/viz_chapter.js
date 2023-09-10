//JS functions used in all pages

//Adds bring to front for all elements from D3 selection
//Adapted from the following code:
//http://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

//Adds bring to back for all elements from D3 selection
d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        this.parentNode.insertBefore(this, this.parentNode.firstChild);
    });
};

//Rounds the input number to input decimal places
function round(number, decimal) {
    var power = Math.pow(10, decimal);
    return (Math.round(number * power) / power).toFixed(decimal);
}


//Additional Functions to JSTAT

jStat.binomialDiscrete = {};

jStat.binomialDiscrete.pdf = function (k, n, p) {
    if (k < 0 || !Number.isInteger(k) || k > n || p < 0 || p > 1) {
        return 0;
    } else {
        return jStat.binomial.pdf(k, n, p);
    }
}

jStat.binomialDiscrete.cdf = function (k, n, p) {
    return jStat.binomial.cdf(k, n, p);
}

jStat.binomialDiscrete.mean = function (n, p) {
    return n * p;
}

jStat.binomialDiscrete.sample = function (n, p) {
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum += +(Math.random() < p);
    }
    return sum;
}

jStat.bernoulli = {};

jStat.bernoulli.pdf = function (k, p) {
    return jStat.binomialDiscrete.pdf(k, 1, p);
}

jStat.bernoulli.cdf = function (k, p) {
    return jStat.binomial.cdf(k, 1, p);
}

jStat.bernoulli.mean = function (p) {
    return p;
}

jStat.bernoulli.sample = function (p) {
    return +(Math.random() < p);
}

jStat.negbin.mean = function (r, p) {
    return (1 - p) * r / p;
}

jStat.geometric = {};

jStat.geometric.pdf = function (k, p) {
    if (k < 0 || !Number.isInteger(k)) {
        return 0;
    } else {
        return Math.pow(1 - p, k) * p;
    }
}

jStat.geometric.cdf = function (k, p) {
    if (k < 0) {
        return 0;
    } else {
        return 1 - Math.pow(1 - p, Math.floor(k) + 1);
    }
}

jStat.geometric.mean = function (p) {
    return (1 - p) / p;
}

jStat.poisson.mean = function (lambda) {
    return lambda;
}



// Slider
function create_slider(slide, svg, width, height, margin) {
    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, width])
        .clamp(true);

    var drag = d3.behavior.drag()
        .on('drag', function (d, i) {
            var val = x.invert(d3.event.x);
            handle.attr("cx", x(val));
            slide(val);
        });

    var slider = svg.append("g")
        .attr("class", "range")
        .attr("transform", "translate(" + margin + "," + height + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(drag);

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 25 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function (d) { return d; });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 12);

    function reset() {
        handle.attr("cx", x(0));
    }

    return reset;
}



// Jingru's Code

var n = $(window).height() * 0.75;
var m = n * 0.6; // where to update the card
var chapter_name = true;
var end_url = langDetect();
var chapterlist = new Array("bp", "cp", "pd", "fi", "bi", "ra");
var chapter_list = new Array("basic-probability", "compound-probability", "probability-distributions", "frequentist-inference", "bayesian-inference", "regression-analysis");
var shareUrl = window.location.href;

window.onload = function () {

    //onload animation
    $('body').fadeIn(1000);

    modalTitleOnLoad();




}


function modalTitleOnLoad() {


    $('.modal-chapter-titles li').on("dblclick", function () {
        var cur_id = $(this).attr("id").slice(0, 2);
        var a = chapterlist.indexOf(cur_id);

        window.location.href = "../" + chapter_list[a] + "/" + end_url;

    })

    $('.modal-chapter-titles li').on("click", function () {
        $('.modal-chapter-titles li').removeClass('chapter-highlighted');
        $(this).addClass('chapter-highlighted');
        var cur_id = $(this).attr("id").slice(0, 2);

        var a = chapterlist.indexOf(cur_id);


        if ($(window).width() < 750) {
            window.location.href = "../" + chapter_list[a] + "/" + end_url;
        } else {
            hideAllTiles();
            $("#" + cur_id).css("display", "block");
        }

    });

}


function moveToMiddle(div) {
    div.css("visibility", "visible");

}


function hideDiv(div) {
    div.css("visibility", "hidden");
}



function titleChangeToChapter() {

    if (chapter_name == true) {
        $("#display-chapter").css("display", "none");
        $("#seeing-theory").css("display", "block");
    } else {
        $("#seeing-theory").css("display", "none");
        $("#display-chapter").css("display", "block");
    }


}


function downArrowShow() {
    $('.scroll-down').show("fade");
    $('.scroll-down').fadeIn(1000).fadeOut(1000).fadeIn(1000).fadeOut(1000).fadeIn(1000);

}


function toTop() {
    $('html,body').animate({
        scrollTop: $("#section0").offset().top
    },
        'slow');
}

function setPadding(n) {

    // n = n;
    $('.col-left-wrapper, .header-wrapper').css("padding-left", n);

}



/*MODAL*/

$(window).resize(function () {


    if ($(window).width() < 750) {
        hideAllTiles();

    } else {
        displayCurrentClass();
    }

    chapterBackgroundColorChange();


});

function displayCurrentClass() {
    var cur_chapter = getCurrentChapter();
    $('#' + cur_chapter).css("display", "block");

}


function hideAllTiles() {
    $('#bp,#cp,#pd,#fi,#ra,#bi').css("display", "none");
}




function openNav() {

    $('#overlay').show("fade");

    // add listener to disable scroll
    disableScroll();
}

function closeNav() {

    $('#overlay').hide("slow");

    enableScroll();
}


var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function shareButtonToggle() {

    $('#share-modal').click(function () {
        $('#share').slideToggle();
        $('#share-modal').toggle();

    })
}

function langDetect() {
    var a = document.documentElement.lang.toLowerCase();

    var current_url;

    if (a != "en") {
        current_url = a + ".html";
    } else {
        current_url = "index.html"
    }

    return current_url;

}

function getCurrentChapter() {
    return $('meta[name=chapter]').attr("content");
}



