const form = document.querySelector("form");
const img = document.querySelector(".poster img");
const directorsDisplay = document.querySelector(".directors");
const actorsDisplay = document.querySelector(".actors");
const title = document.querySelector(".title");
const year = document.querySelector(".year");
const overview = document.querySelector(".overview");
const rating = document.querySelector(".rating");




const updateUI = (info) => {
    const { randomMovie, movieDetails, directors, actors, poster } = info;

    console.log(movieDetails);
    title.innerHTML = `
        <h1>${movieDetails.title}<span class="year"> (${movieDetails.release_date.slice(0, 4)})</span></h1>
    `;
    img.setAttribute("src", poster);
    actorsDisplay.textContent = actors.join(", ");
    directorsDisplay.textContent = directors.join(", ");
    overview.innerHTML = `
        <p>Plot: ${movieDetails.overview}</p>
    `;
    rating.textContent =`------------------${movieDetails.vote_average}-----------------`;

}


const getMovieInfo = async (request) => {
    const randomMovie = await getRandomMovie(request);
    const movieDetails = await getMovieDetails(randomMovie.id);
    const directors = await getDirectors(movieDetails.credits.crew);
    const actors = await getActors(movieDetails.credits.cast);
    const poster = await getPoster(movieDetails.poster_path);

    let totalInfo = { randomMovie, movieDetails, directors, actors, poster };

    return totalInfo;

};

form.addEventListener("submit", (e) => {
    e.preventDefault();


    getMovieInfo(discoverReq)
        .then(data => updateUI(data))
        .catch(err => console.log(err));
});
