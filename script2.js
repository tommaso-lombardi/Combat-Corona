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

//functions to pull parts of database for graphs
//for last minute's graph. mostly for testing
function lastMinute(arr) {
	var today = new Date();
	for (i=0; i <= arr.length; i++) {
		if ((today - arr[i]) < 600000) {
			return i
			break
		}
	}
}

//for last hour's
function lastHour(arr) {
	var today = new Date();
	for (i=0; i <= arr.length; i++) {
		if ((today - arr[i]) < 3600000) {
			return i
			break
		}
	}
}

//for last day's graph
function last24Hours(arr) {
	var today = new Date();
	for (i=0; i <= arr.length; i++) {
		if ((today - arr[i]) < 86400000) {
			return i
			break
		}
	}
}

//for last week's graph
function last7Days(arr) {
	var today = new Date();
	for (i=0; i <= arr.length; i++) {
		if ((today - arr[i]) < 604800000) {
			return i
			break
		}
	}
}

//getting index of the temporary data array that denotes the start of each period of time
var minuteIndex = lastMinute(currentData);//""
var hourIndex = lastHour(currentData); //uses the function we made above with the temp array as the data
var dayIndex = last24Hours(currentData); //uses the function we made above with the temp array as the data
var weekIndex = last7Days(currentData); //"" 


//initializing frequency arrays of when people touched their face based on the aspect we want to pull from the databse
var sFreqArray = new Array(60).fill(0);//""
var mFreqArray = new Array(60).fill(0);//""
var hFreqArray = new Array(24).fill(0); //i.e. [0, 0, 0, 0, ...0], length of 24 for the hours of the day
var weekFreqArray = new Array(7).fill(0); //i.e. [0, 0, 0, 0, 0, 0, 0, 0], length of 7 for the days of the week

//fill the seconds frequency array for the chart. iterates through the database starting at one minute ago, gets the seconds of each element, and adds 1 to the count for that second in the frequency array.
for (i= minuteIndex; i <currentData.length; i++) {
		var d = new Date();
		sFreqArray[59 - Math.floor((d - currentData[i])/(1000))]+=1 //finds distance in seconds between now and face touch, rounds down, and subtracts from 59 to find the index it should be put into the array at. if it happened 0 seconds ago, put it at the 59th index (aka the end)
}

//fill the minute frequency array for the chart. iterates through the database starting at one hour ago, gets the minute of each element, and adds 1 to the count for that minute in the frequency array.
for (i= hourIndex; i <currentData.length; i++) {
		var d = new Date();
		mFreqArray[59 - Math.floor((d - currentData[i])/(60000))]+=1// ""
}

//fill the hour frequency array for the chart. iterates through the database starting at 24 hours ago, gets the hour of each element, and adds 1 to the count for that hour in the frequency array.
for (i= dayIndex; i <currentData.length; i++) {
		var d = new Date();
		hFreqArray[23- Math.floor((d- currentData[i])/(3600000))]+=1//""
}

//fill the week frequency array for the chart. iterates through the database starting at one week ago, gets the day of each element, and adds 1 to the count for that day in the frequency array.
for (i=weekIndex; i <currentData.length; i++) {
		var d = new Date();
		weekFreqArray[6-Math.floor((d-currentData[i])/(3600000*24))]+=1//""
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
var ctx = document.getElementById("weekChart").getContext("2d");

var gradientFill = ctx.createLinearGradient(0, 0, 0, 800);
gradientFill.addColorStop(0, "rgba(235, 88, 51, 1)");
gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.0)");

var gradientStroke = ctx.createLinearGradient(0, 0, 0, 800);
gradientStroke.addColorStop(0, "rgba(235, 88, 51, 1)");
gradientStroke.addColorStop(1, "rgba(255, 255, 255, 0.0)");

var myChart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: days,
		datasets: [
			{
				label: "Last Week's Touches",
				data: weekFreqArray,
				borderColor: gradientStroke,
				backgroundColor: gradientFill
			}
		]
	},

	options: {
    	legend: {
        	display: false
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

var ctx2 = document.getElementById("dayChart").getContext("2d");
var myChart2 = new Chart(ctx2, {
	type: 'bar',
	data: {
		labels: hours,
		datasets: [
			{
				label: "Hour's Touches",
				data: hFreqArray,
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
    	}
	}

});

var ctx3 = document.getElementById("hourChart").getContext("2d");
var myChart3 = new Chart(ctx3, {
	type: 'bar',
	data: {
		labels: minutes,
		datasets: [
			{
				label: "Minute's Touches",
				data: mFreqArray,
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
    	}
	}

});

var ctx4 = document.getElementById("minuteChart").getContext("2d");
var myChart4 = new Chart(ctx4, {
	type: 'bar',
	data: {
		labels: seconds,
		datasets: [
			{
				label: "Second's Touches",
				data: sFreqArray,
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
    	}
	}

});