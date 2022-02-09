const apiKey = "c07b2488e7306d0323e72d8fd4992d94";
var pageNumber = 1;
var mainBody = document.querySelector("main");

var movieResultContainer = document.querySelector(".movie-result-container");
var sortInfo = document.querySelector(".sort-info");

var upcomingButton = document.querySelector(".upcoming");
var nowPlayingButton = document.querySelector(".now-playing");

var loadMoreButton = document.querySelector(".load-more");

const myNav = document.querySelector("#navbar-menu")
const burger = document.querySelector("#burger")
burger.addEventListener('click', ()=> {
    myNav.classList.toggle("is-active")
    burger.classList.toggle("is-active")
})

function getUpcoming(pageNumber) {
  fetch(
    "https://api.themoviedb.org/3/movie/upcoming?api_key=" +
      apiKey +
      "&language=en-US&region=us&page=" +
      pageNumber
  )
    .then(function (response) {
      response.json().then(function (data) {
        console.log("upcoming");
        console.log(data);

        for (i = 0; i < data.results.length; i++) {
          var movieDate = data.results[i].release_date;
          var movieName = data.results[i].original_title;
          if (moment().isBefore(movieDate)) {
            var movieContainer = document.createElement("div");
            movieContainer.classList = "movie-container";
            var movieLink = document.createElement("a");
            movieLink.classList = "is-flex movie-a";
            movieLink.setAttribute(
              "href",
              "./movie-page.html?movie=" +
                movieName.replace(/\s+/g, "-").toLowerCase() +
                "&id=" +
                data.results[i].id
            );
            movieLink.setAttribute("target", "_blank");

            var poster = document.createElement("img");
            poster.className = "movie-poster";
            poster.setAttribute(
              "src",
              "http://image.tmdb.org/t/p/w500/" + data.results[i].poster_path
            );

            var movieDescription = document.createElement("div");
            movieDescription.className = "movie-description";

            var title = document.createElement("p");
            title.textContent = data.results[i].original_title.toUpperCase();
            title.className = 'm-title'

            var release = document.createElement("p");
            release.textContent =
              "Release Date: " + data.results[i].release_date;
            release.className = 'm-release'

            var description = document.createElement("p");
            description.textContent =
              "Description: " + data.results[i].overview;
            description.className = 'm-description'

            movieDescription.appendChild(title);
            movieDescription.appendChild(release);
            movieDescription.appendChild(description);

            movieLink.appendChild(poster);
            movieLink.appendChild(movieDescription);

            movieContainer.appendChild(movieLink);

            movieResultContainer.appendChild(movieContainer);
          }
        }
        sortInfo.removeAttribute("hidden");
        loadMoreButton.className = "load-more button is-info is-rounded";
        loadMoreButton.textContent = "See More Movies";
      });
    })
    .catch(function (error) {
      console.error();
      errorMessage();
    });
}

function getNowPlaying(pageNumber) {
  fetch(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
      apiKey +
      "&language=en-US&region=us&page=" +
      pageNumber
  )
    .then(function (response) {
      response.json().then(function (data) {
        console.log("now playing");
        console.log(data);

        for (i = 0; i < data.results.length; i++) {
          var movieDate = data.results[i].release_date;
          var movieName = data.results[i].original_title;

          if (
            moment(movieDate).isAfter(moment().subtract(45, "days").calendar())
          ) {
            var movieContainer = document.createElement("div");
            movieContainer.classList = "movie-container";
            var movieLink = document.createElement("a");
            movieLink.classList = "is-flex";
            movieLink.setAttribute(
              "href",
              "./movie-page.html?movie=" +
                movieName.replace(/\s+/g, "-").toLowerCase() +
                "&id=" +
                data.results[i].id
            );
            movieLink.setAttribute("target", "_blank");

            var poster = document.createElement("img");
            poster.className = "movie-poster";
            poster.setAttribute("src", "./assets/images/imbd-logos.jpeg");
            poster.setAttribute(
              "src",
              "http://image.tmdb.org/t/p/w500/" + data.results[i].poster_path
            );

            var movieDescription = document.createElement("div");
            movieDescription.className = "movie-description";

            var title = document.createElement("p");
            title.textContent = data.results[i].original_title.toUpperCase();
            title.className = 'm-title'

            var release = document.createElement("p");
            release.textContent =
              "Release Date: " + data.results[i].release_date;
            release.className = 'm-release'
            var description = document.createElement("p");
            description.textContent =
              "Description: " + data.results[i].overview;
              description.className = 'm-description'

            movieDescription.appendChild(title);
            movieDescription.appendChild(release);
            movieDescription.appendChild(description);

            movieLink.appendChild(poster);
            movieLink.appendChild(movieDescription);

            movieContainer.appendChild(movieLink);

            movieResultContainer.appendChild(movieContainer);
          }
        }
        sortInfo.removeAttribute("hidden");
        loadMoreButton.className = "load-more button is-info is-rounded";
        loadMoreButton.textContent = "See More Movies";
      });
    })
    .catch(function (error) {
      console.error();
      errorMessage();
    });
}

function errorMessage() {
  document.querySelector(".load").textContent = "";
  document.querySelector(".sort-info").textContent = "";

  var errorContainer = document.querySelector(".error-message");

  var errorPicture = document.createElement("img");
  errorPicture.setAttribute("src", "./assets/images/popcorn-error.png");

  var errorText = document.createElement("h3");
  errorText.textContent = "We're sorry, something went wrong!";

  var refreshButton = document.createElement("button");
  refreshButton.className = "button is-danger is-rounded error-button";
  refreshButton.textContent = "Try Again";

  errorContainer.append(errorPicture, errorText, refreshButton);

  document
    .querySelector(".error-button")
    .addEventListener("click", function () {
      location.reload();
    });
}

function loadMoreUpcoming() {
  loadMoreButton.addEventListener("click", function () {
    pageNumber++;
    getUpcoming(pageNumber);
  });
}

function loadMoreNowplaying() {
  loadMoreButton.addEventListener("click", function () {
    pageNumber++;
    getNowPlaying(pageNumber);
  });
}

upcomingButton.addEventListener("click", function () {
  movieResultContainer.textContent = "";
  document.querySelector(".error-message").textContent = "";
  getUpcoming();
  loadMoreUpcoming();
  nowPlayingButton.disabled = false;
  upcomingButton.disabled = true;
});

nowPlayingButton.addEventListener("click", function () {
  movieResultContainer.textContent = "";
  document.querySelector(".error-message").textContent = "";
  getNowPlaying();
  loadMoreNowplaying();
  nowPlayingButton.disabled = true;
  upcomingButton.disabled = false;
});
