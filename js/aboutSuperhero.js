// getting the required elements for DOM manipulation
let info = document.getElementById('info-container');

// getting the superHeroInfo data from localstorage
let superHeroInfo = JSON.parse(localStorage.getItem("superHeroInfo"));

// according to the superhero updating the page navbar heading
let title = document.getElementById('update-title');
title.innerHTML = "Superhero: "+superHeroInfo.name;

window.addEventListener("load", function () {
     //getting the favouriteSuperHeroesIDs data from localstorage also handling null check
     let favouriteSuperHeroesIDs = localStorage.getItem("favouriteSuperHeroesIDs");
     if (favouriteSuperHeroesIDs == null) {
          favouriteSuperHeroesIDs = new Map();
     } else if (favouriteSuperHeroesIDs != null) {
          favouriteSuperHeroesIDs = new Map(JSON.parse(localStorage.getItem("favouriteSuperHeroesIDs")));
     }

     // updating the DOM with the superHeroInfo data
     info.innerHTML =`
                         <div class="superhero-name">${superHeroInfo.name}</div>
                         <div class="superhero-info">
                              <img id="portraitImage" class="hero-img" src="${superHeroInfo.portraitImage}" alt="">
                              <img style="display:none;" id="landscapeImage" src="${superHeroInfo.landscapeImage}" alt="">
                              <div class="more-info">
                                   <div class="id">
                                        <b>ID: </b><span>${superHeroInfo.id}</span>
                                   </div>
                                   <div class="comics">
                                        <b>Comics: </b><span>${superHeroInfo.comics}</span>
                                   </div>
                                   <div class="series">
                                        <b>Series: </b><span>${superHeroInfo.series}</span>
                                   </div>
                                   <div class="stories">
                                        <b>Stories: </b><span>${superHeroInfo.stories}</span>
                                   </div>
                              </div>
                         </div>
                         <div class="discription">
                              <b>Discription:</b>
                              <p>${superHeroInfo.description != "" ? superHeroInfo.description : "No Description Available"}</p>
                         </div>
                         <div style="display:none;">
                              <span>${superHeroInfo.name}</span>
                              <span>${superHeroInfo.portraitImage}</span>
                              <span>${superHeroInfo.landscapeImage}</span>
                              <span>${superHeroInfo.id}</span>
                              <span>${superHeroInfo.comics}</span>
                              <span>${superHeroInfo.series}</span>
                              <span>${superHeroInfo.stories}</span>
                              <span>${superHeroInfo.squareImage}</span>
                              <span>${superHeroInfo.description}</span>
                         </div>
                         <button class="add-remove-fav-btn" id="${superHeroInfo.id}">${favouriteSuperHeroesIDs.has(`${superHeroInfo.id}`) ? "Remove from Favourites" : "Add to Favourites</button>"}
                    `
     // for showing the required add/remove button
     addEvent();
})
// adding eventlistener to the add/remove button
function addEvent() {
     let favouriteButton = document.querySelector('.add-remove-fav-btn');
     favouriteButton.addEventListener("click", addAndRemoveFavouriteSuperheros);
}
// addAndRemoveFavouriteSuperheros() to add/remove the particular superhero to favourite list
function addAndRemoveFavouriteSuperheros() {

     //if Add to Favourites button clicked
     if (this.innerHTML == 'Add to Favourites') {
          let superHeroInfo = {
               name: this.parentElement.children[3].children[0].innerHTML,
               description: this.parentElement.children[3].children[8].innerHTML,
               comics: this.parentElement.children[3].children[4].innerHTML,
               series: this.parentElement.children[3].children[5].innerHTML,
               stories: this.parentElement.children[3].children[6].innerHTML,
               portraitImage: this.parentElement.children[3].children[1].innerHTML,
               id: this.parentElement.children[3].children[3].innerHTML,
               landscapeImage: this.parentElement.children[3].children[2].innerHTML,
               squareImage: this.parentElement.children[3].children[7].innerHTML
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
          let idOfSuperheroesToBeRemoveFromFavourites = this.parentElement.children[3].children[3].innerHTML;

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
