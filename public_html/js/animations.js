/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var INTERVAL = 20000;
var TIMEOUT;
getGit();
getJenkins();
$('.carousel').carousel({
    interval: INTERVAL
});
$("#progress").css("-webkit-animation-duration", (INTERVAL / 1000) - 0.8 + "s");
$('.carousel').mouseenter(function() {
    window.clearTimeout(TIMEOUT);
    $("#progress").css("-webkit-animation-play-state", "paused");
});
$('.carousel').mouseleave(function() {
    TIMEOUT = setTimeout("restartBar()", valutaPercentuale());
});
$(".carousel").on("slide", function() {
    $("#progress").attr("id", "progres");
});
$(".carousel").on("slid", function() {
    var attr = $(".carousel .active").attr("id") + "Li";
    $("#navbar > li").removeClass();
    $("#" + attr).addClass("active");
    $("#progres").attr("id", "progress");
});
var valutaPercentuale = function() {
    var width = $('#progress').width();
    var widthMax = $('#progContainer').width();
    return INTERVAL * ((widthMax - width) / widthMax);
};
var restartBar = function() {
    $("#progress").css("-webkit-animation-play-state", "running");
};

var clock = function(){
  var time = new Date().toLocaleTimeString();
  $("#clock").empty();
  $("#clock").append(time);
};
window.setInterval("clock()","1000");