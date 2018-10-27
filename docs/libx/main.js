jQuery().ready(function($){
    "use strict";
    // var baseUrl = window.location.href.replace(/\w+\/[^/]*$/, "");
   
    var getShortUrl = function (url, callback) {
        $.getJSON(
            'https://api-ssl.bitly.com/v3/shorten',
            {login: 'o_12v34ba90r', apiKey: 'R_80d8ad9489ae4ecb8f9c741f215fb2dc', longUrl: url, format: "json"},
            function(response) {
                callback && callback(response.data.url);
            }
        );
    };
    $("#shorten").click(function(){
       // var base64 = LZString.compressToBase64( editor.getValue().replace(/\n/g, " ").replace(/> +</g, "><") );
       var $url = $("#url");
       if ( !$url.val() || !$url.val().match(/#/) ) { return; }

       getShortUrl($url.val(), function(shortUrl){
           $url.val(shortUrl);
       });
    });
});
