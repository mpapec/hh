// var speed = 40;
var speed = 300;
var info = d3.select("#info");
var info2 = d3.select("#info2");

var formatCount = d3.format(",.0f");
var svg = d3.select("svg"),
    margin = {top: 10, right: 30, bottom: 30, left: 45},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
var x = d3.scaleLinear()
    .rangeRound([0, width])
    .domain([0, 100*60]); // 100mins maximum on X axis


var data = [];
var i = 0+1;

var max = -Infinity;
var min = Infinity;

// loop();
var interval = setInterval(loop, 0);

function finish () {
    // data = data.filter( function(v) {return v >0 ;} );
    // console.log([ amean(data), gmean(data), median(data) ]);
    info2.html(
        `arithmetic mean (or mean or average): <b>${amean(data).toFixed(2)}</b> sec ; median: <b>${median(data)}</b> sec`
    );
    foundPerInterval(data);
    // console.log(JSON.stringify(data));
}

function foundPerInterval (data) {
    var everySec = 10;
    var current = 0;
    var prevSegmentIdx = 0;

    var len = data.length;
    for (let i = 0; i < len; i++) {
      let v = data[i];
      if (v >= current+everySec) {
        var b = (current+everySec) %60 ? "" : "<b>";
        $("#freq").append(`
          <tr align="right"><td>${b} ${current} - ${current+everySec-1}</td>
          <td>${b}${ (100*(i-prevSegmentIdx-1)/len).toFixed(2) } %</td>
          <td>${b}${ (100*(i-1)/len).toFixed(2) } %</td>
          </tr>
        `);
        prevSegmentIdx = i-1;
        current += everySec;
      }
      if (v >60* 20) {
        0&& $("#freq").append(`
          <tr align="right"><td><b>remaining</b></td>
          <td><b> ${ (100*(len-i)/len).toFixed(2) } %</b></td>
          <td>-</td>
          </tr>
        `);
        break;
      }
      // console.log(v); break;
    }
}

function loop () {
    for (var n =0; n <speed; n++) {
        if (i >= r.length-1) {
            clearInterval(interval);
            finish();
            return;
        }
        
        var val = r[i] - r[i-1];
        if (val <0) val = 0;
        if (max < val) { max = val; }
        else if (min > val) { min = val; }
        data.push(val); i++;
    }
    //    data.push( r[i]-r[i-1] ); i++;

    // https://blockchair.com/bitcoin-sv/block/456672
    info.html(
      // new Date(r[i] *1000) +'-<br/>'+
      // new Date(r[r.length-1] *1000) +'<br/><br/>'+
      "Begin: "+ new Date(r[0] *1000) +'<br/>'+
      "End: "+ new Date(r[i] *1000) +'<br/><br/>'+
      `min time: <b>${min}</b> sec<br>
      max time: <b>${max}</b> sec<br>
      block No: ${i}; height: ${i+456672}`
      // +'<br/>'+
    );

    svg.selectAll("*").remove();
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(700))
        (data);
    // console.log(data); console.log(bins);

    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([height, 0]);

    var bar = g.selectAll(".bar")
      .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr("height", function(d) { return height - y(d.length); });
    /*
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.length); });
    */

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + 0 + ",0)")
        .call(d3.axisLeft(y));

}


// arithmetic mean (or mean or average)
function amean(arr) {
    var len = arr.length;
    var sum = 0;

    if ( !len ) { return null; }
    for (var i = 0; i < len; i++) {
        sum += arr[i];
    }
    return sum/len;
}
// geometric mean
function gmean(arr, ignore_negative) {
    if (ignore_negative === undefined) ignore_negative = false;

    var len = arr.length;
    var sum = 0;

    if ( !len ) { return null; }
    for (var i = 0; i < len; i++) {
        var val = arr[ i ];
        if ( val <= 0 ) {
            if (ignore_negative) continue;
            return NaN;
        }
        sum += Math.log( val ) / len;
    }
    return Math.exp( sum );
}
// The median is the value separating the higher half of a data sample, a population, or a probability distribution, from the lower half.
function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    return values.length %2
        ? values[half]
        : (values[half-1] + values[half]) / 2.0
    ;
}
