const apiKey = 'c07b2488e7306d0323e72d8fd4992d94'
var pageNumber = 1
var movieContainer = document.querySelector('.movie-result-container')
loadButton = document.querySelector('button')
function getUpcoming (pageNumber) {

    fetch('https://api.themoviedb.org/3/movie/upcoming?api_key=' + apiKey + '&language=en-US&page=' + pageNumber).then(function(response){
        response.json().then(function(data){
            console.log('upcoming')
            console.log(data)
            
            for(i=0;i<data.results.length;i++) {
                var movieDate = data.results[i].release_date
                if (moment().isBefore(movieDate)) {
                    console.log(data.results[i].release_date)

                }
                
            }
        })
    })

}

fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=' + apiKey + '&language=en-US&page=1').then(function(response){
    response.json().then(function(data){
        console.log('now playing')
        console.log(data)
    })
})

loadButton.addEventListener('click', function() {
    getUpcoming(pageNumber)
    pageNumber ++
})