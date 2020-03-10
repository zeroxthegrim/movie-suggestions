const form = document.querySelector("form");
const img = document.querySelector(".poster img");
const directorsDisplay = document.querySelector(".directors");
const actorsDisplay = document.querySelector(".actors");
const title = document.querySelector(".title");
const year = document.querySelector(".year");
const overview = document.querySelector(".overview");
const rating = document.querySelector(".rating");
const genre = document.querySelector("#select-genre");
const decade = document.querySelector("#select-decade");
const genresSection = document.querySelector(".genres")
const submitBtn = document.querySelector(".submit-btn button");
const infoDiv = document.querySelector(".info");
const placeholderImgSrc = "img/no-poster.png";
const runtime = document.querySelector(".runtime");
const releaseDate = document.querySelector(".release-date");
const budget = document.querySelector(".budget");
const container = document.querySelector(".container");

const genreCodes = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

const updateGenres = (genres) => {
    let genreIdArr = genres.map(x => x["id"]);
    let genreNamesArr = genreIdArr.map(x => genreCodes[x]);

    genresSection.textContent = genreNamesArr.join(", ");
};


const userScoreUpdate = (score) => {
    let ctx = document.getElementById("my-canvas").getContext("2d");
    let al = 0;
    let start = 4.72;
    let cw = ctx.canvas.width;
    let ch = ctx.canvas.height;
    let diff;

    ctx.font = "14px sans-serif";

    const proba = 10;

    console.log(ctx);


    let sim = setInterval(() => {
    diff = ((al / 100) * Math.PI * 2 * 10).toFixed(2);
    ctx.clearRect(0, 0, cw, ch);
    ctx.lineWidth = 6;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "#09F";
    ctx.fillText((al / 10).toFixed(1) , cw * 0.358, ch * .5 + 4, cw);
    ctx.beginPath();
    ctx.arc(30, 30, 26, start, diff / 10 + start, false);
    ctx.stroke();
    if (al >= score * 10) {
        clearTimeout(sim);
    }
    al++;

    }, 7);
};



const generateQuery = (decade, genre) => {
    const base = "https://api.themoviedb.org/3/discover/movie?api_key=f0f47a8d3cd3b331a223452679fbd344&language=en-US";
    const decadeQuery = generateDecadeQuery(decade);
    const genreQuery = `with_genres=${genre}`;

    const query = `${base}&${genreQuery}&${decadeQuery}&vote_average.gte=6&sort_by=popularity.desc`;

    console.log(query);
    return query;
};


const generateDecadeQuery = (value) => {
    let decadeQuery = null;
    
    switch (value) {
        case "1950s":
            decadeQuery = "primary_release_date.gte=1950-01-01&primary_release_date.lte=1959-12-31";
            break;
        case "1960s":
            decadeQuery = "primary_release_date.gte=1960-01-01&primary_release_date.lte=1969-12-31";
            break;
        case "1970s":
            decadeQuery = "primary_release_date.gte=1970-01-01&primary_release_date.lte=1979-12-31";
            break;
        case "1980s":
            decadeQuery = "primary_release_date.gte=1980-01-01&primary_release_date.lte=1989-12-31";
            break;
        case "1990s":
            decadeQuery = "primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31";
            break;
        case "2000s":
            decadeQuery = "primary_release_date.gte=2000-01-01&primary_release_date.lte=2009-12-31";
            break;
        case "2010s":
            decadeQuery = "primary_release_date.gte=2010-01-01&primary_release_date.lte=2019-12-31";
            break;
        case "2020s":
            decadeQuery = "primary_release_date.gte=2020-01-01&primary_release_date.lte=2029-12-31";
            break;
        case "":
            decadeQuery = "";
    }

    return decadeQuery;
};

const updateUI = (info) => {
    const { randomMovie, movieDetails, directors, actors, poster } = info;

    console.log(movieDetails);
    title.innerHTML = `
        <h1>${movieDetails.title}<span class="year"> (${movieDetails.release_date.slice(0, 4)})</span></h1>
    `;
    
    if (poster == null) {
        img.setAttribute("src", placeholderImgSrc);
    } else {
        img.setAttribute("src", poster);
    }
    
    
    actorsDisplay.textContent = actors.join(", ");
    
    directorsDisplay.textContent = directors.join(", ");
    
    overview.innerHTML = `
        <p>${movieDetails.overview}</p>
    `;
    

    runtime.textContent = ` ${movieDetails.runtime} minutes`;
    releaseDate.textContent = ` ${movieDetails.release_date}`;

    if (movieDetails.budget == 0) {
        budget.textContent = ` N/A`;
    } else {
        budget.textContent = ` $${(movieDetails.budget).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }
    
    
    updateGenres(movieDetails.genres);
    userScoreUpdate(movieDetails.vote_average);


    container.classList.add("extra-bottom-padding");
    submitBtn.textContent = "Suggest Me a Movie";
    submitBtn.classList.toggle("no-click");

    if (infoDiv.classList.contains("no-display")) {
        infoDiv.classList.remove("no-display");
    }
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

    submitBtn.classList.toggle("no-click")
    submitBtn.textContent = "Searching...";

    getMovieInfo(generateQuery(decade.value, genre.value))
        .then(data => updateUI(data))
        .catch(err => console.log(err));
});


