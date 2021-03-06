$( document ).ready(function() {
	$('#chart_section').hide();
});

var hideSearch=function(){
	$('#search_section').hide();
};

function generateChart(sn){
	$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=analytics.csv&callback=?', function (csv) {

        $('#mychart').highcharts({

            data: {
                csv: csv,
                // Parse the American date format used by Google
                parseDate: function (s) {
                    var match = s.match(/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2})$/);
                    if (match) {
                        return Date.UTC(+('20' + match[3]), match[1] - 1, +match[2]);
                    }
                }
            },

            title: {
                text: sn+'\'s Psych Plot'
            },

            subtitle: {
                text: 'Source: Google Analytics'
            },

            xAxis: {
                type: 'datetime',
                tickInterval: 7 * 24 * 3600 * 1000, // one week
                tickWidth: 0,
                gridLineWidth: 1,
                labels: {
                    align: 'left',
                    x: 3,
                    y: -3
                }
            },

            yAxis: [{ // left y axis
                title: {
                    text: null
                },
                labels: {
                    align: 'left',
                    x: 3,
                    y: 16,
                    format: '{value:.,0f}'
                },
                showFirstLabel: false
            }, { // right y axis
                linkedTo: 0,
                gridLineWidth: 0,
                opposite: true,
                title: {
                    text: null
                },
                labels: {
                    align: 'right',
                    x: -3,
                    y: 16,
                    format: '{value:.,0f}'
                },
                showFirstLabel: false
            }],

            legend: {
                align: 'left',
                verticalAlign: 'top',
                y: 20,
                floating: true,
                borderWidth: 0
            },

            tooltip: {
                shared: true,
                crosshairs: true
            },

            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {
                                hs.htmlExpand(null, {
                                    pageOrigin: {
                                        x: e.pageX,
                                        y: e.pageY
                                    },
                                    headingText: this.series.name,
                                    maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                                        this.y + ' visits',
                                    width: 200
                                });
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
            }
        });
    });

	
}


var drawGraph=function(sn){
	Q(jQuery.ajax({
	    url: 'foo.php',
	    type: 'post',
	    dataType: 'json',
	    data: {screenname: sn}
	})).then(function(json) {
	    	addSeries([[Date.UTC(2014,8,20), -0.2],[Date.UTC(2014,8,21), -0.3],[Date.UTC(2014,8,22), -0.5],[Date.UTC(2014,8,23), 0.2]],true);
	    	//add series
	    }, function(){
	    	alert('err');
	    })
};

function addSeries(data,visible){
	var chart = $('#mychart').highcharts();
	chart.addSeries({
		name: 'Anxiety level',
		data: data,
		visible: visible,
		lineWidth: 4,
        marker: {
            radius: 4
        }
	});
	chart.redraw();
	
}


$('#search').click(function() {
	var sn=$('#sn').val();
	if(sn==''){alert('Please enter a screenname!');}
	else{
		Q.fcall(hideSearch)
		.then(function(){$('#loader1').show();})
		.then(function(){generateChart(sn);})
		.then(drawGraph(sn))
		.then(function(){$('#loader1').hide();$('#mychart').show();})
	}
});





