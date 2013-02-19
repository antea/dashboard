/* 
 * This script is used to animate elements on html
 */

var INTERVAL = 30000; //Tempo di slide del carousel
var timeout;

/*-----------CAROUSEL------------
 
 The script below starts the carousel and explain how it should work when mouse enter, 
 mouse leave, carousle slid or slide.
 
 */

var startCarousel = function() {
    $('.carousel').carousel({
        interval: INTERVAL
    });
    $('.carousel').mouseenter(function() {
        window.clearTimeout(timeout);
        pauseProgressBar();
    });
    $('.carousel').mouseleave(function() {
        timeout = setTimeout("restartProgressBar()", setTimeoutProgressBar());
    });
    $(".carousel").on("slide", function() {
        window.clearTimeout(timeout);
        restartProgressBar();
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
};
/*-----------PROGRESSBAR------------
 
 The scripts below starts, pauses and restarts the animation defined into the 
 style.css that moves the progress bar from 100% to 0%.
 
 */

var startProgressBar = function() {
    $("#progress").css("-webkit-animation-duration", (INTERVAL / 1000) - 0.8 + "s");
    $("#progress").css("-o-animation-duration", (INTERVAL / 1000) - 0.8 + "s");
    $("#progress").css("-moz-animation-duration", (INTERVAL / 1000) - 0.8 + "s");
};

var pauseProgressBar = function() {
    $("#progress").css("-webkit-animation-play-state", "paused");
    $("#progress").css("-o-animation-play-state", "paused");
    $("#progress").css("-moz-animation-play-state", "paused");
};

var restartProgressBar = function() {
    $("#progress").css("-webkit-animation-play-state", "running");
    $("#progress").css("-o-animation-play-state", "running");
    $("#progress").css("-moz-animation-play-state", "running");
};

/**
 * This function calculates the time for bar restarting, depending on how much 
 * time elapsed when the progress bar stopped.
 * 
 * @returns {Number} the timeout to attend.
 */
var setTimeoutProgressBar = function() {
    var barWidth = $('#progress').width();
    var maxBarWidth = $('#progContainer').width();
    return INTERVAL * ((maxBarWidth - barWidth) / maxBarWidth);
};

//-----------CLOCK------------

/**
 * This function is used to stamp time.
 */
var clock = function() {
    var time = new Date().toLocaleTimeString();
    $("#clock").html(time);
};

//-----------NAVLIST------------

var manageNavlistAction = function() {
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
};

//-----------CHEKPOINTS------------

/**
 * This function update minutes elapsed from last information retrieving and append
 * it in the unordered list of the html
 */
var checkElapsedTime = function() {
    var time = Date.now();
    $("#redmineCheck").html("Redmine: " + (((time - redmineCheck) / 60000).toFixed(0)) + " minuti fa");
    $("#gitCheck").html("Git: " + (((time - gitCheck) / 60000).toFixed(0)) + " minuti fa");
    $("#svnCheck").html("Svn: " + (((time - svnCheck) / 60000).toFixed(0)) + " minuti fa");
    $("#jenkinsCheck").html("Jenkins: " + (((time - jenkinsCheck) / 60000).toFixed(0)) + " minuti fa");
    $("#calendarCheck").html("Calendario: " + (((time - calendarCheck) / 60000).toFixed(0)) + " minuti fa");
};

//-----------SCROLL------------

/**
 * Checks if carousel's page overflows and starts autoscroll.
 * 
 */
var checkScroll = function() {
    var attr = $(".carousel .active").attr("id");
    if ($("#" + attr).height() > $("div.carousel-inner").height()) {
        var scrollMax = $("#" + attr).height() - $("div.carousel-inner").height();
        $("div.carousel-inner").animate({scrollTop: scrollMax}, INTERVAL / 2, 'linear');
    }
};

//-----------------------

/**
 * This function calls every function that should be retrieve and append informations.
 */
var callRequestMethods = function() {
    getGit(gitUrl, gitWebUrl);
    getJenkins(jenkinsUrl, jenkinsUrlDate);
    getRedmine();
    getSvn();
    makeNextEventsRequest();
    window.setTimeout("checkElapsedTime()", "2000");
};

/**
 * The script below starts all functions on load.
 */
window.onload = function() {
    authorizeGoogleClient();
    callRequestMethods();
    startCarousel();
    startProgressBar();
    manageNavlistAction();
    window.setTimeout("checkScroll()", "2000");
    window.setInterval("checkElapsedTime()", "60000");
    window.setInterval("clock()", "1000");
    window.setInterval("callRequestMethods()", "900000");
};