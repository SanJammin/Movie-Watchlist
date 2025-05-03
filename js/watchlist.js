const movieList = document.getElementById("movie-list");
const ICONS = {
    add: "./icons/add-icon.png",
    minus: "./icons/minus-icon.png",
    star: "./icons/star-icon.png"
};

const watchlist = getWatchlist();
updateWatchlistUI(watchlist);

movieList.addEventListener("click", (e) => {
    const target = e.target.closest(".add-to-watchlist");
    if (!target) return;

    const imdbID = target.dataset.id;
    const wrapper = target.closest(".movie-wrapper");

    let updatedWatchlist = getWatchlist();

    updatedWatchlist = updatedWatchlist.filter (w => w.imdbID !== imdbID);

    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));

    wrapper.remove();

    updateWatchlistUI(updatedWatchlist);
});

function renderMovieCard(movie, watchlist = []) {
    const isInWatchlist = watchlist.some(w => w.imdbID === movie.imdbID);

    const iconSrc = isInWatchlist ? ICONS.minus : ICONS.add;
    const iconAlt = isInWatchlist ? "Add to Watchlist" : "Added to Watchlist";

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
                            <p class="add-watchlist">Remove item</p>
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

function renderEmptyState() {
    return `
        <p class="default-text">Your watchlist is looking a little empty...</p>
        <p class="add-movies"><img class="add-icon" src="${ICONS.add}" >Let's add some movies</p>
    `;
}

function updateWatchlistUI(updatedList) {
    if (updatedList.length) {
        movieList.innerHTML = updatedList.map(movie => renderMovieCard(movie, updatedList)).join("");
        movieList.style.justifyContent = "flex-start";
    } else {
        movieList.innerHTML = renderEmptyState();
        movieList.style.justifyContent = "center";
    }
}

function getWatchlist() {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
};