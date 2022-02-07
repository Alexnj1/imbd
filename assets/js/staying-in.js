var apiKey =  "api_key=c07b2488e7306d0323e72d8fd4992d94";
var mainDiv = document.getElementById("id-main");
var movieInputEl = document.getElementById("id-search-input");
var searchBtn = document.getElementById("id-search-btn");
var movieFormEl= document.getElementById("id-search-form");
var divContainer = document.getElementById("id-div-container");

var baseUrl = "https://api.themoviedb.org/3" // base URL to which we will concatenate
var imageBaseUrl = "https://image.tmdb.org/t/p/original" // for pulling movie posters
var lang = "&language=en-US"; // used in multiple API fetches
var includeAdult = "&include_adult=false"; // no adult titles returned
var searchResults = []; // hold movie search results. Array of objects
var similarMoviesResults = [] // hold similar movies search results. Array of objects
var watchLink = "";

var formSubmitHandler = function(event){
    // debugger;
    // prevent page from refreshing
    event.preventDefault();

    // clear out arrays to start fresh
    searchResults = [];
    similarMoviesResults = [];
    castInformationResults = [];

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
    console.log("Inside getSearchResults()");
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
            // console.log(searchResults.length, searchResults);
        })
            } else {
                console.log(`The fetch for ${apiUrl} was not successful`);
            }
        });
};

var displaySearchResults = function(){
    // debugger;
    console.log("Inside displaySearchResults()");
    if(divContainer.hasChildNodes()){
        divContainer.replaceChildren();
        setTimeout(() => {
            // display as many movie posters as there are items in searchResults[]
            for(var i = 0; i < searchResults.length; i++){
                var movieCard = document.createElement("div");
                movieCard.className = "card column is-3 mx-6 my-3 px-2 py-2 is-shadowless background-yellow";
                
                var movieHeader = document.createElement("div");
                movieHeader.className = "card-header custom-border";
               
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
    
                var divPosterAndPlot = document.createElement("div");
                divPosterAndPlot.className = "display-it-flex max-height-div-container";
                
                var moviePoster = document.createElement("div");
                moviePoster.innerHTML = `<figure class="image is-2by3">                            
                                            <img src="` + getMoviePosterImage(searchResults[i].id) + `" alt="Movie poster null">
                                        </figure>`;
                moviePoster.className = "card-image poster-size hand-pointer";
                moviePoster.setAttribute("data-movie-id", searchResults[i].id);
                moviePoster.addEventListener('click', displayMovieInformation);

                var moviePlot = document.createElement("p");
                moviePlot.innerText = searchResults[i].overview;
                moviePlot.className = `card-content custom-border
                max-width-fifty-percent hide-overflow show-overflow-on-hover`;
    
                // append elements to their respective containers
                movieHeader.append(movieTitle, addToFavBtn);
                divPosterAndPlot.append(moviePoster, moviePlot);
                movieCard.append(movieHeader, divPosterAndPlot);
                divContainer.append(movieCard);
            }
        }, 500);
    }
    
};

var getMoviePosterImage = function(movieId){
    // console.log("Inside getMoviePosterImage()");
    var movieObjectIndex = searchResults.findIndex((element) => element.id == movieId);
    var posterPath = searchResults[movieObjectIndex].poster_path;
    if(posterPath == null || posterPath == undefined) {
        console.log(`Movie with id ${movieId} has poster equal to null`);
        return;
    } else {
        var url = imageBaseUrl + posterPath;
        return url;
    }
    
}

var displayMovieInformation = function(event){
    console.log('Inside getMovieInformation()');
    // console.log('this is',this);
    // clear out main element
    divContainer.replaceChildren();
    // get selected movie's id to use in pulling information from searchResults[] and other arrays
    selectedMovieId = this.getAttribute('data-movie-id');
    var movieObjectIndex = searchResults.findIndex((element) => element.id == selectedMovieId);
    
    // fetch cast information and store the return string in castString variable
    
    getCastInformation(selectedMovieId, movieObjectIndex);
    
}

var addToFav = function(event){
    console.log("Inside addToFav()");
    var clickedEl = event.target;
    // clickedElClass = clickedEl.className();
    // console.log(clickedEl);
    var nearestBtn = clickedEl.closest("button.card-header-icon");
    // console.log(nearestBtn);
    if (nearestBtn != null){
        if(nearestBtn.matches("button")) {
            console.log('You clicked a movie to add to your favorites');
            favMovieId = nearestBtn.getAttribute("data-movie-id");
            console.log(favMovieId);
            //do something else for Megan
        }
    } else{
        return;
    }  
}

