const apiKey = "c07b2488e7306d0323e72d8fd4992d94";
var pageNumber = 1;
var mainBody = document.querySelector("main");

var movieResultContainer = document.querySelector(".movie-result-container");
var sortInfo = document.querySelector('.sort-info')

var upcomingButton = document.querySelector(".upcoming");
var nowPlayingButton = document.querySelector(".now-playing");

var loadMoreButton = document.querySelector(".load-more");


function getUpcoming(pageNumber) {
  fetch(
    "https://api.themoviedb.org/3/movie/upcoming?api_key=" +
      apiKey +
      "&language=en-US&page=" +
      pageNumber
  ).then(function (response) {
    response.json().then(function (data) {
      console.log("upcoming");
      console.log(data);

      for (i = 0; i < data.results.length; i++) {
        var movieDate = data.results[i].release_date;
        if (moment().isBefore(movieDate)) {
          // console.log(data.results[i].release_date)
          var movieContainer = document.createElement("div");
          movieContainer.classList = "movie-container";
          var movieLink = document.createElement("a");
          movieLink.classList = "is-flex";
          movieLink.setAttribute("src", "");

          var poster = document.createElement("img");
          poster.className = "movie-poster";
          poster.setAttribute("src", "./assets/images/imbd-logos.jpeg");

          var movieDescription = document.createElement("div");
          movieDescription.className = "movie-description";

          var title = document.createElement("p");
          title.textContent = data.results[i].original_title.toUpperCase();

          var release = document.createElement("p");
          release.textContent = "Release Date: " + data.results[i].release_date;

          var description = document.createElement("p");
          description.textContent = "Description: " + data.results[i].overview;

          movieDescription.appendChild(title);
          movieDescription.appendChild(release);
          movieDescription.appendChild(description);

          movieLink.appendChild(poster);
          movieLink.appendChild(movieDescription);

          movieContainer.appendChild(movieLink);

          movieResultContainer.appendChild(movieContainer);
        }
      }

      //   var loadMore = document.createElement('div')

      //   var loadMoreButton = document.createElement('button')
      //   loadMoreButton.classList = ('now-playing button is-info is-rounded')
      //   loadMoreButton.textContent = 'See More Movies'

      //   loadMore.appendChild(loadMoreButton)
      //   mainBody.appendChild(loadMore)
      sortInfo.removeAttribute('hidden')
      loadMoreButton.className = "load-more button is-info is-rounded";
      loadMoreButton.textContent = "See More Movies";
    });
  });
}

function getNowPlaying(pageNumber) {
  fetch(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
      apiKey +
      "&language=en-US&page=" +
      pageNumber
  ).then(function (response) {
    response.json().then(function (data) {
      console.log("now playing");
      console.log(data);

      for (i = 0; i < data.results.length; i++) {
        var movieDate = data.results[i].release_date;
        var movieName = data.results[i].original_title

        if (moment(movieDate).isAfter(moment().subtract(45, 'days').calendar())) {
            var movieContainer = document.createElement("div");
            movieContainer.classList = "movie-container";
            var movieLink = document.createElement("a");
            movieLink.classList = "is-flex";
            movieLink.setAttribute("href", "./movie-page.html?movie=" + movieName.replace(/\s+/g, ''));
            movieLink.setAttribute("target", "_blank")

            var poster = document.createElement("img");
            poster.className = "movie-poster";
            poster.setAttribute("src", "./assets/images/imbd-logos.jpeg");

            var movieDescription = document.createElement("div");
            movieDescription.className = "movie-description";

            var title = document.createElement("p");
            title.textContent = data.results[i].original_title.toUpperCase();

            var release = document.createElement("p");
            release.textContent = "Release Date: " + data.results[i].release_date;

            var description = document.createElement("p");
            description.textContent = "Description: " + data.results[i].overview;

            movieDescription.appendChild(title);
            movieDescription.appendChild(release);
            movieDescription.appendChild(description);

            movieLink.appendChild(poster);
            movieLink.appendChild(movieDescription);

            movieContainer.appendChild(movieLink);

            movieResultContainer.appendChild(movieContainer); 
        }
        
      }
      sortInfo.removeAttribute('hidden')
      loadMoreButton.className = "load-more button is-info is-rounded";
      loadMoreButton.textContent = "See More Movies";
    });
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
  getUpcoming();
  loadMoreUpcoming();
  nowPlayingButton.disabled = false
  upcomingButton.disabled = true;
});

nowPlayingButton.addEventListener("click", function () {
  movieResultContainer.textContent = "";
  getNowPlaying();
  loadMoreNowplaying();
  nowPlayingButton.disabled = true
  upcomingButton.disabled = false;
  // document.location = ('https://www.google.com')
});
