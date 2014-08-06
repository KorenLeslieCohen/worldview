$(function () {


  var nyc = "new york",
      london = "london",
      beijing = "beijing",
      sydney = "sydney",
      paris = "paris france";

  $(".clock img").click(function() {
    $('#flickr').empty();
    var location = $(this).closest(".clock").data('city');
    switch (location){
      case 'nyc':
        search = nyc;
        break;
      case 'london':
        search = london;
        break;
      case 'beijing':
        search = beijing;
        break;
      case 'sydney':
        search = sydney;
        break;
      case 'paris':
        search = paris;
        break;
    };
  
  var URL = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + search + "&sort=interestingness-desc";

    $.ajax({
        url: URL,
        data: {},
        dataType: "jsonp",
        jsonp: 'jsoncallback',
        success: function (response) {
          // console.log(response);
            for (var i=0; i < 10; i++){  
              var result = response.items[i];
              var title = result.title
              var image = result.media.m;
              var link = result.link
              $('#flickr').append("<div><h3>" + "<a href='" + link + "'>" + title + "</h3><p>" + "<img src=" + image + "></p></div>");
            }
            
        },
        error: function (response) {
            console.log("error");
            // console.log(response);
        }

    });
 });

});

