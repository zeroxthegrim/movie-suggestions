const apiKey = "f0f47a8d3cd3b331a223452679fbd344";


let discoverReq = `https://api.themoviedb.org/3/discover/movie?api_key=f0f47a8d3cd3b331a223452679fbd344&language=en-US&sort_by=popularity.desc`;


const interstellar = 157336;
const interstellarPosterPath = "/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg";

// /discover/movie?sort_by=popularity.desc


const getDirectors = async (crew) => {
    let directors = [];
    let directorNames = [];

    crew.forEach(item => {
        if (item.job === "Director") {
            directors.push(item.id);
        }
    });

    for (let i = 0; i < directors.length; i++) {
        let directorNameData = await fetch(`https://api.themoviedb.org/3/person/${directors[i]}?api_key=f0f47a8d3cd3b331a223452679fbd344&language=en-US`);
        let directorName = await directorNameData.json();
        directorNames.push(directorName.name);
    }
    
    return directorNames;
};


const getActors = async (cast) => {
    let numOfActors = 4;
    let actors = [];

    if (cast.length < 4) {
        numOfActors = cast.length
    }

    for (let i = 0; i < numOfActors; i++) {
        let actorData = await fetch(`https://api.themoviedb.org/3/person/${cast[i].id}?api_key=f0f47a8d3cd3b331a223452679fbd344&language=en-US`);
        let actor = await actorData.json();
        
        actors.push(actor.name);
    }

    return actors;
};

const getPoster = async (posterUrl) => {
    const baseUrl = "https://image.tmdb.org/t/p/w500";

    const response = await fetch(baseUrl + posterUrl);
    return response.url;
};


const getMovieDetails = async (id) => {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=f0f47a8d3cd3b331a223452679fbd344&append_to_response=credits`);
    let data = await response.json();

    return data;
};


const getRandomMovie = async (discoverReq) => {
    // we are doing the first fetch to get the number of total pages available in the response object
    let firstResponse = await fetch(discoverReq + `&pages=1`);
    let firstData = await firstResponse.json();

    let movieArr = [];
    let flattenArr = [];

    // this will limit max number of pages that we will request to 20
    let pagesToReq = 15;
    if (pagesToReq > firstData.total_pages) {
        pagesToReq = firstData.total_pages;
    }

    // pushing the first page into the arr
    movieArr.push(firstData.results);

    // for loop that will request 20 pages or less if there are less than 20 for the requested object
    for (let i = 2; i <= pagesToReq; i++) {
        let currentResponse = await fetch(discoverReq + `&page=${i}`);
        let currentData = await currentResponse.json();

        movieArr.push(currentData.results);
    }

    // flattening the movieArr array
    for (let i = 0; i < movieArr.length; i++) {
        for (let j = 0; j < movieArr[i].length; j++) {
            flattenArr.push(movieArr[i][j]);
        }
    }

    // returning random movie
    return flattenArr[Math.floor(Math.random() * flattenArr.length)];
};
