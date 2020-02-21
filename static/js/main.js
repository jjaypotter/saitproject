function init() {

const canadaLocations = [
  {
    name:     'Maligne Lake',
    location: 'Maligne Lake',
    imgURL: 'static/pics/maligne_lake.jpg',
    extURL: 'https://en.wikipedia.org/wiki/Jordan'
  },
  {
    name:     'Marine Lake',
    location: 'Marine Lake',
    imgURL:  'static/pics/marine_lake.jpg',
    extURL: 'https://en.wikipedia.org/wiki/China'
  },
  {
    name:     'Northern Light',
    location: 'Northern Light',
    imgURL: 'static/pics/northern_light.png',
    extURL: 'https://simple.wikipedia.org/wiki/Canada'
  },
  {
    name:     'Peyto Lake',
    location: 'Peyto Lake',
    imgURL: 'static/pics/peyto_lake.jpg',
    extURL: 'https://en.wikipedia.org/wiki/United_States'
  },
  {
    name:     'Radium Hot Spring',
    location: 'Radium Hot Spring',
    imgURL: 'static/pics/radium_hotspring.png',
    extURL: 'https://en.wikipedia.org/wiki/United_States'
  },
  {
    name:     'Valhalla Lake',
    location: 'Valhalla Lake',
    imgURL: 'static/pics/valhalla_lake.jpg',
    extURL: 'https://en.wikipedia.org/wiki/United_States'
  },
  {
    name:     'Waterton Lake',
    location: 'Waterton Lake',
    imgURL: 'static/pics/waterton_lake.jpeg',
    extURL: 'https://en.wikipedia.org/wiki/United_States'
  }
]

let content = '';
canadaLocations.forEach(function(canadaLocations){
content +=  `<article>
              <h3>${canadaLocations.location}</h3>
              <a href="${canadaLocations.extURL}" target="_blank"><img width="400" height="320" 
              src="${canadaLocations.imgURL}" alt="beautiful picture of: ${canadaLocations.name}"></a>
              <br>
              </article>`;
});

const main = document.querySelector('main');
main.innerHTML = content;

}


init()


