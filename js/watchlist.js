let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
const movieList = document.getElementById("movie-list");

if (watchlist.length) {
    movieList.innerHTML = watchlist.map(renderMovieCard).join("");
    movieList.style.justifyContent = "flex-start";
} else {
    movieList.innerHTML = `
        <p class="default-text">Your watchlist is looking a little empty...</p>
        <p class="add-movies"><img class="add-icon" src="./icons/add-icon.png" >Let's add some movies</p>
    `;
    movieList.style.justifyContent = "center";
}

movieList.addEventListener("click", (e) => {
    const target = e.target.closest(".add-to-watchlist");
    if (!target) return;

    const imdbID = target.dataset.id;
    const wrapper = target.closest(".movie-wrapper");

    let updatedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    updatedWatchlist = updatedWatchlist.filter (w => w.imdbID !== imdbID);

    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));

    wrapper.remove();

    if(!updatedWatchlist.length) {
        movieList.innerHTML = `
            <p class="default-text">Your watchlist is looking a little empty...</p>
            <p class="add-movies"><img class="add-icon" src="./icons/add-icon.png" >Let's add some movies</p>
        `;
        movieList.style.justifyContent = "center";
    }
});

function renderMovieCard(movie) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const isInWatchlist = watchlist.some(w => w.imdbID === movie.imdbID);

    const iconSrc = isInWatchlist ? "./icons/minus-icon.png" : "./icons/add-icon.png";
    const iconAlt = isInWatchlist ? "Add to Watchlist" : "Added to Watchlist";

    return `
        <div class="movie-wrapper">
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