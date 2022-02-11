var apiKey = "api_key=c07b2488e7306d0323e72d8fd4992d94";
var movieInputEl = document.getElementById("id-search-input");
var searchBtn = document.getElementById("id-search-btn");
var movieFormEl = document.getElementById("id-search-form");
var divContainer = document.getElementById("id-div-container");
// div to hold movie poster and details about the movie, cast, runtime, etc
var divContainerChild = document.createElement("div");
divContainerChild.className = "columns";
divContainerChild.setAttribute("id", "id-div-container-child");
// div to hold miscellaneous movie information and trailer to the right of the poster
var divMovieInformationList = document.createElement("div");
divMovieInformationList.className = "column is-flex";
divMovieInformationList.setAttribute("id", "id-div-movie-information-list");

var baseUrl = "https://api.themoviedb.org/3"; // base URL to which we will concatenate
var imageBaseUrl = "https://image.tmdb.org/t/p/original"; // for pulling movie posters
var youtubeBaseUrl = "https://www.googleapis.com/youtube/v3/search"; // for pulling movie trailer
var lang = "&language=en-US"; // used in API fetches
var searchResults = []; // hold movie search results. Array of objects
var watchLink = "";
var vidId = "";

const myNav = document.querySelector("#navbar-menu");
const burger = document.querySelector("#burger");
burger.addEventListener("click", () => {
  myNav.classList.toggle("is-active");
  burger.classList.toggle("is-active");
});

var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();
  // clear out arrays to start fresh
  searchResults = [];
  similarMoviesResults = [];
  castInformationResults = [];
  // get value from input element
  var searchString = movieInputEl.value.trim();
  // if user entered some string, then search for it
  if (searchString) {
    getSearchResults(searchString);
    displaySearchResults();
    // clear old content
    movieInputEl.value = "";
  } else {
    alert("Please enter a movie");
  }
};

// the first fetch for results; populates searchResults[] with movie objects
var getSearchResults = function (string) {
  var includeAdult = "&include_adult=false";
  var searchMovie = "/search/movie?";
  var apiUrl =
    baseUrl + searchMovie + apiKey + lang + "&query=" + string + includeAdult;
  // a fetch returns a promise that resolves to the response to that request,
  // as soon as the server responds with headers, even if the server response is an HTTP error status.
  fetch(apiUrl).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        for (var i = 0; i < data.results.length; i++) {
          searchResults.push(data.results[i]);
        }
        if (searchResults.length == 0) {
          var divBadSearch = document.createElement("div");
          divBadSearch.innerHTML = `<h1 class='title is-2 text-color'>Your search returned with no results; please refine your search.</h1>`;
          divContainer.append(divBadSearch);
        }
        console.log(searchResults);
      });
    } else {
      console.log(`The fetch for ${apiUrl} was not successful`);
    }
  });
};

var displaySearchResults = function () {
  // if container has any nodes, clear container
  if (divContainer.hasChildNodes()) {
    // whether it's the first search or user is searching again, clear container
    divContainer.replaceChildren();

    setTimeout(() => {
      // display as many movie posters as there are items in searchResults[]
      for (var i = 0; i < searchResults.length; i++) {
        // create card container which will hold movie title, poster, and movie plot text
        var movieCard = document.createElement("div");
        movieCard.className = `card column is-full-mobile is-half-tablet
                 is-one-third-desktop is-one-fifth-widescreen movie-card mx-1 my-5 px-1 py-2 is-shadowless 
                 card-background-transparent-blur outline-black`;

        // movie header holds movie title and favorites button
        var movieHeader = document.createElement("div");
        movieHeader.className = "card-header is-shadowless";

        var movieTitle = document.createElement("div");
        movieTitle.innerText =
          searchResults[i].original_title +
          " - " +
          searchResults[i].release_date.substring(0, 4);
        movieTitle.className = "card-header-title title-text text-color";

        var addToFavBtn = document.createElement("button");
        addToFavBtn.className = "movie-add-fav card-header-icon";
        addToFavBtn.setAttribute("data-movie-id", searchResults[i].id);
        addToFavBtn.innerHTML = `<span class='icon-text has-text-success has-text-weight-medium'>
                                            <span class='icon'>
                                                <i class='far fa-star'></i>
                                            </span>
                                            <span>Add</span>
                                        </span>`;
        addToFavBtn.addEventListener("click", (event) => {
          amendFavoritesList(event);
        });

        // div to hold poster and plot text
        var divPosterAndPlot = document.createElement("div");
        divPosterAndPlot.className =
          "poster-and-plot is-flex is-justify-content-center max-height-div-container text-color";

        var moviePoster = document.createElement("div");
        moviePoster.innerHTML =
          `<figure class='image is-2by3'>                            
                                            <img src='` +
          getMoviePosterImage(searchResults[i].id) +
          `' alt='Movie poster null'>
                                        </figure>`;
        moviePoster.className = "poster card-image hand-pointer";
        moviePoster.setAttribute("data-movie-id", searchResults[i].id);
        // add event listener to movie poster such that when the poster is clicked, run displayMovieInformation
        moviePoster.addEventListener("click", displayMovieInformation);

        var moviePlot = document.createElement("div");
        moviePlot.innerText = searchResults[i].overview;
        moviePlot.className = "plot handle-overflow card-content text-color";

        // append elements to their respective containers

        movieHeader.append(movieTitle, addToFavBtn);
        divPosterAndPlot.append(moviePoster, moviePlot);
        movieCard.append(movieHeader, divPosterAndPlot);
        divContainer.append(movieCard);
      }
    }, 500);
  }
};

