import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

///////////////////////////////////////
if (module.hot) module.hot.accept();

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(
      `We could not find that recipe. Please try another one!`,
    );
  }
}

async function controlSearchResults() {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    // resultsView.render(model.state.search.results );
    resultsView.render(model.getSearchResultsPage());

    //Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {}
}

function controlPagination(goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render initial pagination buttons
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
}

function init() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}
init();
