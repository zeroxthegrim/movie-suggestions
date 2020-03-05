const apiKey = "f0f47a8d3cd3b331a223452679fbd344";
const img = document.querySelector(".poster img");

let discoverReq = `https://api.themoviedb.org/3/discover/movie?api_key=f0f47a8d3cd3b331a223452679fbd344&language=en-US&sort_by=popularity.desc`;

const interstellar = 157336;
const interstellarPosterPath = "/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg";

// /discover/movie?sort_by=popularity.desc


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
    console.log(movieArr)
          
    console.log(pagesToReq);

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

    console.log(flattenArr.length);
    
    // returning random movie
    return flattenArr[Math.floor(Math.random() * flattenArr.length)];
};

// getRandomMovie(discoverReq)
//     .then(data => console.log(data))
//     .catch(err => console.log(err));



// getMovieDetails(157336)
//     .then(data => console.log(data))
//     .catch(err => console.log(err));

getRandomMovie(discoverReq).then(data => {
    return getPoster(data.poster_path);
}).then(data => img.setAttribute("src", data)).catch(err => console.log(err)); 