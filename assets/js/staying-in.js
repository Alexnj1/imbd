var apiKey =  "c07b2488e7306d0323e72d8fd4992d94";
var movieInputEl = document.querySelector("#movie-input");
var searchBtn = document.querySelector("#searchBtn");
var movieFormEl= document.querySelector("#movie-search-form");

var formSumbitHandler = function(event){
    // prevent page from refreshing
   event.preventDefault();
   // get value from input element
   var movie = movieInputEl.value.trim();
   if (movie){
       getMovieInfo(movie);
       // clear old content
       movieInputEl.value = "";
       // user must enter a city
   } else {
       alert("Please enter a movie");
   }
}

var getMovieInfo = function(){
    var movie = movieInputEl.value.trim();
    var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&language=en-US&query=" + movie + "&page=1&include_adult=true";

     // make a get request to url
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => { 
            console.log(data)
            
        });
};

var displayMovieInfo = function(movieResults) {

};


// event listener for search form
movieFormEl.addEventListener("submit", formSumbitHandler);

