//function that pulls the entire database from localstorage and converts it into dates
function pullData() {

	//putting localStorage in variable for ease of use
	var database = localStorage;

	//initializing temporary array to pull localstorage data into for graphs
	var currentData = [];
	 
	//pull the data from the database
	for (var i = 0; i < database.length; i++) { //iterate through the database
		//get the key at each index, get the value (item) at each key, and convert from string back to date before pushing to array 
	    currentData.push(JSON.parse(database.getItem(database.key(i)))); 
	}

	//sort the current data because it's not sorted for some reason
	currentData.sort(function(a,b){
	  return new Date(a) - new Date(b);
	})

	//convert the array of strings back into dates because they're string again for some reason
	for (i=0; i<currentData.length; i++) {
		currentData[i] = new Date(currentData[i]);
	}
	return currentData;
}

//functions that put the frequencies of the last minute, hour, day, or week of the pulled database info into arrays for the charts
function lastMinute(arr) { //arr will be the data that we pulled from the database AKA localstorage
	var index = 0; //initializing the element's index in the data that is that start of within one minute from now
	var today = new Date(); //getting the current time
	for (i=0; i <= arr.length; i++) { //iterates through the data, and...
		if ((today - arr[i]) < 600000) {//once it hits an element that is within one minute of the current time...
			index = i;//store that index and break the for loop
			break;
		}
	}
	var sFreqArray = new Array(60).fill(0); //initialize frequency array of face touches in the past minute using the index we just found above
	for (i=index; i <arr.length; i++) { //iterate through each of the elements in the past minute in the data
		sFreqArray[59-Math.floor((today-arr[i])/(1000))]+=1; //store the elements by their seconds from the current time
	}
	return sFreqArray //return the array to be put into the chart as data
}

//comments above are valid for the next three functions as well
function lastHour(arr) {
	index = 0;
	var today = new Date();
	for (i=0; i <= arr.length; i++) {
		if ((today - arr[i]) < 3600000) {
			index = i;
			break
		}
	}
	var mFreqArray = new Array(60).fill(0);
	for (i= index; i <arr.length; i++) {
		mFreqArray[59 - Math.floor((today - arr[i])/(60000))]+=1;
	}
	return mFreqArray
}

//for last day's graph
function last24Hours(arr) {
	index = 0;
	var today = new Date();
	for (i=0; i <= arr.length; i++) {
		if ((today - arr[i]) < 86400000) {
			index = i;
			break
		}
	}
	var hFreqArray = new Array(24).fill(0);
	for (i= index; i <arr.length; i++) {
			var d = new Date();
			hFreqArray[23- Math.floor((today- arr[i])/(3600000))]+=1;
	}
	return hFreqArray
}

//for last week's graph
function last7Days(arr) {
	index = 0;
	var today = new Date();
	for (i=0; i <= arr.length; i++) {
		if ((today - arr[i]) < 604800000) {
			index = i;
			break
		}
	}
	var weekFreqArray = new Array(7).fill(0); 
	for (i=index; i <arr.length; i++) {
		weekFreqArray[6-Math.floor((today-arr[i])/(3600000*24))]+=1;
	}
	return weekFreqArray
}

function findAverage(arr) {
	var totalSum = 0;
	for (i=0; i<arr.length; i++) {
		totalSum = (totalSum + arr[i]);
	}
	var average = Math.round(10*(totalSum/arr.length))/10;

	var averageLine = [];
	for (i=0; i<arr.length; i++) {
		averageLine[i] = average;
	}

	return averageLine;
}

//CHART CREATION STARTS HERE

//x axis for seconds chart
var seconds = []; //initialize

for (i=59; i>0; i--) {
	seconds.push((i.toString(10)).concat("s ago")); //add 1s ago, 2s ago, etc.
}

seconds.push("Past Second"); //for the most recent option - look at the charts

//x axis for minute chart
var minutes = []; //same thing as above

for (i=59; i>0; i--) {
	minutes.push((i.toString(10)).concat("m ago"));
}
minutes.push("Past Minute");

//x axis for hour chart, same thing as above
var hours = [];

for (i=23; i>0; i--) {
	hours.push((i.toString(10)).concat("h ago"));
}

hours.push("Past Hour");

//x axis for week chart, hardcoded unlike the others above
var days = ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "1d ago", "Past 24h"];

//creating the chart itself
// var ctx = document.getElementById("chartCanvas").getContext("2d");
var ctx = document.getElementById("chartCanvas").getContext("2d");

var charts = [];

var gradientFill = ctx.createLinearGradient(0, 0, 0, 800);
gradientFill.addColorStop(0, "rgba(235, 88, 51, 1)");
gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.0)");