var getMoviePosterImage = function (movieId) {
  var movieObjectIndex = searchResults.findIndex(
    (element) => element.id == movieId
  );
  var posterPath = searchResults[movieObjectIndex].poster_path;
  if (posterPath == null || posterPath == undefined) {
    console.log(`Movie with id ${movieId} has poster equal to null`);
    return;
  } else {
    var url = imageBaseUrl + posterPath;
    return url;
  }
};

var displayMovieInformation = function () {
  // clear out container because it will have all the card elements
  divContainer.replaceChildren();
  // get selected movie's id to use in pulling information from searchResults[] and other arrays
  selectedMovieId = this.getAttribute("data-movie-id");
  // also get that movie's index in searchResults[]
  var movieObjectIndex = searchResults.findIndex(
    (element) => element.id == selectedMovieId
  );
  // fetch cast information passing the movie id and index as parameters
  getCastInformation(selectedMovieId, movieObjectIndex);
};

// change the data stored locally as 'favorites' and
// update the icon styling as well
var amendFavoritesList = function (event) {
  var clickedEl = event.target;
  var nearestBtn = clickedEl.closest("button.card-header-icon");
  if (nearestBtn != null) {
    console.log("You clicked a movie to add to favorites!");
    var favMovieId = nearestBtn.getAttribute("data-movie-id");
    var favMovieObject = searchResults.find(
      (movieObject) => movieObject.id == favMovieId
    );
    let currentFavorites = localStorage.getItem("favorites");
    if (nearestBtn.innerHTML.includes("fas")) {
      currentFavorites = currentFavorites ? JSON.parse(currentFavorites) : [];
      let newFavorites = currentFavorites.filter((movieObject) => {
        return movieObject.id !== favMovieObject.id;
      });
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      nearestBtn.innerHTML = `<span class='icon-text has-text-success has-text-weight-medium'>
                                        <span class='icon'>
                                            <i class='far fa-star'></i>
                                        </span>
                                    <span>Add</span>
                                    </span>`;
    } else {
      currentFavorites = currentFavorites ? JSON.parse(currentFavorites) : [];
      let currentFavoriteIds = currentFavorites.map(function (m) {
        return m.id;
      });
      if (currentFavoriteIds.includes(favMovieObject.id)) return false;
      let newFavorites = JSON.stringify(
        currentFavorites.concat(favMovieObject)
      );
      localStorage.setItem("favorites", newFavorites);
      nearestBtn.innerHTML = `<span class='icon-text has-text-success has-text-weight-medium'>
                                        <span class='icon'>
                                            <i class='fas fa-star'></i>
                                        </span>
                                        <span>Remove</span>
                                    </span>`;
    }
  }
};

// fetch cast information from corresponding api endpoint
// and also run getWatchProviders.
var getCastInformation = function (movieId, movieObjectIndex) {
  var castInformation = `/movie/${movieId}/credits?`;
  var apiUrl = baseUrl + castInformation + apiKey + lang;
  // fetch the cast info from the api
  fetch(apiUrl).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        const castInformationResults = data.cast;
        // store the return from displayCastInformation
        var castString = displayCastInformation(castInformationResults);
        // try to get the youtube video id for the movie poster that's clicked on
        getYoutubeVideoId(movieObjectIndex);
        // fetch watch providers to get particular tmdb link and pass the cast string
        // and youtube video id as parameters too
        getWatchProviders(movieId, movieObjectIndex, castString, vidId);
      });
    } else {
      console.log(`The fetch for ${apiUrl} was not successful`);
    }
  });
};

// join the cast names into one string and return it. This
// function will run in getCastInformation. Takes as a parameter
// the array of cast objects that are fetched.
var displayCastInformation = function (castInformationResults) {
  console.log("inside displayCastInformation()");
  // local array to hold cast member names
  var castArray = [];
  // push first seven cast member names to array
  for (let i = 0; i < 7; i++) {
    cast = castInformationResults[i].name;
    castArray.push(cast);
  }
  // add final item that says 'and more.'
  castArray.push("and more.");
  // join the items
  castString = castArray.join(", ");
  // return the string
  return castString;
};

