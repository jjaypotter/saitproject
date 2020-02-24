// set below function to execute when page is loaded
function init() {

// define a array, store all available items into this array
const canadaLocations = [
  {
    name:     'Maligne Lake',
    location: 'Maligne Lake',
    imgURL: 'static/pics/maligne_lake.jpg',
    extURL: 'https://www.banffjaspercollection.com/attractions/maligne-lake-cruise/'
  },
  {
    name:     'Marine Lake',
    location: 'Marine Lake',
    imgURL:  'static/pics/marine_lake.jpg',
    extURL: 'https://en.wikipedia.org/wiki/Moraine_Lake'
  },
  {
    name:     'Northern Light',
    location: 'Northern Light',
    imgURL: 'static/pics/northern_light.png',
    extURL: 'https://www.aurorawatch.ca/'
  },
  {
    name:     'Peyto Lake',
    location: 'Peyto Lake',
    imgURL: 'static/pics/peyto_lake.jpg',
    extURL: 'https://en.wikipedia.org/wiki/Peyto_Lake'
  },
  {
    name:     'Radium Hot Spring',
    location: 'Radium Hot Spring',
    imgURL: 'static/pics/radium_hotspring.png',
    extURL: 'https://www.radiumhotsprings.com/'
  },
  {
    name:     'Valhalla Lake',
    location: 'Valhalla Lake',
    imgURL: 'static/pics/valhalla_lake.jpg',
    extURL: 'http://www.env.gov.bc.ca/bcparks/explore/parkpgs/valhalla/'
  },
  {
    name:     'Waterton Lake',
    location: 'Waterton Lake',
    imgURL: 'static/pics/waterton_lake.jpeg',
    extURL: 'https://www.pc.gc.ca/en/pn-np/ab/waterton/'
  }
]

// define a empty container
let content = '';
// loop through the array and add content into the empty container
canadaLocations.forEach(function(canadaLocations){
content +=  `<article>
              <h3>${canadaLocations.location}</h3>
              <a href="${canadaLocations.extURL}" target="_blank"><img width="400" height="320" 
              src="${canadaLocations.imgURL}" alt="beautiful picture of: ${canadaLocations.name}"></a>
              <br>
              </article>`;
});

// set the main element as an object, change the innerHTML arttribute of the object to be the content
const main = document.querySelector('main');
main.innerHTML = content;

}

// call the init function
init()


