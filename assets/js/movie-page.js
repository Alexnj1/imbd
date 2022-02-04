const apiKey = "c07b2488e7306d0323e72d8fd4992d94";
var mainBody = document.querySelector('main')
var queryString = document.location.search
// console.log(queryString)
movieId = queryString.split('=')[2]
console.log(movieId)

function getMovieInfo () {
    fetch('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + apiKey + '&language=en-US').then(function(response) {
        response.json().then(function(data){
            console.log(data)
            displayMovieInfo(data)
        })
    })
}

function displayMovieInfo (data) {
    var movieContainer = document.createElement('div') // this to main body
    movieContainer.className = 'movie-container'

    var poster = document.createElement('img') // this to movie container 1
    poster.className = 'movie-poster'
    poster.setAttribute ("src", 'http://image.tmdb.org/t/p/w500/' + data.poster_path)

    var movieInfo = document.createElement ('div') // this to movie container 2
    movieInfo.className = 'movie-info'

    var title = document.createElement ('h3') // this to movie info 3
    title.textContent = data.original_title

    var secondaryInfo = document.createElement('div')
    secondaryInfo.className = 'secondary-info'

    var genre = document.createElement('p')
    genre.textContent = ('Genre: ' + data.genres[0].name)

    var status = document.createElement('p')
    status.textContent = 'Status: ' + data.status

    var releaseDate = document.createElement('p')
    releaseDate.textContent = 'Release Date: ' + data.release_date

    secondaryInfo.append(genre, status, releaseDate) // this to movie info 4
    console.log(secondaryInfo)

    var overview = document.createElement ('p')
    overview.innerHTML = (data.tagline + "<br>" + data.overview) // this to movie info 5

    var links = document.createElement ('div')
    links.className = 'links'

    var moviePageLink = document.createElement ('a')
    moviePageLink.setAttribute ('href', data.homepage)

    var moviePageButton = document.createElement('button')
    moviePageButton.classList = ('button is-info is-rounded is-medium')
    moviePageButton.textContent = 'Visit Movie Homepage'

    if (data.homepage){
        moviePageLink.appendChild(moviePageButton)

    }

    var moreInfoLink = document.createElement ('a')
    moreInfoLink.setAttribute ('href', 'https://www.themoviedb.org/movie/' + movieId)

    var moreInfoButton = document.createElement('button')
    moreInfoButton.classList = ('button is-info is-rounded is-medium')
    moreInfoButton.textContent = 'More Info ...'

    moreInfoLink.appendChild(moreInfoButton)

    links.append(moviePageLink, moreInfoLink) // this to movie info 6
    
    mainBody.append(movieContainer)
    movieContainer.append(poster, movieInfo)
    movieInfo.append(title, secondaryInfo, overview, links)

}

function getLocation () {
    navigator.geolocation.getCurrentPosition(success)

    function success (geolocation) {
    // console.log(geolocation)
    console.log(geolocation.coords.latitude.toString(), geolocation.coords.longitude.toString())
    }
}

getLocation()

getMovieInfo()