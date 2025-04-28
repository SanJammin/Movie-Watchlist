const searchMovie = document.getElementById("search-movie");
const searchBtn = document.getElementById("search-btn");
const movieList = document.getElementById("movie-list")

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    movieList.innerHTML = ``;
    fetch(`http://www.omdbapi.com/?apikey=ba1b48&s=${searchMovie.value}`)
        .then(res => res.json())
        .then(searchResults => {
            searchResults.Search.forEach(movie => {
                const poster = movie.Poster
                fetch(`http://www.omdbapi.com/?apikey=ba1b48&i=${movie.imdbID}`)
                    .then(res => res.json())
                    .then(movieID => {
                        movieList.innerHTML += `
                        <div class="movie-card">
                            <img src=${poster} alt="Poster of ${movieID.Title}" class="movie-poster">
                            <div class="movie-details">
                                <div class="title-and-rating">
                                    <h2 class="movie-title">${movieID.Title}</h2>
                                    <img class="star-rating" src="./icons/star-icon.png" alt="A Star">
                                    <p class="movie-rating">${movieID.imdbRating}</p>
                                </div>
                                <div class="runtime-genre-add">
                                    <p class="runtime">${movieID.Runtime}</p>
                                    <p class="genre">${movieID.Genre}</p>
                                    <img class="add-icon" src="./icons/add-icon.png" alt="A plus symbol">
                                    <p class="add-watchlist">Watchlist</p>
                                </div>
                                <div class="plot">
                                    <p class="movie-plot">${movieID.Plot}</p>
                                </div>
                            </div>
                            <div class="divider"></div>
                        </div>
                        `;
                    })
            });
        })
});