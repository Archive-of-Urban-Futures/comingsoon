
//TODO (svouse): clean up onload
function onload() {
// Get the modal
var modal = document.getElementById("myModal");

// Read the JSON
var data = '[{  "title": "War on the Poor",  "location": "Oakland",  "date": "March 12, 1966",  "tags": "#blackhistory, #oakland, #blackactivism"}, {  "title": "HOLC “redlining” map of the East Bay",  "location": "East Bay",  "tags": "#redlining, #blackhistory, #bayarea"}, {  "title": "Area Description for section of Emeryville, CA",  "location": "Emeryville",  "date": "June 15, 1937",  "tags": "#blackhistory, #oakland, #blackactivism"}, {  "title": "Area Description for section of Oakland, CA.",  "location": "Oakland",  "date": "June 15, 1937",  "tags": "#blackhistory, #oakland, #blackactivism"}, {  "title": "The Power and Peril of Eminent Domain",  "location": "Oakland",  "date": "2023",  "tags": "#blackhistory, #eminentdomain, #displacement, #dispossession, #urbanrenewal"}, {  "title": "Urban cowboy - Black Joy Parade",  "location": "Oakland",  "date": "2022",  "tags": "#blackfutures, #blackjoy"}, {  "title": "The “Hyphy Rail,” by Azlinah Tambu",  "location": "Oakland",  "date": "2023",  "tags": "#gentrification, #blackfutures, #dispossession, #displacement, #oakland, #transportation"}, {  "title": "“Slay” - Black Joy Parade",  "location": "Oakland",  "date": "2022",  "tags": "#blackjoy, #blackfutures"}, {  "title": "Guns but not Milk",  "location": "Oakland",  "date": "2022",  "tags": "#blackhistory, #Oakland"}, {  "title": "Flyer for the “Manifesting a Future of Black Oakland” workshop",  "location": "Oakland",  "date": "2022",  "tags": "#blackfutures, #gentrification, #capitalism"}, {  "title": "Still from interview with Azlinah Tambu of Moms 4 Housing",  "location": "Oakland",  "date": "2022",  "tags": "#housingjustice, #housingisahumanright"}]';

var jsonData = JSON.parse(data);

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementsByClassName("myImg");
var modalImg = document.getElementById("img01");
var titleText = document.getElementById("title_text");
var locationText = document.getElementById("location_tag");
var dateText = document.getElementById("date_tag");
var captionText = document.getElementById("caption");
var tagText = document.getElementById("tag");

// Get the modal arrows
var frontArrow = document.getElementById("frontArrow");
var backArrow = document.getElementById("backArrow");

//set modal content 
for (i = 0; i < img.length; i++) { 
  var onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    var data= this.alt.split("|");
    titleText.innerHTML = data[0];
    locationText.innerHTML = data[1];
    dateText.innerHTML = data[2];
    captionText.innerHTML = data[3];
    tagText.innerHTML = data[4].split(",")[0];
  }

  img[i].onclick = onclick;
}

/*
//set modal arrow destinations
for (i = 0; i < img.length; i++) { 
  //if image is first, back arrow wraps
  if(i == 0) {
    backArrow.onclick = function(){img[img.length-1].click()};
    frontArrow.onclick = function(){img[i+1].click()};
  }
  //if image is last, front arrow wraps
  else if(i == img.length -1) {
    backArrow.onclick = function(){img[i-1].click()};
    frontArrow.onclick = function(){img[i+1].click()};
  }
   else {
    backArrow.onclick = function(){img[i-1].click()};
    frontArrow.onclick = function(){img[i+1].click()};
  }
}*/


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}
} 