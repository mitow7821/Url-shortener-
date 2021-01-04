let storageData = JSON.parse(localStorage.getItem("links")) || [];

const createOutputDiv = (url, short) => {
  const target = document.querySelector(".shortlinks");
  if (target.childElementCount > 3) {
    target.lastElementChild.remove();
  }
  const root = document.createElement("div");
  root.classList.add("link");
  const baseUrl = document.createElement("p");
  baseUrl.innerHTML = url;
  const child = document.createElement("div");
  const shortUrl = document.createElement("p");
  shortUrl.innerHTML = short;
  const button = document.createElement("button");
  button.classList.add("copy-btn");
  button.innerHTML = "Copy";
  child.appendChild(shortUrl);
  child.appendChild(button);
  root.appendChild(baseUrl);
  root.appendChild(child);
  target.prepend(root);
};

storageData.forEach((el) => {
  createOutputDiv(el[0], el[1]);
});

const copyFunction = (val) => {
  const el = document.createElement("textarea");
  el.value = val;
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const copyExecute = () => {
  let buttons = document.querySelectorAll(".copy-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      //Reset button placeholder
      buttons.forEach((button) => {
        button.classList.remove("copied");
        button.innerHTML = "Copy";
      });
      //Change styles when copied
      button.classList.add("copied");
      button.innerHTML = "Copied!";
      const shortedLink = button.previousElementSibling.innerHTML;
      copyFunction(shortedLink);
    });
  });
};
copyExecute();

//Url shortening process
const action = () => {
  const input = document.querySelector("input");
  const link = input.value;
  const api = `https://api.shrtco.de/v2/shorten?url=${link}`;

  //Reset things
  const errorMsg = document.querySelector(".error-msg");
  errorMsg.innerHTML = "";
  errorMsg.style.display = "none";
  let shortLink = null;
  let error = null;
  input.classList.remove("error");

  const displayError = (err) => {
    input.classList.add("error");
    errorMsg.innerHTML = err;
    errorMsg.style.display = "block";
  };

  const addDataToStorage = (data) => {
    if (storageData.length < 4) {
      storageData.push(data);
      localStorage.setItem("links", JSON.stringify(storageData));
    } else {
      storageData.shift();
      storageData.push(data);
      localStorage.setItem("links", JSON.stringify(storageData));
    }
  };

  //Form handling
  if (link) {
    let loader = document.querySelector(".loader");
    loader.style.display = "block";
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        loader.style.display = "none";
        if (data.ok) {
          //Everything is OK
          shortLink = data.result.short_link;
          const linkArray = [link, shortLink];
          addDataToStorage(linkArray);
          createOutputDiv(link, shortLink);
          copyExecute();
          input.value = "";
        } else {
          //Bad url
          error = data.error.split(",")[0] + "!";
          console.log(error);
          displayError(error);
        }
      });
  } else {
    //Empty input
    error = "Please add a link!";
    displayError(error);
  }
};

const menuBtn = document.querySelector(".btn");
const mobileMenu = document.querySelector(".mobileMenu");
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");

  if (mobileMenu.style.opacity == 1) {
    mobileMenu.style.opacity = 0;
    mobileMenu.style.pointerEvents = "none";
  } else {
    mobileMenu.style.opacity = 1;
    mobileMenu.style.pointerEvents = "unset";
  }
});
