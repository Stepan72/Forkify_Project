import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

let controlRecipes = async function () {
  try {
    let id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;

    /// 0.1) Render spinner
    recipeView.renderSpinner();

    // 0.2) Update results view to highlighted selected search results
    resultsView.update(model.getSearchResultsPage());
    // 0.3) Update bookmarks View
    bookmarksView.update(model.state.bookmarks);
    /// 1) Loading recipe
    await model.loadRecipe(id);

    //2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError(`${err} 🔥🔥🔥`);
  }
};

let controlSearchResults = async function () {
  try {
    /// 0)Render Spinner
    resultsView.renderSpinner();
    ///1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load search results
    await model.loadSearchResults(query);
    // 3) Render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results); // без pagination
    resultsView.render(model.getSearchResultsPage()); // with pagination

    // 4) Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  /// Update recipe servings (in state)
  model.updateServings(newServings);
  /// Update the recipe view - rerender
  // recipeView.render(model.state.recipe); // обновление всего результата
  recipeView.update(model.state.recipe); // обновление только элемента servings
};

const controlAddBookmark = function () {
  // console.log(model.state.recipe.bookmarked);
  if (!model.state.recipe.bookmarked) {
    /// 1a)Highlight recipe as bookmarked
    model.addBookmark(model.state.recipe);
  }
  /// 1b)Highlight recipe as NOT bookmarked
  else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // console.log(model.state.recipe);
  /// 2)Update UI to see bookmarked class
  recipeView.update(model.state.recipe);
  /// 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
  //
};

const controlBookmarks = function () {
  // For imidiate load of local stored bookmarks from localStorage
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    /// Upload new Recipe Data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    /// render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();
    /// bookmark render
    bookmarksView.render(model.state.bookmarks);
    /// Change ID in URL  - трюк с добавлением URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`⭐ ${err}`);
    addRecipeView.renderError(err);
  }
};
/// start init function
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHanlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
///

// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// ); // на два ивента посадили функцию
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

//// My Practice Others

// let init = async function () {
//   try {
//     return new Promise(function (resolve, reject) {
//       resolve(`It's Okay`);
//       reject(`There is problem`);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
// init().then(res => console.log(res));

// let checkAsyncFun = async function () {
//   try {
//     console.log(`I'm working!`);
//     let res = await fetch('https://jsonplaceholder.typicode.com/users');
//     let data = await res.json();
//     console.log(data);
//   } catch (err) {
//     console.error(err);
//   }
// };

// document
//   .querySelector('.header__logo')
//   .addEventListener('click', checkAsyncFun);

// window.history.back(); - команда возвращения страницы назад
