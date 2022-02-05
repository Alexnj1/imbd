const apiKey = "c07b2488e7306d0323e72d8fd4992d94";
const tomtomKey = "U7LYTJNMpnMKGZ5b9HSZGOLHoCPL1kxU";
var mainBody = document.querySelector("main");
var queryString = document.location.search;
// console.log(queryString)
movieId = queryString.split("=")[2];
console.log(movieId);

// Accessing all needed data

function getLocation() {
  navigator.geolocation.getCurrentPosition(success);

  function success(geolocation) {
    // console.log(geolocation)
    console.log(
      geolocation.coords.latitude.toString(),
      geolocation.coords.longitude.toString()
    );
    var lat = geolocation.coords.latitude;
    var long = geolocation.coords.longitude;
    getTheaters(lat, long);
  }
}

function getMovieInfo() {
  fetch(
    "https://api.themoviedb.org/3/movie/" +
      movieId +
      "?api_key=" +
      apiKey +
      "&language=en-US"
  ).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      displayMovieInfo(data);
    });
  });
}

function getTheaters(lat, long) {
  fetch(
    "https://api.tomtom.com/search/2/categorySearch/cinema.json?key=" +
      tomtomKey +
      "&lat=" +
      lat +
      "&lon=" +
      long
  ).then(function (response) {
    response.json().then(function (data) {
      console.log(data);

      for (i = 0; i < 5; i++) {
        if (data.results[i].poi.url) {
          console.log(
            data.results[i].poi.name,
            data.results[i].address.freeformAddress,
            data.results[i].poi.url
          );
        }
      }

      document
        .querySelector(".theaters")
        .addEventListener("click", function () {
          console.log("hi");
          displayTheaters(data);
        });
    });
  });
}

// Displaying data

function displayMovieInfo(data) {
  var movieContainer = document.createElement("div"); // this to main body
  movieContainer.className = "movie-container";

  var poster = document.createElement("img"); // this to movie container 1
  poster.className = "movie-poster";
  poster.setAttribute(
    "src",
    "http://image.tmdb.org/t/p/w500/" + data.poster_path
  );

  var movieInfo = document.createElement("div"); // this to movie container 2
  movieInfo.className = "movie-info";

  var title = document.createElement("h3"); // this to movie info 3
  title.textContent = data.original_title;

  var secondaryInfo = document.createElement("div");
  secondaryInfo.className = "secondary-info";

  var genre = document.createElement("p");
  genre.textContent = "Genre: " + data.genres[0].name;

  var status = document.createElement("p");
  status.textContent = "Status: " + data.status;

  var releaseDate = document.createElement("p");
  releaseDate.textContent = "Release Date: " + data.release_date;

  secondaryInfo.append(genre, status, releaseDate); // this to movie info 4
  console.log(secondaryInfo);

  var overview = document.createElement("p");
  overview.innerHTML = data.tagline + "<br><br>" + data.overview; // this to movie info 5

  var links = document.createElement("div");
  links.className = "links";

  var moviePageLink = document.createElement("a");
  moviePageLink.setAttribute("href", data.homepage);
  moviePageLink.setAttribute("target", "_blank");

  var moviePageButton = document.createElement("button");
  moviePageButton.classList = "button is-info is-rounded is-medium";
  moviePageButton.textContent = "Visit Movie Homepage";

  if (data.homepage) {
    moviePageLink.appendChild(moviePageButton);
  }

  var moreInfoLink = document.createElement("a");
  moreInfoLink.setAttribute(
    "href",
    "https://www.themoviedb.org/movie/" + movieId
  );
  moreInfoLink.setAttribute("target", "_blank");

  var moreInfoButton = document.createElement("button");
  moreInfoButton.classList = "button is-info is-rounded is-medium";
  moreInfoButton.textContent = "More Info ...";

  moreInfoLink.appendChild(moreInfoButton);

  var theaterLink = document.createElement("a");
  theaterLink.setAttribute("target", "_blank");

  var theaterButton = document.createElement("button");
  theaterButton.classList = "button is-info is-rounded is-medium theaters";
  theaterButton.textContent = "Theaters in your area";

  theaterLink.appendChild(theaterButton);

  links.append(moviePageLink, theaterLink, moreInfoLink); // this to movie info 6

  var interactions = document.createElement("div");
  interactions.className = "interactions";
  interactions.append(links);

  mainBody.append(movieContainer);
  movieContainer.append(poster, movieInfo);
  movieInfo.append(title, secondaryInfo, overview, interactions);
}

function displayTheaters(data) {
  for (i = 0; i < 5; i++) {
    if (data.results[i].poi.url) {
      var theaterName;
      var main = document.querySelector(".interactions");

      var theaters = document.createElement("div");

      var theaterContainer = document.createElement("div");

      var iconSpan = document.createElement("span");
      iconSpan.className = "icon-span";

      var iconLink = document.createElement("a");
      iconLink.className = "icon-link";
      iconLink.setAttribute("target", "_blank");
      iconLink.setAttribute(
        "href",
        "https://www.google.com/maps/search/" + data.results[i].poi.name
      );

      var locationIcon = document.createElement("i");
      locationIcon.className = "fas fa-map-marked-alt fa-2x";

      iconLink.append(locationIcon);

      iconSpan.append(iconLink);

      var theaterInfo = document.createElement("div");
      theaterInfo.className = "theater-info";

      var info = document.createElement("p");
      info.className = "info-text";
      info.innerHTML =
        data.results[i].poi.name +
        "<br>" +
        data.results[i].address.freeformAddress +
        "<br>" +
        "<a target=_blank href=" +
        data.results[i].poi.url +
        ">Visit Website";

      theaterInfo.append(iconSpan, info);
      theaterContainer.append(theaterInfo);
      theaters.append(theaterContainer);
      main.append(theaters);
    }
  }
}

getLocation();

getMovieInfo();
