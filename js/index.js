const searchMovie = document.getElementById("search-movie");
const searchBtn = document.getElementById("search-btn");
const movieList = document.getElementById("movie-list")

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    movieList.innerHTML = ``;
    fetch(`http://www.omdbapi.com/?apikey=ba1b48&s=${searchMovie.value}`)
        .then(res => res.json())
        .then(searchResults => {
            if (!searchResults.Search) {
                movieList.innerHTML = `<p>No results found</p>`;
                return;
            }

            const moviePromises = searchResults.Search.map(movie => getMovieById(movie.imdbID));

            Promise.all(moviePromises).then(fullMovieData => {
                movieList.innerHTML = fullMovieData.map(renderMovieCard).join("");
            });
        });
});

movieList.addEventListener("click", (e) => {
    const target = e.target.closest(".add-to-watchlist");
    if (!target) return;

    const imdbID = target.dataset.id;
    const icon = target.querySelector(".add-icon");

    getMovieById(imdbID).then(movie => {
        let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        const isInWatchlist = watchlist.some(w => w.imdbID === imdbID);

        if (isInWatchlist) {
            watchlist = watchlist.filter(w => w.imdbID !== imdbID);
            localStorage.setItem("watchlist", JSON.stringify(watchlist));

            icon.src = "./icons/add-icon.png";
            icon.alt = "Add to Watchlist";
        } else {
            watchlist.push(movie);
            localStorage.setItem("watchlist", JSON.stringify(watchlist));

            icon.src = "./icons/minus-icon.png";
            icon.alt = "Added to Watchlist";
        }
    });
});

function getMovieById(id) {
    return fetch(`http://www.omdbapi.com/?apikey=ba1b48&i=${id}`)
        .then(res => res.json());
}

function renderMovieCard(movie) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const isInWatchlist = watchlist.some(w => w.imdbID === movie.imdbID);

    const iconSrc = isInWatchlist ? "./icons/minus-icon.png" : "./icons/add-icon.png";
    const iconAlt = isInWatchlist ? "Add to Watchlist" : "Added to Watchlist";

    return `
        <div class="movie-card">
            <img src=${movie.Poster} alt="Poster of ${movie.Title}" class="movie-poster">
            <div class="movie-details">
                <div class="title-and-rating">
                    <h2 class="movie-title">${movie.Title}</h2>
                    <img class="star-rating" src="./icons/star-icon.png" alt="A Star">
                    <p class="movie-rating">${movie.imdbRating}</p>
                </div>
                <div class="runtime-genre-add">
                    <p class="runtime">${movie.Runtime}</p>
                    <p class="genre">${movie.Genre}</p>
                    <div class="add-to-watchlist" data-id="${movie.imdbID}">
                        <img class="add-icon" src=${iconSrc} alt=${iconAlt}">
                        <p class="add-watchlist">Watchlist</p>
                    </div>
                </div>
                <div class="plot">
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    `;
};