var myData = [667, 668, 669];


// Function to store the data into Local Storage 
function store_data (arr) {
	// Turn the array into a string
	let myArr_serialized = JSON.stringify(arr);
	// Upload the string-array to local storage
	localStorage.setItem("count", myArr_serialized);
	
	// test print statement 
	console.log(localStorage);
}

// Function to retreive the data from Local Storage
function retrieve_data () {
	// Retrieve the array from local storage and convert it back to numbers
	let myArr_deserialized = JSON.parse(localStorage.getItem("count"));
	
	// test print statement
	console.log(myArr_deserialized);
}

store_data(myData);
retrieve_data();