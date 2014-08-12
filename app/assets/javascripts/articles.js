var pickedArticles = []; //used by article pooler
function article (passedCity1) {

        $('.news-header').show();
        $('#news1').empty();
        $('#news2').empty();

        var search;
        var country;
        var cityName = passedCity1.name.toLowerCase();
        var biggerthing = passedCity1.bigger_thing;
        switch (cityName) {
            case 'new york city':
                search = "new+york+city";
                country = "\"New%20York%20City\""
                break;
            case 'london':
                search = "london";
                country = "\"London (England)\""
                break;
            case 'hong kong international':
                search = "hong+kong"; 
                country = "\"CHINA\"";
                break;
            default:
                search = cityName;
                country = biggerthing;
            
        };

        var today = new Date();
        var past = today.setDate(today.getDate()-15);
        var pastDate = new Date(past);
        var dd = pastDate.getDate();
        var mm = pastDate.getMonth() + 1; //January is 0 so this will be a month behind
        var yyyy = pastDate.getFullYear();

        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 
        
        past_month = yyyy+mm+dd;
        
        var API_KEY = "dd74b110c07677ce3e0c5c1f94642e26:10:31738630";
        var URL = "http://api.nytimes.com/svc/search/v2/articlesearch.jsonp?callback=svc_search_v2_articlesearch&q=" + search + "&sort=newest&begin_date="+past_month+"&fq=type_of_material:(News)%20AND%20glocations:("+country+")&api-key=" + API_KEY;
       

        $.ajax({
            url: URL,
            data: {},
            dataType: "jsonp",
            jsonpCallback: 'svc_search_v2_articlesearch',
            success: function (response) {
                pickedArticles = []; //reset this glob var so it doesnt have articles from other cities
                var numberOfArticles = response.response.docs.length;
                console.log("Initially found this many articles " + numberOfArticles);
                articlePooler(response);
                
               if (numberOfArticles < 10){ //FIRST <10 IF
                    
                    // pickedArticles[pickedArticles.length] = 
                    URL = "http://api.nytimes.com/svc/search/v2/articlesearch.jsonp?callback=svc_search_v2_articlesearch&q=" + search + "%20" + country + "&sort=newest&begin_date="+past_month+"&fq=type_of_material:(News)&api-key=" + API_KEY;
                    console.log("finding more articles by removing geoloc and searching city + bigthing in query.");

                    $.ajax({
                        url: URL,
                        data: {},
                        dataType: "jsonp",
                        jsonpCallback: 'svc_search_v2_articlesearch',
                        success: function (response) {
                            numberOfArticles = response.response.docs.length;
                            console.log("On 2nd search found this many articles " + numberOfArticles);
                            totArt = articlePooler(response);
                            if (totArt < 10){ //BEGIN 2ND <5 IF
                                
                                URL = "http://api.nytimes.com/svc/search/v2/articlesearch.jsonp?callback=svc_search_v2_articlesearch&q="+country+"&sort=newest&begin_date="+past_month+"&fq=type_of_material:(News)&api-key=" + API_KEY;
                                // URL = "http://api.nytimes.com/svc/search/v2/articlesearch.jsonp?callback=svc_search_v2_articlesearch&q="+country+"&sort=newest&begin_date="+past_month+"&fq=type_of_material:(News)%20AND%20glocations:("+country+")&api-key=" + API_KEY;   q=countyr and geoloc = country


                                console.log("finding more articles by searching only country as query");
                                $.ajax({
                                    url: URL,
                                    data: {},
                                    dataType: "jsonp",
                                    jsonpCallback: 'svc_search_v2_articlesearch',
                                    success: function (response) {
                                        numberOfArticles = response.response.docs.length;
                                        console.log("On 3nd search found this many articles " + numberOfArticles);
                                        articlePooler(response,true);
                                    },
                                     error: function (response) {
                                        console.log("News ajax query failed.");
                                    }
                                });
                            } else {//end 2nd <5 if
                                // articlePooler(response);
                            }
                        },
                        error: function (response) {
                         console.log("News ajax query failed.");
                        }
                    });
                } else { //end if articles < 5

                    // articlePooler(response);
               }

            },
            error: function (response) {
                console.log("News ajax query failed.");
            }
        });
   
}


