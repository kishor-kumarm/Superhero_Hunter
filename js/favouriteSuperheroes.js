// getting the required elements for DOM manipulation
let cardContainer = document.getElementById('fav-superheros-container');

// addEventListener executed when page loads
window.addEventListener("load", function () {
     // getting the favouriteCharacters array from the localStorage also handling null check
     let favourites = localStorage.getItem("favouriteCharacters"); 
     if (favourites == null) {
          cardContainer.innerHTML = "<p style=\"font-size: 40px;\">No Favourites Superheros has been added yet!</p>"
          return;
     } else {
          favourites = JSON.parse(this.localStorage.getItem("favouriteCharacters"));
          if(favourites.length == 0){
               cardContainer.innerHTML = "<p style=\"font-size: 40px;\">No Favourites Superheros has been added yet!</p>"
               return;
          }
     }
     cardContainer.innerHTML = "";
     // updating the DOM with the favouriteCharacters cards which is being as list of favourite superheroes list
     favourites.forEach(character => {
          cardContainer.innerHTML +=`<div class="card">
                                             <img src="${character.squareImage}" alt="">
                                             <span class="name" style="display:none;">${character.name}</span>
                                             <span class="id" style="display:none;">Id : ${character.id}</span>
                                             <span class="comics" style="display:none;">Comics : ${character.comics}</span>
                                             <span class="series" style="display:none;">Series : ${character.series}</span>
                                             <span class="stories" style="display:none;">Stories : ${character.stories}</span>
                                             <a class="character-info" href="../view/aboutSuperhero.html">
                                                  <h4 class="card-title"><strong>${character.name}</strong></h4>
                                             </a>
                                             <div style="display:none;">
                                                  <span>${character.id}</span>
                                                  <span>${character.name}</span>
                                                  <span>${character.comics}</span>
                                                  <span>${character.series}</span>
                                                  <span>${character.stories}</span>
                                                  <span>${character.description}</span>
                                                  <span>${character.landscapeImage}</span>
                                                  <span>${character.portraitImage}</span>
                                                  <span>${character.squareImage}</span>
                                             </div>
                                             <button class="btn remove-btn">Remove from Favourites</button>
                                        </div>`

     })
     //for adding about and remove from favourite button. 
     addEvent();
})

// Function for attacthing eventListener to buttons
function addEvent() {
     let removeBtn = document.querySelectorAll(".remove-btn");
     removeBtn.forEach((btn) => btn.addEventListener("click", removeCharacterFromFavourites))

     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage));
}
// removeCharacterFromFavourites() to remove a particular superhero to favourite list
function removeCharacterFromFavourites() {

     // getting the required superhero id from Dom, which needs to be removed from favourite.
     let idOfCharacterToBeDeleted = this.parentElement.children[2].innerHTML.substring(5);

     // Also getting the data from local storage and remove the favourite characters data.
     let favourites = JSON.parse(localStorage.getItem("favouriteCharacters"));
     let favouriteSuperHeroesIDs = new Map(JSON.parse(localStorage.getItem("favouriteSuperHeroesIDs")));
     favouriteSuperHeroesIDs.delete(`${idOfCharacterToBeDeleted}`);
     favourites.forEach(function (favourite, index) {
          if (favourite.id == idOfCharacterToBeDeleted) {
               favourites.splice(index, 1);
          }
     });

     // showing message if there is not cards left in favourite page
     if (favourites.length == 0) {
          cardContainer.innerHTML = "<p style=\"font-size: 40px;\">No Favourites Superheros has been added yet!</p>";
     }

     // Now updating the localStorage data
     localStorage.setItem("favouriteCharacters", JSON.stringify(favourites));
     localStorage.setItem("favouriteSuperHeroesIDs", JSON.stringify([...favouriteSuperHeroesIDs]));

     // then need to remove the element from DOM
     this.parentElement.remove();
     // showing the "Removed from favourites" popup for 1 second
     document.querySelector(".removed-notification").setAttribute("data-visiblity", "show");
     setTimeout(function () {
          document.querySelector(".removed-notification").setAttribute("data-visiblity", "hide");
     }, 1000);
}
// addInfoInLocalStorage() used to store the superhero information to local which is fectched and been shown in about page.
function addInfoInLocalStorage() {
     let superHeroInfo = {
          name: this.parentElement.children[7].children[1].innerHTML,
          description: this.parentElement.children[7].children[5].innerHTML,
          comics: this.parentElement.children[7].children[2].innerHTML,
          series: this.parentElement.children[7].children[3].innerHTML,
          stories: this.parentElement.children[7].children[4].innerHTML,
          portraitImage: this.parentElement.children[7].children[7].innerHTML,
          id: this.parentElement.children[7].children[0].innerHTML,
          landscapeImage: this.parentElement.children[7].children[6].innerHTML,
          squareImage:this.parentElement.children[7].children[8].innerHTML
     }
     localStorage.setItem("superHeroInfo", JSON.stringify(superHeroInfo));
}
