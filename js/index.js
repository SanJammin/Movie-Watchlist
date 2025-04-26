const searchMovie = document.getElementById("search-movie");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    fetch(`http://www.omdbapi.com/?apikey=ba1b48&t=${searchMovie.value}`)
        .then(res => res.json())
        .then(movie => {
            console.log(movie);
        })
});