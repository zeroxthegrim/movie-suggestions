const form = document.querySelector("form");
const img1 = document.querySelector(".poster img");

let request = `https://api.themoviedb.org/3/discover/movie?api_key=f0f47a8d3cd3b331a223452679fbd344&language=en-US&sort_by=popularity.desc`;


const getMovieInfo = async () => {

};

form.addEventListener("submit", (e) => {
    e.preventDefault();

    getRandomMovie(request).then(data => {
        return getPoster(data.poster_path)
    }).then(data => img1.setAttribute("src", data)).catch(err => console.log(err));

});