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
	var sFreqArray = new Array(60).fill(0); //initialize frequency array of face touches in the past minute
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

//ACTUALLY USING THE FUNCTIONS CREATED ABOVE TO MANIPULATE THE DATA:

//pulling the data from the database
var data = pullData();

//calling the functions we just made to make the data array for the 4 charts
sArray = lastMinute(data);
mArray = lastHour(data);
hArray = last24Hours(data);
wArray = last7Days(data);

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
				data: wArray,
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
				data: hArray,
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
	type: 'line',
	data: {
		labels: minutes,
		datasets: [
			{
				label: "Minute's Touches",
				data: mArray,
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
	type: 'line',
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
    	}
	}

});