const apiKey = 'c07b2488e7306d0323e72d8fd4992d94'

fetch('https://api.themoviedb.org/3/movie/upcoming?api_key=' + apiKey + '&language=en-US&page=1').then(function(response){
    response.json().then(function(data){
        console.log(data)
    })
})