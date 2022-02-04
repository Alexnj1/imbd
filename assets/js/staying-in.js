var apiKey =  "api_key=c07b2488e7306d0323e72d8fd4992d94";
var movieInputEl = document.querySelector("#movie-input");
var searchBtn = document.querySelector("#searchBtn");
var movieFormEl= document.querySelector("#movie-search-form");

var baseUrl = "https://api.themoviedb.org/3/" // base URL to which we will concatenate
var imageBaseUrl = "https://image.tmdb.org/t/p/w500/" // for pulling movie posters
var lang = "&language=en-US"; // may use this parameter in future api fetches
var includeAdult = "&include_adult=false"; // same with this parameter
var searchResults = []; // hold movie search results. Array of objects

var formSumbitHandler = function(event){
    // prevent page from refreshing
   event.preventDefault();
   // get value from input element
   var movie = movieInputEl.value.trim();
   if(movie){
       getSearchResults(movie);
       // clear old content
       movieInputEl.value = "";
       // user must enter a city
   } else{
       alert("Please enter a movie");
   }
}


var getSearchResults = function(movie){
    var searchMovie = "search/movie?"
    var apiUrl = baseUrl + searchMovie + apiKey + lang + "&query=" + movie + includeAdult;
     // a fetch returns a promise that resolves to the response to that request,
     // as soon as the server responds with headers, even if the server response is an HTTP error status.
    fetch(apiUrl)
        .then(response => {
            if(response.ok){
                response.json()
        .then(data => {
            console.log(typeof data.results, data);
            searchResults = searchResults.concat(data.results);
            // console.log(searchResults.length);
            console.log(apiUrl);
            })
        } else {
            console.log(`The fetch for ${apiUrl} was not successful`);
        }
    })
};

var displayMovieInfo = function(movieResults) {

};

var getMoviePosterImage = function(moviePosterPath) {
    var getConfiguration = "configuration?"
    var apiUrl = baseUrl + moviePosterPath;
    // var apiUrl = imageBaseUrl + moviePosterPath;
    fetch(apiUrl)
}

// event listener for search form
movieFormEl.addEventListener("submit", formSumbitHandler);

