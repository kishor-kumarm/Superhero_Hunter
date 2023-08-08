//Created variables from the DOM elements 
let searchBar = document.getElementById("search-bar");
let superheroesList = document.getElementById("superhero-list");

//Default showing some superhero list on page load
window.onload = async function () {
     searchSuperHeroes("A");
};

// EventListener for the Search bar
searchBar.addEventListener("input", () => searchSuperHeroes(searchBar.value));
// Search superheroes functions as per the search query 
async function searchSuperHeroes(inputText) {
     let PUBLIC_KEY = "ed06e97e978d177fcd9b9707867e6f5f";
     let PRIVATE_KEY = "81d83d4c2abc137dbe55c0771c5b3f892c9d8229";
     let ts = new Date().getTime();
     let hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();

     // Fetching the data by calling the marvels API then converts to JSON format then sending the output to HTML
     await fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${inputText}&apikey=ed06e97e978d177fcd9b9707867e6f5f&hash=${hash}&ts=${ts}`)
          .then(res => res.json()) 
          .then(data => showSuperHeroesCards(data.data.results));
}

//showSuperHeroesCards function is to display seached superheroes in the DOM which is taking args[] via fetch API.
function showSuperHeroesCards(searchedSuperheroes) {
     //favouriteSuperHeroesIDs for getting the existing added favourite heros from localstorage to show add/remove favourite button wtih the cards.
     let favouriteSuperHeroesIDs = localStorage.getItem("favouriteSuperHeroesIDs");
     if (favouriteSuperHeroesIDs == null) {
          favouriteSuperHeroesIDs = new Map();
     }
     else if (favouriteSuperHeroesIDs != null) {
          // If the we got the favouriteSuperHeroesIDs in localStorage then parsing it and converting it to map
          favouriteSuperHeroesIDs = new Map(JSON.parse(localStorage.getItem("favouriteSuperHeroesIDs")));
     }
     // Now update the DOM for each card
     superheroesList.innerHTML = ``;
     let cardsCount = 0; //limiting the cards show count to 20
     for (const key in searchedSuperheroes) {
          if (cardsCount < 20) {
               let hero = searchedSuperheroes[key];
               // Appending the card to the DOM
               superheroesList.innerHTML +=`<div class="card">
                                             <img class="card-img" src="${hero.thumbnail.path + '/portrait_medium.' + hero.thumbnail.extension}" alt="Image">
                                             <div class="card-img-more">
                                                  <a class="character-info" href="./view/aboutSuperhero.html">
                                                       <h4 class="card-title"><strong>${hero.name}</strong></h4>
                                                  </a>
                                                  <p class="card-fav-btn"> 
                                                       <button class="addfav_buttons add-remove-fav-btn" id="${hero.id}">${favouriteSuperHeroesIDs.has(`${hero.id}`) ? "Remove from Favourites" : "Add to Favourites</button>"}
                                                  </p>
                                             </div>
                                             <div style="display:none;" id="div${hero.id}">
                                             <span>${hero.name}</span>
                                             <span>${hero.description}</span>
                                             <span>${hero.comics.available}</span>
                                             <span>${hero.series.available}</span>
                                             <span>${hero.stories.available}</span>
                                             <span>${hero.thumbnail.path + '/portrait_uncanny.' + hero.thumbnail.extension}</span>
                                             <span>${hero.id}</span>
                                             <span>${hero.thumbnail.path + '/landscape_incredible.' + hero.thumbnail.extension}</span>
                                             <span>${hero.thumbnail.path + '/standard_fantastic.' + hero.thumbnail.extension}</span> 
                                        </div>`
          }
          cardsCount++;
     }
     events();
}

// showSuperHeroesCards function calling events() to add buttons add/remove and more about hero 
function events() {
     // this is for more about superheros click link
     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage));
     //this is for add/remove fav button.
     let favouriteButton = document.querySelectorAll(".add-remove-fav-btn");
     favouriteButton.forEach((btn) => btn.addEventListener("click", addAndRemoveFavouriteSuperheros));
}

// addAndRemoveFavouriteSuperheros() to add/remove the particular superhero to favourite list
function addAndRemoveFavouriteSuperheros() {
     //if Add to Favourites button clicked
     if (this.innerHTML == 'Add to Favourites') {
          let superHeroInfo = {
               name: this.parentElement.parentElement.parentElement.children[1].children[0].innerText,
               description: this.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
               comics: this.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
               series: this.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
               stories: this.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
               portraitImage: this.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
               id: this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
               landscapeImage: this.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
               squareImage: this.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
          }
          //getting favouriteCharacters from local storage also handling the null check
          let favouritesArray = localStorage.getItem("favouriteCharacters");
          if (favouritesArray == null) {
               favouritesArray = [];
          } else {
               favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          }
          //getting favouriteSuperHeroesIDs from local storage also handling the null check
          let favouriteSuperHeroesIDs = localStorage.getItem("favouriteSuperHeroesIDs");
          if (favouriteSuperHeroesIDs == null) {
               favouriteSuperHeroesIDs = new Map();
          } else {
               favouriteSuperHeroesIDs = new Map(JSON.parse(localStorage.getItem("favouriteSuperHeroesIDs")));
          }

          // update the just added favouriteSuperHeroesID and superHeroInfo array elements to local storage
          favouriteSuperHeroesIDs.set(superHeroInfo.id, true);
          favouritesArray.push(superHeroInfo);
          localStorage.setItem("favouriteSuperHeroesIDs", JSON.stringify([...favouriteSuperHeroesIDs])); //array of array
          localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray)); //array of object

          // update innerhtml button text from "Add to Favourites"  to "Remove from Favourites"
          this.innerHTML = 'Remove from Favourites';

          // showing the "Added to Favourites" popup for 1 second
          document.querySelector(".added-notification").setAttribute("data-visiblity", "show");
          setTimeout(function () {
               document.querySelector(".added-notification").setAttribute("data-visiblity", "hide");
          }, 1000);
     }
     //if Remove from Favourites button clicked then remove it from favourite list
     else {

          // getting the superhero id from dom which needs to be removed
          let idOfSuperheroesToBeRemoveFromFavourites = this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML;
          //also getting local storage cards and then remove and update the storage
          let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          let favouriteSuperHeroesIDs = new Map(JSON.parse(localStorage.getItem("favouriteSuperHeroesIDs")));
          let newFavouritesArray = [];
          favouriteSuperHeroesIDs.delete(`${idOfSuperheroesToBeRemoveFromFavourites}`);
          favouritesArray.forEach((favourite) => {
               if (idOfSuperheroesToBeRemoveFromFavourites != favourite.id) {
                    newFavouritesArray.push(favourite);
               }
          });
          // update the just removed favouriteSuperHeroesID and superHeroInfo array elements from local storage
          localStorage.setItem("favouriteCharacters", JSON.stringify(newFavouritesArray));
          localStorage.setItem("favouriteSuperHeroesIDs", JSON.stringify([...favouriteSuperHeroesIDs]));

          // update innerhtml button text from "Remove from Favourites" button to "Add to Favourites" 
          this.innerHTML = 'Add to Favourites';

          // showing the "Remove from Favourites" popup for 1 sec.
          document.querySelector(".removed-notification").setAttribute("data-visiblity", "show");
          setTimeout(function () {
               document.querySelector(".removed-notification").setAttribute("data-visiblity", "hide");
          }, 1000);
     }
}

// addInfoInLocalStorage() used to store the superhero information to local which is fectched and been shown in about page.
function addInfoInLocalStorage() {
     let superHeroInfo = {
          name: this.parentElement.parentElement.children[2].children[0].innerHTML,
          description: this.parentElement.parentElement.children[2].children[1].innerHTML,
          comics: this.parentElement.parentElement.children[2].children[2].innerHTML,
          series:this.parentElement.parentElement.children[2].children[3].innerHTML,
          stories: this.parentElement.parentElement.children[2].children[4].innerHTML,
          portraitImage: this.parentElement.parentElement.children[2].children[5].innerHTML,
          id: this.parentElement.parentElement.children[2].children[6].innerHTML,
          landscapeImage: this.parentElement.parentElement.children[2].children[7].innerHTML,
          squareImage: this.parentElement.parentElement.children[2].children[8].innerHTML
     }

     localStorage.setItem("superHeroInfo", JSON.stringify(superHeroInfo));
}
