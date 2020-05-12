
//gives random dates and times given a start and end date for testing purposes. 
//Simulates when people touched their face over the span of a month.
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

//adds a random date/time to the input array. Mimicking adding the date/time whenever someone touches their face. final version will use input from AI instead
function pushDate(dateArr) {
	var d = randomDate(new Date(2020, 3, 30), new Date()); //uses the randomDate function from above to generate the random date
	dateArr.push(d); //adds the date to the database
}

//master "database" to store full info when people touch their faces
var dateArray = [];

//fills the "database" array with 100 face touching instances to test with. final version will use input from AI instead
for (i=0; i<1000; i++) {
	pushDate(dateArray);
}


//sorts database by chronological order. Won't have to do this with real input, just have to do it because testing input is randomized
dateArray.sort(function(a,b){
  return new Date(a) - new Date(b);
})

//function to only get the previous day's worth of data from the sorted database for daily graph. if todays date minus the date in the database is less than a day's worth of milliseconds, then keep going until it's less than a day apart
function last24Hours(arr) {
	var today = new Date();
	for (i=0; i <= arr.length; i++) {
		if ((today.getTime() - arr[i].getTime()) < 86400000) {
			return i
			break
		}
	}
}

//same but for the previous week.
function last7Days(arr) {
	var today = new Date();
	for (i=0; i <= arr.length; i++) {
		if ((today.getTime() - arr[i].getTime()) < 604800000) {
			return i
			break
		}
	}
}

//getting index of the database that denotes the start of the last 24 hours and the start of the last week.
var dayIndex = last24Hours(dateArray); //uses the function we made above with the database as the data
var weekIndex = last7Days(dateArray); //"" 

// //trying out just the dates array
// var dayDatabase = [];
// var weekDatabase = [];

// for (i=dayIndex; i< dateArray.length; i++) {
// 	dayDatabase.push(dateArray[i])
// }

// for (i=weekIndex; i< dateArray.length; i++) {
// 	weekDatabase.push(dateArray[i])
// }

//initializing frequency arrays of when people touched their face based on the aspect we want to pull from the databse
var hFreqArray = new Array(24).fill(0); //i.e. [0, 0, 0, 0, ...0], length of 24 for the hours of the day
var weekFreqArray = new Array(7).fill(0); //i.e. [0, 0, 0, 0, 0, 0, 0, 0], length of 7 for the days of the week

//fill the hour frequency array for the chart. iterates through the database starting at 24 hours ago, gets the hour of each element, and adds 1 to the count for that hour in the frequency array.
for (i= dayIndex; i <dateArray.length; i++) {
		hFreqArray[dateArray[i].getHours()]+=1
}

//fill the week frequency array for the chart. iterates through the database starting at one week ago, gets the day of each element, and adds 1 to the count for that day in the frequency array.
for (i=weekIndex; i <dateArray.length; i++) {
		weekFreqArray[dateArray[i].getDay()]+=1
}






//CHART CREATION STARTS HERE

//x axis for hour chart, data for lines is hFreqArray. Concat and toString to create 1:00, 2:00, etc. for hours
var hours = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"]  

//var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
//x axis for week chart, data for lines is weekFreqArray
var days = ["S", "M", "T", "W", "T", "F", "S"];

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
var myChart = new Chart(ctx2, {
	type: 'bar',
	data: {
		labels: hours,
		datasets: [
			{
				label: "Last Day's Touches",
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