// fetch similar movies from corresponding api endpoint
// and store it in similarMoviesResults[]
var getSimilarMovies = function(movieId){
    console.log("Inside getSimilarMovies()");
    // debugger;
    var searchRecommendations = `/movie/${movieId}/recommendations?`;
    var apiUrl = baseUrl + searchRecommendations + apiKey + lang;
    // fetch the recommendations from the api
    fetch(apiUrl)
        .then(response => {
            if(response.ok){
                response.json()
        .then(data => {
            for(var i = 0; i < 10; i++){
                similarMoviesResults.push(data.results[i])
            }
            console.log(similarMoviesResults);
        })
            } else {
                console.log(`The fetch for ${apiUrl} was not successful`);
            }
        });
}

// fetch cast information from corresponding api endpoint
// and store it in castInformationResults[]
var getCastInformation = function(movieId, movieObjectIndex){
    console.log('Inside getCastInformation()');
    // debugger;
    var castInformation = `/movie/${movieId}/credits?`;
    var apiUrl = baseUrl + castInformation + apiKey + lang;
    // fetch the recommendations from the api
    fetch(apiUrl)
        .then(response => {
            if(response.ok){
                response.json()
        .then(data => {
            const castInformationResults = data.cast;
            console.log(castInformationResults);
            var castString = displayCastInformation(castInformationResults);
            getWatchProviders(movieId, movieObjectIndex, castString);

        })
            } else {
                console.log(`The fetch for ${apiUrl} was not successful`);
            }
        });
}

var displayCastInformation = function(castInformationResults){
    console.log('Inside displayCastInformation()');
    // setTimeout(() => {
        // local array to hold cast member names
        var castArray = [];
        // push first seven cast member names to array
        for (let i = 0; i < 7; i++) {
            cast = castInformationResults[i].name;
            castArray.push(cast);
        }
        // add final item that says 'and more.'
        castArray.push('and more.');
        // join the items
        castString = castArray.join(', ');
        // return the string
        console.log(castString);
        return castString;    
    // }, 2000);
}

var getWatchProviders = function (movieId, movieObjectIndex, castString){
    console.log('inside getWatchProviders');
    var watchProviders = `/movie/${movieId}/watch/providers?`;
    var apiUrl = baseUrl + watchProviders + apiKey;
    console.log(apiUrl);
    fetch(apiUrl)
        .then(response => {
            if(response.ok){
                response.json()
        .then(data => {
            watchLink = data.results["US"];
            console.log(watchLink);
            // div to hold movie poster and details about the movie, cast, runtime, etc
            var divContainerChild1 = document.createElement('div');
            divContainerChild1.className = "columns custom-border";

            // div to hold where to watch/stream
            var divContainerChild2 = document.createElement('div');
            divContainerChild1.className = "columns custom-border";


            var divMoviePosterImage = document.createElement('div');
            divMoviePosterImage.className = "column is-one-third custom-border";
            divMoviePosterImage.innerHTML = `<figure class="image is-2by3">                            
                                                <img src="` + getMoviePosterImage(movieId) + `" alt="Movie poster null">
                                            </figure>`;

            var divMovieInformationList = document.createElement('div');
            divMovieInformationList.className = "column custom-border";
            
            var blockMovieTitle = document.createElement('div');
            blockMovieTitle.className = 'block text-color';
            blockMovieTitle.innerText = `Title: ${searchResults[movieObjectIndex].title}`
            var blockMoviePlot = document.createElement('div');
            blockMoviePlot.className = 'block text-color';
            blockMoviePlot.innerText = `Synopsis: ${searchResults[movieObjectIndex].overview}`;
            var blockReleaseDate = document.createElement('div');
            blockReleaseDate.className = 'block text-color';
            blockReleaseDate.innerText = `Release Date: ${searchResults[movieObjectIndex].release_date}`;
            var blockMovieCast = document.createElement('div');
            blockMovieCast.className = 'block text-color';
            blockMovieCast.innerText = 'Cast Includes: ' + castString;
            var blockWatchProviders = document.createElement('div');
            blockWatchProviders.className = 'block text-color';
            blockWatchProviders.innerHTML = `For a link to watch providers for this film, click <a href="` + watchLink.link + `">here</a>.`;

            // will need to run getSimilarMovies(movieId) to fetch api information
            // getSimilarMovies(selectedMovieId);
            
            // append everything to divContainer
            divMovieInformationList.append(blockMovieTitle, blockMoviePlot, blockReleaseDate, blockMovieCast, blockWatchProviders);
            divContainerChild1.append(divMoviePosterImage, divMovieInformationList);
            divContainer.append(divContainerChild1, divContainerChild2);
        })
            } else {
                console.log(`The fetch for ${apiUrl} was not successful`);
            }
        });
}


///// Event Listeners /////

// listen for click on search form and run formSubmitHandler
movieFormEl.addEventListener("submit", formSubmitHandler);

// click listener for adding movie to favorites list
divContainer.addEventListener('click', addToFav);