// fetch the Youtube id for the movie clicked on by the user
// when the movie poster images are initially displayed.
var getYoutubeVideoId = function (movieObjectIndex) {
  console.log("inside getYoutubeVideo()");

  var movieTitle = searchResults[movieObjectIndex].original_title + " trailer";
  var releaseDate = searchResults[movieObjectIndex].release_date.substring(
    0,
    4
  );
  console.log(movieTitle);
  var endpointForFetch =
    "https://v1.nocodeapi.com/jcomp03/yt/gSOrjpYYbSvEexRB/search?q=" +
    movieTitle +
    releaseDate +
    "&type=video&maxResults=3&api_key=AIzaSyBoJlu4TN-eQm2gK0ce2uDgbO3RitGY-fQ";

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: "get",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(endpointForFetch, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      vidId = result.items[0].id.videoId;
      console.log("getYoutubeVideoId(): Video id is " + vidId);
      displayMovieTrailer(vidId);
    });
};

// when the user clicks on a particular movie poster and the movie page loads,
// display the movie trailer in divContainer after the miscellaneous movie information
var displayMovieTrailer = function (vidId) {
  // div to hold iframe that shows the movie trailer
  var movieIframe = document.createElement("iframe");
  movieIframe.setAttribute("src", `https://www.youtube.com/embed/` + vidId);
  movieIframe.setAttribute("id", "id-iframe");
  console.log(movieIframe.getAttribute("src"));
  movieIframe.setAttribute("width", "560");
  movieIframe.setAttribute("height", "315");
  movieFormEl.setAttribute("target", "_parent");
  movieIframe.setAttribute("frameborder", "0");
  movieIframe.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  );
  movieIframe.setAttribute("allowfullscreen", "");
  movieIframe.className = "column";
  // append iframe to divMovieInformationList
  divMovieInformationList.append(movieIframe);
};

// gets the link URL for where the movie can be watched as well as dynamically
// creates HTML to populate the page after the user has clicked on a movie poster
var getWatchProviders = function (movieId, movieObjectIndex, castString) {
  console.log("inside getWatchProviders()");
  var watchProviders = `/movie/${movieId}/watch/providers?`;
  var apiUrl = baseUrl + watchProviders + apiKey;
  console.log(apiUrl);
  fetch(apiUrl).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        watchLink = data.results["US"].link;

        // clear out divContainer and divMovieInformationList
        divContainerChild.replaceChildren();
        divMovieInformationList.replaceChildren();

        // div to hold large movie poster image
        var divMoviePosterImage = document.createElement("div");
        divMoviePosterImage.setAttribute("id", "id-div-movie-poster");
        divMoviePosterImage.className = "column"; //is-one-third';
        divMoviePosterImage.innerHTML =
          `<figure class='image is-2by3'>                            
                                                <img src='` +
          getMoviePosterImage(movieId) +
          `' alt='Movie poster null'>
                                            </figure>`;

        // divs that are classed as Bulma block and that hold the miscellaneous movie info
        // i.e. title, synopsis, release date, cast, and link to where the movie can be watched
        /*             var blockMovieTitle = document.createElement('div');
            blockMovieTitle.className = 'block text-color';
            blockMovieTitle.innerText = `${searchResults[movieObjectIndex].title}` */
        var blockMoviePlot = document.createElement("div");
        blockMoviePlot.className = "block text-color";
        blockMoviePlot.innerText = `Synopsis: ${searchResults[movieObjectIndex].overview}`;
        var blockReleaseDate = document.createElement("div");
        blockReleaseDate.className = "block text-color";
        blockReleaseDate.innerText = `Release Date: ${searchResults[movieObjectIndex].release_date}`;
        var blockMovieCast = document.createElement("div");
        blockMovieCast.className = "block text-color";
        blockMovieCast.innerText = "Cast Includes: " + castString;
        var blockWatchProviders = document.createElement("div");
        blockWatchProviders.className = "block text-color";
        blockWatchProviders.innerHTML =
          `For a link to watch providers for this film, click <a href='` +
          watchLink +
          `'>here</a>.`;
        // do the necessary appends, and finally append everything to divContainer
        divMovieInformationList.prepend(
          blockMoviePlot,
          blockReleaseDate,
          blockMovieCast,
          blockWatchProviders
        );
        divContainerChild.append(divMoviePosterImage, divMovieInformationList);
        divContainer.append(divContainerChild);
      });
    } else {
      console.log(`The fetch for ${apiUrl} was not successful`);
    }
  });
};

///// Event Listeners /////
// listen for click on search form and run formSubmitHandler
movieFormEl.addEventListener("submit", formSubmitHandler);

// click listener for adding movie to favorites list
divContainer.addEventListener("click", amendFavoritesList);
