const myNav = document.querySelector("#navbar-menu");
const burger = document.querySelector("#burger");
burger.addEventListener("click", () => {
  myNav.classList.toggle("is-active");
  burger.classList.toggle("is-active");
});

var getFavorites = function () {
  var favoritesListEl = document.getElementById("favorites-list");
  currentFavorites = localStorage.getItem("favorites");
  currentFavorites = currentFavorites ? JSON.parse(currentFavorites) : [];

  currentFavorites.forEach((element) => {
    movieDiv = document.createElement("div");
    movieDiv.classList.add("columns", "box", "movie-div", "mt-2");
    //movieDiv.setAttribute("id", "movie");

    var imagePath = element.poster_path;
    images = "https://image.tmdb.org/t/p/w500/" + imagePath;
    movieImg = document.createElement("img");
    movieImg.setAttribute("src", images);
    movieImg.classList.add("image");
    movieDiv.appendChild(movieImg);

    genreTitle = document.createElement("div");

    genreTitle.textContent = element.title;
    genreTitle.classList.add("column", "movie-title", "title", "is-3");
    movieDiv.appendChild(genreTitle);

    genreDescription = document.createElement("p");
    genreDescription.textContent = element.overview;
    genreDescription.classList.add("column", "movie-info");
    movieDiv.appendChild(genreDescription);

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
    a.classList = "button is-rounded is-info";
    buttonContainer.appendChild(a);

    removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove From Favorites 💔";
    removeBtn.classList = "button is-rounded is-info";
    removeBtn.addEventListener("click", () => {
      removeFavorite(element);
    });

    buttonContainer.appendChild(removeBtn);
    movieDiv.appendChild(buttonContainer);
    favoritesListEl.appendChild(movieDiv);
  });
};

var removeFavorite = function (element) {
  let currentFavorites = localStorage.getItem("favorites");
  currentFavorites = currentFavorites ? JSON.parse(currentFavorites) : [];
  console.log(currentFavorites);
  console.log(element);

  let newFavorites = currentFavorites.filter((movie) => {
    return movie.id !== element.id;
  });

  localStorage.setItem("favorites", JSON.stringify(newFavorites));

  window.location.reload();
};

getFavorites();
