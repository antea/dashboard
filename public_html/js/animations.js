/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var INTERVAL = 30000; //Tempo di slide del carousel
var timeout;

$('.carousel').carousel({
    interval: INTERVAL
});

$("#progress").css("-webkit-animation-duration", (INTERVAL / 1000) - 0.8 + "s");
$("#progress").css("-o-animation-duration", (INTERVAL / 1000) - 0.8 + "s");
$("#progress").css("-moz-animation-duration", (INTERVAL / 1000) - 0.8 + "s");
$('.carousel').mouseenter(function() {
    window.clearTimeout(timeout);
    $("#progress").css("-webkit-animation-play-state", "paused");
    $("#progress").css("-o-animation-play-state", "paused");
    $("#progress").css("-moz-animation-play-state", "paused");
});
$('.carousel').mouseleave(function() {
    timeout = setTimeout("restartBar()", valutaPercentuale());
});
$(".carousel").on("slide", function() {
    window.clearTimeout(timeout);
    restartBar();
    $("#progress").attr("id", "progres");
    $("div.carousel-inner").scrollTop(0);
});
$(".carousel").on("slid", function() {
    var attr = $(".carousel .active").attr("id");
    var attrList = attr + "Li";
    $("#navbar > li").removeClass("active");
    $("#" + attrList).addClass("active");
    $("#progres").attr("id", "progress");
    checkScroll();
});

var valutaPercentuale = function() {
    var width = $('#progress').width();
    var widthMax = $('#progContainer').width();
    return INTERVAL * ((widthMax - width) / widthMax);
};
var restartBar = function() {
    $("#progress").css("-webkit-animation-play-state", "running");
    $("#progress").css("-o-animation-play-state", "running");
    $("#progress").css("-moz-animation-play-state", "running");
};

var clock = function() {
    var time = new Date().toLocaleTimeString();
    $("#clock").empty();
    $("#clock").append(time);
};
window.setInterval("clock()", "1000");

document.getElementById("redmineDivLi").onclick = function() {
    $('.carousel').carousel(0);
};
document.getElementById("gitDivLi").onclick = function() {
    $('.carousel').carousel(1);
};
document.getElementById("svnDivLi").onclick = function() {
    $('.carousel').carousel(2);
};
document.getElementById("jenkinsDivLi").onclick = function() {
    $('.carousel').carousel(3);
};
document.getElementById("calendarDivLi").onclick = function() {
    $('.carousel').carousel(4);
};

var callMethods = function() {
    getGit(gitUrl, gitWebUrl);
    getJenkins(jenkinsUrl, jenkinsUrlDate);
    getRedmine();
    getSvn();
    makeNextEventsRequest();
    window.setTimeout("appendCheck()", "2000")
};
window.setInterval("callMethods()", "900000");

// Aggiorna le etichette che dicono da quanto non sono aggiornate le pagine del carousel.
var appendCheck = function() {
    var time = Date.now();
    $("#redmineCheck").html("Redmine: " + (((time - redmineCheck) / 60000).toFixed(0)) + " minuti fa");
    $("#gitCheck").html("Git: " + (((time - gitCheck) / 60000).toFixed(0)) + " minuti fa");
    $("#svnCheck").html("Svn: " + (((time - svnCheck) / 60000).toFixed(0)) + " minuti fa");
    $("#jenkinsCheck").html("Jenkins: " + (((time - jenkinsCheck) / 60000).toFixed(0)) + " minuti fa");
    $("#calendarCheck").html("Calendario: " + (((time - calendarCheck) / 60000).toFixed(0)) + " minuti fa");
};
window.onload = function() {
    authorizeClient();
    callMethods();
    window.setTimeout("checkScroll()", "2000");
    };
window.setInterval("appendCheck()", "60000");


// Controlla che la pagina di carousel non sborda.
var checkScroll = function() {
    var attr = $(".carousel .active").attr("id");
    if ($("#" + attr).height() > $("div.carousel-inner").height()) {
        var scrollMax = $("#" + attr).height() - $("div.carousel-inner").height();
        $("div.carousel-inner").animate({scrollTop: scrollMax}, INTERVAL/2, 'linear');
    }
};