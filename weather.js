const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

localStorage.setItem(
  "apikey",
  EncryptStringAES("4d8fb5b93d4af21d66a2948710284366")
);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherDataFromApi();
});

const getWeatherDataFromApi = async () => {
  let apikey = DecryptStringAES(localStorage.getItem("apikey"));
  // console.log("encrypted", localStorage.getItem("apikey"));
  // console.log("decrypted", apikey);
  let cityName = input.value;
  let weatherType = "metric";

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}&units=${weatherType}`;

  try {
    const response = await axios(url);

    //****** OBJECT DESTRUCTURING */

    const { main, name, sys, weather } = response.data;
    console.log(response.data);

    // ********* CITY CARD CONTROL ***************

    let cityListItems = list.querySelectorAll(".city");
    //! let cityListItems2 = document.getElementsByClassName("city");
    //! [...cityListItems2].forEach(element=>{})

    let cityListItemArray = Array.from(cityListItems);
    if (cityListItemArray.length > 0) {
      let filteredArray = cityListItemArray.filter(
        (card) => card.querySelector(".city-name span").innerText == name
      );
      if (filteredArray.length > 0) {
        msg.innerText = `You already know the weather for ${name}, please search for another city 😉`;
        form.reset();
        input.focus();
        return;
      }
    }

    // ******** CREATING CARD ELEMENT ***************

    const createdCityCardLi = document.createElement("li");
    createdCityCardLi.classList.add("city");
    let iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png `;
    createdCityCardLi.innerHTML = `
    <h2 class="city-name" data-name="${name}, ${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
        <img class="city-icon" src="${iconUrl}">
        <figcaption>${weather[0].description}</figcaption>
    </figure>`;

    //********* APPEND VS. PREPEND ************
    list.prepend(createdCityCardLi);
    form.reset();
    input.focus();
  } catch (error) {
    // postErrorLog("page", "getAPIData", error);
    // postErrorLog("weather", "getWeatherDataFormApi", error);
    msg.innerText = error;
  }
};
