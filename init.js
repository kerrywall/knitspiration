// let's go!
var knitApp = {};

knitApp.publicKey = '23865d8e5ea5c9362f46b8df928ea7eb';
var query = "";

knitApp.init = function() {
	$('#searchy').on('submit', function(e) {
		// don't reload the page when the form is submitted
		e.preventDefault();
		// change the query variable's value to whatever the user submitted
		query = $('#userValue').val();
		// run getPhotos() using the user query
		knitApp.getPhotos(query);
	});
} 

knitApp.getPhotos = function() {
	
	$.ajax({
		url: 'https://api.flickr.com/services/rest/?jsoncallback=?',
		method: 'GET',
		data: {
			method: 'flickr.photos.search',
			api_key: knitApp.publicKey,
			// search tags for "knitting" but not other stuff we don't want
			tags: 'knitting, -factory, -crochet, -pattern, -doll, -penis, -swastika, ' + query,
			// (unless tag_mode is set to 'all,' flickr looks for 'any')
			tag_mode: 'all',
			// sort by 'interestingness' in descending order: most "interesting" first
			sort: 'interesting_desc',
			// public photos only
			privacy_filter: 1,
			// let's try to keep this clean (ALTHOUGH all that unfortunate knitted gentalia is apparently rated 'safe' by Flickr, so we have to remove certain terms in the tags parameter)
			safe_search: 1,
			// we don't need no xml
			format: 'json'
		},
		dataType: 'jsonp',
		success: function(result){
			// clear out the inspiration div
			$('#inspiration').empty();
			// run displayPhotos(), adding a photo to the inspiration div
			knitApp.displayPhotos(result.photos.photo);
		}
	});
}

knitApp.displayPhotos = function(data) {

	// check to see whether there are results from that search
	if (data.length !== 0) {

		// run this code if the results contain more than one photo
		if (data.length > 1) {
			
			// generate a random number and use it to pick a random photo from the results object
			var photoID = Math.floor(Math.random() * data.length);
			
		// run *this* code if there's only one result
		} else if (data.length === 1) {
			
			// the ID of the lone photo in the zero-based index system will be '0,' so...
			var photoID = 0;
		}

		var thisPhoto = data[photoID];
		var thisPhotoTitle = thisPhoto.title;

		// use data from the results to create components to be injected into the page
			var img = $('<img>').attr('src', 'https://farm'+ thisPhoto.farm + '.staticflickr.com/' + thisPhoto.server + '/' + thisPhoto.id + '_' + thisPhoto.secret + '.jpg').addClass('photo'); /* image url */
		
			var titleSearch = thisPhotoTitle.slice(" "); /* search string without commas */
		
			var titleLink = $('<a>').attr({'href':'https://www.google.ca/search?q=' + titleSearch + ' site:ravelry.com', 'target': '_blank'}).text('Try a Ravelry search using that text?').addClass('patternLink'); /* <a> tag search query */

			var searchText = 'Want to know more? Well, the original poster called this photo "' + thisPhotoTitle + '." '; /* search query context */

			// components for a link back to the photo page, as required by the API TOS
			var photoPage = 'https://www.flickr.com/photos/' + thisPhoto.owner + '/' + thisPhoto.id;
			var linkToFlickr = '(See the photo on Flickr.)';
			var linkToFlickrText = $('<a>').text(linkToFlickr).attr({'href': photoPage, 'target':'_blank'}).addClass('onFlickr');
			var titleLinkString = $('<p>').text(searchText).append(titleLink);

		// show a different response message if the user didn't submit a query
		if (query !== "") {
			var resultText = $('<h3>').text('You asked for "' + query + '." Flickr rummaged around and found:');
		} else {
			var resultText = $('<h3>').text('You didn\'t submit a search term, but Flickr was a real good sport and found:');
		}

		// we need to run a separate APi call with a separate Flickr method to get the image sizes
		$.ajax({
			url: 'https://api.flickr.com/services/rest/?jsoncallback=?',
			method: 'GET',
			data: {
				method: 'flickr.photos.getSizes',
				api_key: knitApp.publicKey,
				photo_id: thisPhoto.id,
				format: 'json'
			},
			dataType: 'jsonp',
			success: function(size) {
				//extract the biggest image from the array and pass it to the zoom method
				knitApp.zoom(size.sizes.size.pop());
			}
		});

		// run a test to see whether the poster actually gave the image a filename (or just left the camera default)

		// (check it, Drew, I added some regex)
		var pName = /([P])\d+/;
		var numberName = /\d+/;

		if (thisPhoto.title.indexOf('IMG') === 0 || thisPhoto.title.indexOf('DSC') === 0 || thisPhoto.title.indexOf('img') === 0 || pName.exec(thisPhoto.title) !== null || thisPhoto.title.indexOf(numberName) === 0) {

			// if not, and it's a generic camera-bestowed filename, skip the Ravelry search link because it's useless
			$('.inspiration').append(resultText,img,linkToFlickrText);

		} else {
			// if so, put all the data above into the page, even the Ravelry search link
			$('.inspiration').append(resultText,img,linkToFlickrText,titleLinkString);
		}

		$('.searchyText').text("Search again?");

	// if there are no results for this query...
	} else {

		// ... tell the user that and have them try again
		$('.inspiration').html('<h3>Oops.</h3><p>Your search for <strong>"' + query + '"</strong> didn\'t yield any results. Try something else?');
	}		
}

knitApp.zoom = function(img) {
	$('.photo').wrap('<a id="zoom" href=' + img.source + '></a>');
	$('#zoom').loupe({
	  width: 400, // width of magnifier
	  height: 400, // height of magnifier
	  loupe: 'loupe' // css class for magnifier
	});
}

// run the app init() method when the page is loaded

$(function(){
	knitApp.init();
});