var gradientStroke = ctx.createLinearGradient(0, 0, 0, 800);
gradientStroke.addColorStop(0, "rgba(235, 88, 51, 1)");
gradientStroke.addColorStop(1, "rgba(255, 255, 255, 0.0)");

function weekChart() {
	var data = pullData();
	var wArray = last7Days(data);
	var weekChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: days,
			datasets: [
				{
					label: "Last Week's Touches",
					data: wArray,
					borderColor: gradientStroke,
					backgroundColor: gradientFill
				},

				{
					label: "Average Touches",
					data: findAverage(wArray),
					borderColor: gradientStroke,
					borderDash: [10,25],
					fill: false
				}
			]
		},

		options: {
	    	legend: {
	        	display: false
	    	},
	    	elements: {
	    		point: {
	    			radius: 0
	    		}
	    	},
	    	scales: {
	    		xAxes: [{
	    			gridLines: {
	    				display: false
	    			}
	    		}],
				yAxes: [{
					gridLines: {
						display: false
					}
				}]
	    	}
	    }
	});

	charts.push(weekChart);
	return weekChart;
}

function dayChart() {
	var data = pullData();
	var hArray = last24Hours(data);
	var dayChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: hours,
			datasets: [
				{
					label: "Hour's Touches",
					data: hArray,
					borderColor: gradientStroke,
					backgroundColor: gradientFill
				},

				{
					label: "Average Touches",
					data: findAverage(hArray),
					borderColor: gradientStroke,
					borderDash: [10,25],
					fill: false
				}
			]
		},
		options: {
			scales: {
				xAxes:[{
	    			ticks:{
	        			autoSkip: true,
	        			maxTicksLimit: 12
	    			},
	    			gridLines: {
	                	display: false
	            	}
				}],
				yAxes: [{
					gridLines: {
						display: false
					}
				}]
			},
			legend: {
	        	display: false
	    	},
	    	elements: {
	    		point: {
	    			radius: 0
	    		}
	    	}
		}

	});
		charts.push(dayChart);
		return dayChart;
};

function hourChart() {
	var data = pullData();
	var mArray = lastHour(data);
	var hourChart = new Chart(ctx, {
		data: {

			labels: minutes,
			datasets: [
				{
					label: "Minute's Touches",
					data: mArray,
					type: 'bar',
					borderColor: gradientStroke,
					backgroundColor: gradientFill
				}
			]
		},
		options: {
			scales: {
				xAxes:[{
	    			ticks:{
	        			autoSkip: true,
	        			maxTicksLimit: 4
	    			},
	    			gridLines: {
	                	display: false
	            	}
				}],
				yAxes: [{
					gridLines: {
						display: false
					}
				}]
			},
			legend: {
	        	display: false
	    	},
	    	elements: {
	    		point: {
	    			radius: 0
	    		}
	    	}
		}

		});

		charts.push(hourChart);
		return hourChart
};

function minuteChart() {
	var data = pullData();
	var sArray = lastMinute(data);
	var minuteChart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: seconds,
		datasets: [
			{
				label: "Second's Touches",
				data: sArray,
				borderColor: gradientStroke,
				backgroundColor: gradientFill
			}
		]
	},
	options: {
		scales: {
			xAxes:[{
    			ticks:{
        			autoSkip: true,
        			maxTicksLimit: 4
    			},
    			gridLines: {
                	display: false
            	}
			}],
			yAxes: [{
				gridLines: {
					display: false
				}
			}]
		},
		legend: {
        	display: false
    	},
    	elements: {
    		point: {
    			radius: 0
    		}
    	},
    	animation: false
	}

});
	charts.push(minuteChart);
	return minuteChart
}

function draw(time) {
	for (i=0; i<charts.length;  i++) {
		charts[i].destroy();
	}

	if (time === 'minute') {
		minuteChart();
	}

	else if (time === 'hour') {
		hourChart();
	}

	else if (time === 'day') {
		dayChart();
	}

	else if (time === 'week') {
		weekChart();
	}
}

 update the charts with a button so we don't have to refresh the page every time. eventually should update every second or something automatically
function updateCharts() {
	var data = pullData(); //pull the fresh, current data from the database

	minuteChart.data.datasets[0].data = lastMinute(data); //replace the minute chart's first dataset's data with the fresh array
	hourChart.data.datasets[0].data = lastHour(data); //""
	dayChart.data.datasets[0].data = last24Hours(data); //""
	weekChart.data.datasets[0].data = last7Days(data); //""

	minuteChart.update(); //actually call the chart to update with the new data in place
	hourChart.update(); //""
	dayChart.update(); //""
	weekChart.update(); //""
}

function updateLoop() {
	setInterval(updateCharts, 60000);
}

updateLoop();