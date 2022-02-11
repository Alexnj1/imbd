var dropdown = document.querySelector(".dropdown");
dropdown.addEventListener("click", function (event) {
  event.stopPropagation();
  dropdown.classList.toggle("is-active");
});

const myNav = document.querySelector("#navbar-menu");
const burger = document.querySelector("#burger");
burger.addEventListener("click", () => {
  myNav.classList.toggle("is-active");
  burger.classList.toggle("is-active");
});

var genreListContainer = document.querySelector("#genre-list");
var genreEl = document.querySelector("#genre");

var apiKey = "c07b2488e7306d0323e72d8fd4992d94";

var getGenreTitles = function (genreId) {
  var apiUrl =
    "https://api.themoviedb.org/3/discover/movie/?api_key=" +
    apiKey +
    "&language=en-US&page=1&includeadult=false&sortby=votecount.desc&withgenres=" +
    genreId;

  // make a get request to url
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayGenreTitles(data.results);
    });
};

var updateCurrentGenre = function (genre) {
  genreTitle = document.createElement("h3");
  genreTitle.textContent = "Genre: " + genre + " 🎥";
  genreTitle.classList.add("title", "is-3");
  genreListContainer.appendChild(genreTitle);
};

var clearMovieList = function () {
  genreListContainer.innerHTML = "";
};

var selectGenre = function (genre, genreId) {
  clearMovieList();
  updateCurrentGenre(genre);
  getGenreTitles(genreId);
};

var displayGenreTitles = function (results) {
  results.forEach((element) => {
    genreListContainer.classList.remove("is-invisible");
    movieDiv = document.createElement("div");
    movieDiv.classList.add("columns", "p-2", "box", "movie-div");

    var imagePath = element.poster_path;
    images = "https://image.tmdb.org/t/p/w500/" + imagePath;
    movieImg = document.createElement("img");
    movieImg.setAttribute("src", images);
    movieImg.classList.add("image");
    movieDiv.appendChild(movieImg);

    var titleDescription = document.createElement("div");
    titleDescription.className = "title-description";

    genreTitle = document.createElement("div");
    genreTitle.textContent = element.title;
    genreTitle.classList.add("column", "movie-title", "title");
    titleDescription.appendChild(genreTitle);

    genreDescription = document.createElement("p");
    genreDescription.textContent = element.overview;
    genreDescription.classList.add("column", "movie-info");
    titleDescription.appendChild(genreDescription);

    movieDiv.appendChild(titleDescription);

    var buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    a = document.createElement("a");
    a.setAttribute(
      "href",
      "https://www.themoviedb.org/movie/" +
        element.id +
        "-" +
        element.title +
        "?language=en-US"
    );
    a.target = "_blank";
    a.innerText = "More Info";
    a.classList.add("button", "mr-3", "is-info", "is-rounded");
    buttonContainer.appendChild(a);

    favoriteListEl = document.createElement("button");
    favoriteListEl.classList.add(
      "button",
      "fav-button",
      "is-danger",
      "is-rounded"
    );

    favoriteListEl.textContent = "Add to Favorites";
    favoriteListEl.addEventListener("click", () => {
      saveFavorite(element);
    });

    buttonContainer.appendChild(favoriteListEl);
    movieDiv.appendChild(buttonContainer);
    genreListContainer.appendChild(movieDiv);
  });
};

var saveFavorite = function (movie) {
  let currentFavorites = localStorage.getItem("favorites");
  currentFavorites = currentFavorites ? JSON.parse(currentFavorites) : [];

  let currentFavoriteIds = currentFavorites.map(function (m) {
    return m.id;
  });

  if (currentFavoriteIds.includes(movie.id)) return false;

  let newFavorites = JSON.stringify(currentFavorites.concat(movie));
  localStorage.setItem("favorites", newFavorites);
};
