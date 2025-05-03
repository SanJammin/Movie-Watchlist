const searchMovie = document.getElementById("search-movie");
const searchBtn = document.getElementById("search-btn");
const movieList = document.getElementById("movie-list");
const ICONS = {
    add: "./icons/add-icon.png",
    minus: "./icons/minus-icon.png",
    star: "./icons/star-icon.png"
};

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    movieList.innerHTML = ``;
    fetch(`http://www.omdbapi.com/?apikey=ba1b48&s=${searchMovie.value}`)
        .then(res => res.json())
        .then(searchResults => {
            if (!searchResults.Search) {
                movieList.innerHTML = `<p class="no-results">No results found</p>`;
                return;
            }

            const moviePromises = searchResults.Search.map(movie => getMovieById(movie.imdbID));

            Promise.all(moviePromises).then(fullMovieData => {
                const watchlist = getWatchlist();
                movieList.innerHTML = fullMovieData.map(movie => renderMovieCard(movie, watchlist)).join("");
            });
        });
});

movieList.addEventListener("click", (e) => {
    const target = e.target.closest(".add-to-watchlist");
    if (!target) return;

    const imdbID = target.dataset.id;
    const icon = target.querySelector(".add-icon");

    getMovieById(imdbID).then(movie => {
        let watchlist = getWatchlist();
        const isInWatchlist = watchlist.some(w => w.imdbID === imdbID);

        if (isInWatchlist) {
            watchlist = watchlist.filter(w => w.imdbID !== imdbID);
            localStorage.setItem("watchlist", JSON.stringify(watchlist));

            icon.src = ICONS.add;
            icon.alt = "Add to Watchlist";
        } else {
            watchlist.push(movie);
            localStorage.setItem("watchlist", JSON.stringify(watchlist));

            icon.src = ICONS.minus;
            icon.alt = "Added to Watchlist";
        }
    });
});

function getMovieById(id) {
    return fetch(`http://www.omdbapi.com/?apikey=ba1b48&i=${id}`)
        .then(res => res.json());
};

function renderMovieCard(movie, watchlist = []) {
    const isInWatchlist = watchlist.some(w => w.imdbID === movie.imdbID);

    const iconSrc = isInWatchlist ? ICONS.minus : ICONS.add;
    const iconAlt = isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist";
    const watchlistText = isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"

    return `
        <div class="movie-wrapper">
            <div class="movie-card">
                <img src=${movie.Poster} alt="Poster of ${movie.Title}" class="movie-poster">
                <div class="movie-details">
                    <div class="title-and-rating">
                        <h2 class="movie-title">${movie.Title}</h2>
                        <img class="star-rating" src="${ICONS.star}" alt="A Star">
                        <p class="movie-rating">${movie.imdbRating}</p>
                    </div>
                    <div class="runtime-genre-add">
                        <p class="runtime">${movie.Runtime}</p>
                        <p class="genre">${movie.Genre}</p>
                        <div class="add-to-watchlist" data-id="${movie.imdbID}" role="button" tabindex="0" aria-label="Add to watchlist">
                            <img class="add-icon" src="${iconSrc}" alt="${iconAlt}">
                            <p class="add-watchlist">${watchlistText}</p>
                        </div>
                    </div>
                    <div class="plot">
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>
            </div>
            <div class="divider"></div>
        </div>
    `;
};

function getWatchlist() {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
};