"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const DEFAULTNOIMAGE = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

//function that takes term , variable grabs the array of shows, use map to iterate
//over the array of shows

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const showsFromAPI = await axios.get("https://api.tvmaze.com/search/shows", {
    params: { q: term },
  });
  const mappedShows = showsFromAPI.data.map(function (val) {
    let imageURL;
    imageURL = (val.show.image===null ? DEFAULTNOIMAGE : val.show.image.original )

    const showObj = {
      id: val.show.id,
      name: val.show.name,
      summary: val.show.summary,
      image: imageURL,
    };

    return showObj;
  });

  console.log(mappedShows, "mapped shows");
  return mappedShows;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="image for ${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  console.log("getshowsbyterm", getShowsByTerm(term));
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);

}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

 async function getEpisodesOfShow(id) {

  let showById = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  console.log("showbyid",  showById)
  let mappedEpisodes = showById.data.map(function (val){
    const episodeObj = {
      "id" : val.id,
      "name": val.name,
      "season": val.season,
      "number": val.number
    }
    return episodeObj;

  })
  return mappedEpisodes;
  //let mapEpisodes = showById

  }

  /**on click button for episodes reveal and append */
  $('#showsList').on('click', '.Show-getEpisodes',  getEpisodesAndDisplay)

  /** takes array of episodes info, updates dom episodesList */
function populateEpisodes(episodes) {

  for(let episode of episodes){
    $('#episodesList').append(`<li>${episode}</li>`);

  }
//append to id #episodesList section in DOM
//reveal id #episodesArea in DOM, currently hidden with display: none, change to block?
}

/**calling populateEpisodes getEpisodesOfShow functions */
async function getEpisodesAndDisplay(evt){
  let evtId = $('.Show-getEpisodes').closest(".show").data(".data-show-id")

  //calling populateEpisodes and getEpisodesOfShow funcs

  let episodeArr = await getEpisodesOfShow(evtId)
  console.log("episodeArr=", episodeArr)
  populateEpisodes(episodeArr)
  //let currentEpisodes = getEpisodesOfShow()
 }
