const addMovieModal = document.getElementById("add-modal");
// const addMovieModal = document.querySelector("#add-modal");
// const addMovieModal = document.body.children[1];
const startAddMovieButton = document.querySelector("header button");
// const startAddMovieButton = document.querySelector("header").lastElementChild;
const backdrop = document.getElementById("backdrop");
// document.body.firstElementChild;
const cancelAddMovieButton = addMovieModal.querySelector(".btn--passive");
const confirmAddMovieButton = cancelAddMovieButton.nextElementSibling;

const userInputs = addMovieModal.querySelectorAll("input"); //--> array-like object (NodeList)
// const userInputs = addMovieModal.getElementsByTagName("input"); // --> (Collections)
const entryTextSection = document.getElementById("entry-text");
const deleteMovieModal = document.getElementById("delete-modal");

// can be used to create ID
console.log(new Date().toISOString());

// want to add objects to this array. --> while each object represent a movie.
const movies = [];

// update user interface
const updateUI = () => {
  if (movies.length === 0) {
    entryTextSection.style.display = "block";
  } else {
    entryTextSection.style.display = "none";
  }
};

//
const deleteMovieHandler = (movieId) => {
  let movieIndex = 0;
  for (const movie of movies) {
    if (movie.id === movieId) {
      break;
    }
    movieIndex++;
  }
  movies.splice(movieIndex, 1);

  // Updating the DOM !
  const rootList = document.getElementById("movie-list");
  rootList.children[movieIndex].remove();
  // rootList.removeChild(rootList.children[movieIndex]);
  closeMovieDeletionModal();
  updateUI();
};

const closeMovieDeletionModal = () => {
  toggleBackDrop();
  deleteMovieModal.classList.remove("visible");
};

const startDeleteMovieHandler = (movieId) => {
  deleteMovieModal.classList.add("visible");
  toggleBackDrop();
  //   deleteMovie(movieId);
  const cancelDeletionButton = deleteMovieModal.querySelector(".btn--passive"); // cancel button
  let confirmDeletionButton = deleteMovieModal.querySelector(".btn--danger"); // yes button

  // !!! Becareful HERE --> need to clear the reference listener for selected DOM object
  cancelDeletionButton.removeEventListener("click", closeMovieDeletionModal);
  // !!! Replace DOM old button with a new button (deep copy), then get this new button again.
  confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));
  confirmDeletionButton = deleteMovieModal.querySelector(".btn--danger");

  cancelDeletionButton.addEventListener("click", closeMovieDeletionModal);
  confirmDeletionButton.addEventListener(
    "click",
    deleteMovieHandler.bind(null, movieId)
  );
};

// Render the movie element to the page
const renderNewMovieElement = (id, title, imageUrl, rating) => {
  const newMovieElement = document.createElement("li");
  newMovieElement.className = "movie-element";
  newMovieElement.innerHTML = `
    <div class="movie-element__image">
      <img src="${imageUrl}" alt="${title}">
    </div>
    <div class="movie-element__info">
      <h2>${title}</h2>
      <p>${rating}/5 stars</p>
    </div>  
  `;

  // Handle the deleteMovieHandler --> when click the movie card
  newMovieElement.addEventListener(
    "click",
    startDeleteMovieHandler.bind(null, id)
  );

  // locating to the DOM ul in the <main> part
  const listRoot = document.getElementById("movie-list");
  listRoot.append(newMovieElement);
};

const toggleBackDrop = () => {
  backdrop.classList.toggle("visible");
};

const closeMovieModal = () => {
  addMovieModal.classList.remove("visible");
};

const showMovieModal = () => {
  //   addMovieModal.className = "modal card";
  addMovieModal.classList.add("visible"); // this will always keep all other classes on the element but add or remove this class based on its current state,
  toggleBackDrop();
}; // function

const cancelAddMovieHandler = () => {
  closeMovieModal();
  toggleBackDrop();
  clearMovieInput();
};

const clearMovieInput = () => {
  for (const userInput of userInputs) {
    userInput.value = "";
  }
};

const addMovieHandler = () => {
  //   console.log(userInputs);
  const titleValue = userInputs[0].value;
  const imageUrlValue = userInputs[1].value;
  const ratingValue = userInputs[2].value;
  // check
  if (
    titleValue.trim() === "" ||
    imageUrlValue.trim() === "" ||
    ratingValue.trim() === "" ||
    +ratingValue < 1 ||
    +ratingValue > 5
  ) {
    alert("Please enter valid values (rating between 1 and 5)");
    return;
  }

  const newMovie = {
    id: Math.random().toString(),
    title: titleValue,
    image: imageUrlValue,
    rating: ratingValue,
  };

  movies.push(newMovie);
  console.log(movies);

  closeMovieModal();
  toggleBackDrop();

  clearMovieInput();
  renderNewMovieElement(
    newMovie.id,
    newMovie.title,
    newMovie.image,
    newMovie.rating
  );
  updateUI();
};

const backdropClickHandler = () => {
  //   close BackDrop
  closeMovieModal();
  closeMovieDeletionModal();
  clearMovieInput();
};

startAddMovieButton.addEventListener("click", showMovieModal);
backdrop.addEventListener("click", backdropClickHandler);
cancelAddMovieButton.addEventListener("click", cancelAddMovieHandler);
confirmAddMovieButton.addEventListener("click", addMovieHandler);
