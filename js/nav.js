"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".nav-links-middle").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//submit new post
function navSubmitClick(){
  hidePageComponents();
  $allStoriesList.show();
  $submitStory.show();
}
  $navSubmitStory.on("click", navSubmitClick);

//listen for and show favorites
function navFavoritesClick() {
  hidePageComponents();
  addFavoritesToPage();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

//listen for and show my posts

function navMyPostsClick() {
  hidePageComponents();
  addUserStories();
  $ownStories.show();
}

$body.on("click", "#nav-my-posts", navMyPostsClick);
