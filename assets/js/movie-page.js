var queryString = document.location.search
console.log(queryString)
movieName = queryString.split('=')[1]
console.log(movieName)