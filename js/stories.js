"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

// function generateStoryMarkup(story) {
//   // console.debug("generateStoryMarkup", story);

//   const hostName = story.getHostName();
//   return $(`
//       <li id="${story.storyId}">
//         <a href="${story.url}" target="a_blank" class="story-link">
//           ${story.title}
//         </a>
//         <small class="story-hostname">(${hostName})</small>
//         <small class="story-author">by ${story.author}</small>
//         <small class="story-user">posted by ${story.username}</small>
//       </li>
//     `);
// }

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = addIcons(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


async function submitNewPost(evt){
  evt.preventDefault();

  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username
  const storyData = {title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = addIcons(story);
  $allStoriesList.prepend($story);

  $submitStory.slideUp("slow");
  $submitStory.trigger("reset");
}

$submitStory.on("submit", submitNewPost);

//delete user posts and update DOM
async function deletePost(evt) {

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

 await storyList.deleteStory(currentUser, storyId);
 addUserStories();
}

$ownStories.on("click", ".trash", deletePost);


//favorite button

function createFavorite(story, user) {
  const favorite = user.favorite(story);
  const liked = favorite ? "fas" : "far";
  return `
      <span class="heart">
      <i class="${liked} fa-heart" style="color: #ee00ff;"></i>
      </span>`;
}

//remove button

function createTrash(){
  return `<span class="trash"> 
  <i class="fas fa-trash"></i>
  </span>`
};

//add trash/heart icons to stories
function addIcons(story, showTrash = false) {

  const hostName = story.getHostName();
  const showFav = !!currentUser;

  return $(`
      <li id="${story.storyId}">
        ${showTrash ? createTrash() : ""}
        ${showFav ? createFavorite(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//create user's posts and add them to the DOM
function addUserStories() {

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories here!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = addIcons(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

//add favorites to favorites list
function addFavoritesToPage() {

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = addIcons(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}
//toggle favorite on/off
async function toggleStoryFavorite(evt) {

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}
$threeAmigos.on("click", ".heart", toggleStoryFavorite);