queue()
    .defer(d3.csv, "/data/drug-alcohol-uses.csv")
    .await(makeGraphs);

function makeGraphs(error, ageData) {
    var ndx = crossfilter(ageData);

    show_drug_selector(ndx);
    show_drug_use(ndx);
    show_drug_frequency(ndx);


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
        .width(940)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(age_dim)
        .group(use_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Drug")
        .yAxis().ticks(10);
}

function show_drug_frequency(ndx) {

    var age_dim = ndx.dimension(dc.pluck('age'));
    var frequency_group = age_dim.group().reduceSum(dc.pluck('frequency'));
    dc.barChart("#drug_frequency")
        .width(940)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(age_dim)
        .group(frequency_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Drug")
        .yAxis().ticks(10);
}
