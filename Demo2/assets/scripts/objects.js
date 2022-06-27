const addMovieBtn = document.getElementById("add-movie-btn");
const searchBtn = document.getElementById("search-btn");

// using for storing the movie object
const movies = [];

const renderMovies = (filter = "") => {
  const movieList = document.getElementById("movie-list");

  if (movies.length === 0) {
    movieList.classList.remove("visible");
    return;
  } else {
    movieList.classList.add("visible");
  }
  // the inner HTML clearance can also happen after this if check
  movieList.innerHTML = "";

  // filter takes a function which executes on every element in that array.
  const filteredMovies = !filter
    ? movies
    : movies.filter((movie) => movie.info.title.includes(filter));

  filteredMovies.forEach((movie) => {
    // with an HTML tag with li
    const movieEl = document.createElement("li");
    let text = movie.info.title + " - ";
    for (const key in movie.info) {
      if (key !== "title") {
        // dynamically access the value for the property which we don't know in advance.
        text = text + `${key} : ${movie.info[key]}`;
      }
    }
    movieEl.textContent = text;
    movieList.append(movieEl);
  });
};

const addMovieHandler = () => {
  // get all the users input and add them to my movies.
  const title = document.getElementById("title").value;
  const extraName = document.getElementById("extra-name").value;
  const extraValue = document.getElementById("extra-value").value;

  if (
    title.trim() === "" ||
    extraName.trim() === "" ||
    extraValue.trim() === ""
  ) {
    return;
  }

  // construct new movie
  const newMovie = {
    info: {
      title,
      [extraName]: extraValue,
    },
    id: Math.random(),
  };

  movies.push(newMovie);
  // console.log(movies);
  renderMovies();
};

const serachMovieHandler = () => {
  const filterTerm = document.getElementById("filter-title").value;
  renderMovies(filterTerm);
};

addMovieBtn.addEventListener("click", addMovieHandler);
searchBtn.addEventListener("click", serachMovieHandler);
