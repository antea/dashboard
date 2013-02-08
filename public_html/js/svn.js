/* 
 * This js allows users retrieving information about last 20 commit's date, author
 * and log message of the Subversion's repository.
 */

var svnCheck = Date.now();

var getSvn = function() {
    $.get(svnUrl, function(response, statusText) {
        if ("success" === statusText) {
            svnCheck = Date.now();
            var items = $(response).find("item");
            items.each(function(i) {
                var date = new Date($(this).find("pubDate").text());
                var author = items[i].childNodes[1].textContent;
                var log = $(this).find("title").text();
                $("#svnTable").append("<tr><td>" + date.toLocaleDateString() + " alle " +
                        date.toLocaleTimeString() + "</td><td>" + log + "</td><td>" + author + "</td></tr>");
                if (i === 19) {
                    return false;
                }
            });
        }
    });
};