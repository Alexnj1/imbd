var apiKey =  "api_key=c07b2488e7306d0323e72d8fd4992d94";
var movieInputEl = document.querySelector("#movie-input");
var searchBtn = document.querySelector("#searchBtn");
var movieFormEl= document.querySelector("#id-search-form");
var mainDiv = document.querySelector("#id-main-div")
var addToFavBtn = document.querySelector("button.card-header-icon");


var baseUrl = "https://api.themoviedb.org/3" // base URL to which we will concatenate
var imageBaseUrl = "https://image.tmdb.org/t/p/original" // for pulling movie posters
var lang = "&language=en-US"; // may use this parameter in future api fetches
var includeAdult = "&include_adult=false"; // same with this parameter
var isDataRetrieved = false;
var searchResults = []; // hold movie search results. Array of objects
var movieId = 11772;

var formSubmitHandler = function(event){
    // debugger;
    // prevent page from refreshing
    event.preventDefault();
    // clear out searchResults[] to start fresh
    searchResults = [];
    // get value from input element
    var searchString = movieInputEl.value.trim();
    if(searchString){
        getSearchResults(searchString);
        displaySearchResults();
        // clear old content
        movieInputEl.value = "";
        // user must enter a city
    } else{
        alert("Please enter a movie");
    }
}

var getSearchResults = function(aSearchString){
    console.log("Inside getSearchResults");
    // debugger;
    var searchMovie = "/search/movie?";
    var apiUrl = baseUrl + searchMovie + apiKey + lang + "&query=" + aSearchString + includeAdult;
     // a fetch returns a promise that resolves to the response to that request,
     // as soon as the server responds with headers, even if the server response is an HTTP error status.
    fetch(apiUrl)
        .then(response => {
            if(response.ok){
                response.json()
        .then(data => {
            for(var i = 0; i <data.results.length; i++){
                // console.log(`At index ${i} of data.results`);
                searchResults.push(data.results[i])
            }
            // searchResults = searchResults.concat(data.results);
            console.log(searchResults.length, searchResults);
        })
            } else {
                console.log(`The fetch for ${apiUrl} was not successful`);
            }
        });
};

var displaySearchResults = function() {
    // debugger;
    console.log("Inside displaySearchResults()");
    // Used this timeout function because fetching is asynchronous,
    // so add delay for searchResults[] to populate so it has length
    setTimeout(() => {
        mainDiv.replaceChildren();
        // display as many movie posters as there are items in searchResults[]
        for(var i = 0; i < searchResults.length; i++){
            var movieCard = document.createElement("div");
            movieCard.className = "card column is-3 mx-6 my-6 px-2 py-2";
            
            var movieHeader = document.createElement("div");
            movieHeader.className = "card-header black-border";
           
            var movieTitle = document.createElement("span");
            movieTitle.innerText = searchResults[i].original_title + ' - ' + searchResults[i].release_date.substring(0,4);
            movieTitle.className = "card-header-title";
            
            var addToFavBtn = document.createElement("button");
            addToFavBtn.className = "card-header-icon";
            addToFavBtn.setAttribute("data-movie-id", searchResults[i].id);
            addToFavBtn.innerHTML = `<span class="icon-text has-text-info">
                                        <span class="icon">
                                            <i class="far fa-star"></i>
                                        </span>
                                        <span>Add To List</span>
                                    </span>`; // <i class="fas fa-star"></i> for filled-in star

            var divContainer = document.createElement("div");
            divContainer.className = "display-it-flex max-height-div-container";
            
            var moviePoster = document.createElement("div");
            moviePoster.innerHTML = `<figure class="image is-2by3">                            
                                        <img src="` + getMoviePosterImage(searchResults[i].id) + `" alt="Movie poster null">
                                    </figure>`;
            moviePoster.className = "card-image poster-size";
            moviePoster.setAttribute("data-movie-id", searchResults[i].id);
            moviePoster.addEventListener('click', getMovieInformation);
            
            var moviePlot = document.createElement("p");
            moviePlot.innerText = searchResults[i].overview;
            moviePlot.className = "card-content black-border max-width-fifty-percent is-clipped"; // don't want text clipped....

            // append elements to their respective containers
            movieHeader.append(movieTitle, addToFavBtn);
            divContainer.append(moviePoster, moviePlot);
            movieCard.append(movieHeader, divContainer);
            mainDiv.append(movieCard);
        }
    }, 500);
};

var getMoviePosterImage = function(movieId){
    var movieObjectIndex = searchResults.findIndex((element) => element.id == movieId);
    var url = imageBaseUrl + searchResults[movieObjectIndex].poster_path;
    return url;
    
    // maybe this fetch is not required; perhaps just with variable apiUrl is enough??
    /* fetch(apiUrl)
        .then( response => {
            if(response.ok) {
                response.blob()
                .then( theBlob => {
                    var moviePosterBlob = URL.createObjectURL(theBlob);
                    console.log(moviePosterBlob, typeof moviePosterBlob);
                    return moviePosterBlob;
            })} else {
                console.log(`The fetch for ${apiUrl} was not successful`);
            }
        }) */
}

var getMovieInformation = function(event){
    console.log("Inside getMovieInformation()");
    console.log(event);
    console.log(event.target);
    console.log('this is',this);
    // clear out main element
    mainDiv.replaceChildren();
}

var addToFav = function(event) {
    console.log("Inside addToFav()");
    var clickedEl = event.target;
    var nearestBtn = clickedEl.closest("button.card-header-icon");
    console.log(nearestBtn);
    if(nearestBtn.matches("button")) {
        console.log('You clicked a movie to add to your favorites');
        favMovieId = nearestBtn.getAttribute("data-movie-id");
        console.log(favMovieId);
        //do something else for Megan
    }
}

///// Event Listeners /////

// listen for click on search form and run formSubmitHandler
movieFormEl.addEventListener("submit", formSubmitHandler);

// click listener for adding movie to favorites list
mainDiv.addEventListener('click', addToFav);