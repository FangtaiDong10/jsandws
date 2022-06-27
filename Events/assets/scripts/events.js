const button = document.querySelector("button");
// button.onclick = () => {};

const buttonClickHandler = (event) => {
  //   event.target.disabled = true
  console.log(event);
};

const another = (event) => {
  console.log(event);
};

// button.onclick = buttonClickHandler;
// button.onclick = another;

const boundFn = buttonClickHandler.bind(this);
// recommended (add Event listener)
// button.addEventListener("click", buttonClickHandler);

// setTimeout(() => {
//   button.removeEventListener("click", buttonClickHandler);
// }, 2000);
// can remove a listener

// buttons.forEach((btn) => {
//   btn.addEventListener("mouseenter", buttonClickHandler);
// });

// window.addEventListener("scroll", (event) => {
//   console.log(event);
// });

// basic infinite scrolling
// let curElementNumber = 0;

// function scrollHandler() {
//   const distanceToBottom = document.body.getBoundingClientRect().bottom; // get the distance of bottom line of body element and to the bottom

//   if (distanceToBottom < document.documentElement.clientHeight + 150) {
//     const newDataElement = document.createElement("div");
//     curElementNumber++;
//     newDataElement.innerHTML = `<p>Element ${curElementNumber}</p>`;
//     document.body.append(newDataElement);
//   }
// }

// window.addEventListener("scroll", scrollHandler);

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event);
});

const div = document.querySelector("div");
div.addEventListener(
  "click",
  (event) => {
    console.log("clicki div");

    console.log(event);
  }
  //   true
);

button.addEventListener("click", (event) => {
  event.stopImmediatePropagation();
  event.stopPropagation();
  console.log("click button");
  console.log(event);
});

const listItems = document.querySelectorAll("li");
const list = document.querySelector("ul");
// listItems.forEach((listItem) => {
//   listItem.addEventListener("click", (event) => {
//     event.target.classList.toggle("highlight");
//   });
// });
list.addEventListener("click", (event) => {
  // console.log(event.currentTarget); (here is 'ul')
  // event.target.classList.toggle("highlight");
  event.target.closest("li").classList.toggle("highlight");
});


