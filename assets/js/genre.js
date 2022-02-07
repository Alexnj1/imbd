
var dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});

var genreListContainer = document.querySelector("#genre-list");
var genreEl = document.querySelector("#genre");


var apiKey = "c07b2488e7306d0323e72d8fd4992d94";

var getGenreTitles = function(genreId){
 
    var apiUrl = "https://api.themoviedb.org/3/discover/movie/?api_key=" + apiKey + "&language=en-US&page=1&include_adult=false&sort_by=vote_count.desc&with_genres=" + genreId;

     // make a get request to url
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => { 
            console.log(data)
            displayGenreTitles(data.results)
            
        });
};

var updateCurrentGenre = function(genre) {
    genreTitle = document.createElement("h3");
    genreTitle.textContent = "Genre: " + genre + " 🎥";
    genreTitle.classList.add("title", "is-3");
    genreListContainer.appendChild(genreTitle);
}

var clearMovieList = function() {
    genreListContainer.innerHTML = '';
}

var selectGenre = function(genre, genreId) {
    clearMovieList();
    updateCurrentGenre(genre);
    getGenreTitles(genreId);    
}

var displayGenreTitles = function(results) {
    results.forEach(element => {
        genreListContainer.classList.remove("is-invisible");
        movieDiv = document.createElement("div");
        movieDiv.classList.add("columns", "p-2", "box", "movie-div");
        

        var imagePath = element.poster_path;
        images = "https://image.tmdb.org/t/p/w500/" + imagePath
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

        a = document.createElement("a");
        a.setAttribute('href', "https://www.themoviedb.org/movie/" + element.id + "-" + element.title + "?language=en-US");
        a.target = '_blank';
        a.innerText = 'More Info';
        a.classList.add("button", "mr-3");
        movieDiv.appendChild(a);

        favoriteListEl = document.createElement("button");
        favoriteListEl.classList.add("button", "favorite-btn");
        favoriteListEl.textContent = "Add to List";
      
        movieDiv.appendChild(favoriteListEl);
        genreListContainer.appendChild(movieDiv)
    });

}






