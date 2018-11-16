queue()
    .defer(d3.csv, "/data/drug-alcohol-uses.csv")
    .await(makeGraphs);

function makeGraphs(error, ageData) {
    var ndx = crossfilter(ageData);


    show_drug_selector(ndx);
    show_drug_use(ndx);
    show_drug_frequency(ndx);
    show_scatter_plot_alcohol_marijuana(ndx)
    show_scatter_plot_other_drugs(ndx);

    dc.renderAll();
}

function show_drug_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('drug'));
    var group = dim.group();

    dc.selectMenu("#drug-selector")
        .dimension(dim)
        .group(group);
}


function show_drug_use(ndx) {

    var age_dim = ndx.dimension(dc.pluck('age'));
    var use_group = age_dim.group().reduceSum(dc.pluck('use'));
    dc.barChart("#drug_use")
        .width(750)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(age_dim)
        .group(use_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Age")
        .yAxis().ticks(10);
}

function show_drug_frequency(ndx) {

    var age_dim = ndx.dimension(dc.pluck('age'));
    var frequency_group = age_dim.group().reduceSum(dc.pluck('frequency'));
    dc.barChart("#drug_frequency")
        .width(750)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(age_dim)
        .group(frequency_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Age")
        .yAxis().ticks(10);
}



function show_scatter_plot_alcohol_marijuana(ndx) {

    var drugColors = d3.scale.ordinal()
        .domain(["alcohol", "marijuana"])
        .range(["red", "green"]);

    var frequencyDim = ndx.dimension(dc.pluck("frequency"));
    var useDim = ndx.dimension(function(d) {
        return [d.frequency, d.use, d.drug];
    });
    var useGroup = useDim.group();

    // var minAge = ageDim.bottom(1)[0].age;
    // var maxAge = ageDim.top(1)[0].age;

    dc.scatterPlot("#scatter_plot_alcohol_marijuana")
        .width(750)
        .height(400)
        .x(d3.scale.linear().domain([1,90]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("Use")
        .yAxisLabel("Frequency")
        .colorAccessor(function(d) {
            return d.key[2];
        })
        .colors(drugColors)
        .dimension(frequencyDim)
        .group(useGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}

function show_scatter_plot_other_drugs(ndx) {

 var drugColors = d3.scale.ordinal()
           .domain([ "cocaine", "crack", "heroin", "hallucinogen", "inhalant", "pain-reliever", "oxycontin", "tranquilizer", "stimulant", "meth", "sedative"])
        .range([ "grey", "brown", "black", "purple", "yellow", "orange", "pink", "blue", "silver", "gold", "aqua"]);

    var frequencyDim = ndx.dimension(dc.pluck("frequency"));
    var useDim = ndx.dimension(function(d) {
        return [d.frequency, d.use, d.drug];
    });
    var useGroup = useDim.group();

    // var minAge = ageDim.bottom(1)[0].age;
    // var maxAge = ageDim.top(1)[0].age;

    dc.scatterPlot("#scatter_plot_other_drugs")
        .width(750)
        .height(400)
        .x(d3.scale.linear().domain([1,90]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("Use")
        .yAxisLabel("Frequency")
        .colorAccessor(function(d) {
            return d.key[2];
        })
        .colors(drugColors)
        .dimension(frequencyDim)
        .group(useGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}