function articlePooler(response, fire){ //collect articles until there are at least 10. Passed most geo specific articles first 
    var numberOfArticles = response.response.docs.length;
    var flagDup;
    console.log("Pooler passed " + numberOfArticles + " articles");
    for (var i = 0; i < numberOfArticles; i++) {
        flagDup = false;
        for (b = 0; b < pickedArticles.length; b++) { // loop through existing article for dup titles
            if (response.response.docs[i].headline.main == pickedArticles[b].headline.main) {flagDup = true; console.log ("dup detected. " + response.response.docs[i].headline.main); }

        }
       if (!flagDup){pickedArticles[pickedArticles.length] = response.response.docs[i]}
    }
    console.log("Pooler has  " + pickedArticles.length  + " articles and FIRE = " + fire);
    if (pickedArticles.length >= 10 || fire == true){
        printArticles();
    }
    
    return pickedArticles.length;

}





function printArticles(){
    numberOfArticles = pickedArticles.length;
    var response = pickedArticles;
    
 
    
    for (var i = 0; i < 10; i=i+2) {
        var result = response[i];
        var id = response[i]._id;
        var title = response[i].headline.main;
        var abstract = response[i].snippet;
        var url = response[i].web_url;
        var pubdate = response[i].pub_date.split("T")[0];
        var imagesArray = response[i].multimedia;

        if (imagesArray.length > 0){
            var image = "http://www.nytimes.com/" + imagesArray[1].url;
             $('#news1').append("<li class='article' data-id=" + id + "><img src=" + image + "><h3><a target='_blank' href='" + url + "'>" + title + " </a></h3><p>" + pubdate + "</p><p>" + abstract + "</p><button class='save-article'>Read later</button></li>");
        } else {
            var image = "no image available"
             $('#news1').append("<li class='article' data-id=" + id + "><h3><a target='_blank' href='" + url + "'>" + title + " </a></h3><p>" + pubdate + "</p><p>" + abstract + "</p><button class='save-article'>Read later</button></li>");
        }

    }

    if (numberOfArticles > 5) {
        for (var i = 1; i < 10; i=i+2) {
            var result = response[i];
            var id = response[i]._id;
            var title = response[i].headline.main;
            var abstract = response[i].snippet;
            var url = response[i].web_url;
            var pubdate = response[i].pub_date.split("T")[0];
            var imagesArray = response[i].multimedia;

            if (imagesArray.length > 0){
                var image = "http://www.nytimes.com/" + imagesArray[1].url;
                 $('#news2').append("<li class='article' data-id=" + id + "><img src=" + image + "><h3><a target='_blank' href='" + url + "'>" + title + " </a></h3><p>" + pubdate + "</p><p>" + abstract + "</p><button class='save-article'>Read later</button></li>");
            } else {
                var image = "no image available"
                 $('#news2').append("<li class='article' data-id=" + id + "><h3><a target='_blank' href='" + url + "'>" + title + " </a></h3><p>" + pubdate + "</p><p>" + abstract + "</p><button class='save-article'>Read later</button></li>");
            }

        } 
        // $('#news').hide();
        // $('#news').slideDown(5000);
    }

    if (loggedIn == true){
        console.log("Show article read later button.")
        $('.save-article').show();            
      } else {
        console.log("Hide article read later button.")
        $('.save-article').hide();
      }

}


$(function () {
    $('.news-header').hide();
    
    $("#news").on("click", ".save-article", function (event) {
        event.preventDefault();

        var articleTitle = $(this).closest('li').eq(0).find("h3").text();
        var articlePubdate = $(this).closest('li').eq(0).find("p").eq(0).text();
        var articleAbstract = $(this).closest('li').eq(0).find("p").eq(1).text();
        // var newDate = $(this).closest('li').eq(0).find("p").eq(1).text().split("T")[0];
        var articleUrl = $(this).closest('li').eq(0).find("a").attr("href");
        var articleImage = $(this).closest('li').eq(0).find("img").attr("src");

        var $that = $(this);

        $.ajax({
            type: "POST",
            url: "/articles",
            data: {
                article: {
                    title: articleTitle,
                    abstract: articleAbstract,
                    url: articleUrl,
                    pubdate: articlePubdate,
                    image: articleImage
                }
            },
            success: function (response) {
                console.log("Saving article successful.");
                $that.text("Article saved in dashboard!");
            },
            error: function (response) {
                console.log("Saving article failed.");
            }
        });
    });

   
});