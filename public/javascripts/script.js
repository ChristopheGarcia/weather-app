function initMap() {
  var uluru = {lat: 48.86, lng: 2.35};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: uluru
  });

   var cityLat = document.getElementsByClassName("city-lat");
   for(var i=0; i<document.getElementsByClassName("city-lon").length; i++ ){

     var marker = new google.maps.Marker({
       position: {lat: parseFloat(cityLat[i].value), lng: parseFloat(document.getElementsByClassName("city-lon")[i].value)},
       map: map
     });
   }


  var input = document.getElementById('city');
  var options = {
    types: ['geocode']
  };
  autocomplete = new google.maps.places.Autocomplete(input, options);

}
