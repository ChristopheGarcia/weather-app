function initMap() {
  const uluru = {lat: 48.86, lng: 2.35};
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: uluru
  });

   const cityLat = document.getElementsByClassName("city-lat");
   const cityLon = document.getElementsByClassName("city-lon");
   for(let i=0; i<cityLon.length; i++ ){

     let marker = new google.maps.Marker({
       position: {lat: parseFloat(cityLat[i].value), lng: parseFloat(cityLon[i].value)},
       map: map
     });
   }


  const input = document.getElementById('city');
  const options = {
    types: ['geocode']
  };
  autocomplete = new google.maps.places.Autocomplete(input, options);

}
