/* 
 * This js allows users retrieving information about last 20 commit's date, author
 * and log message of the Subversion's repository.
 */

var svnCheck = Date.now();

var getSvn = function() {
    $.get(svnUrl, callbackSvn(appendSvn));
};

var callbackSvn = function(howToAppend) {
    return function(response, statusText) {
        if ("success" === statusText) {
            svnCheck = Date.now();
            var items = $(response).find("item");
            items.each(function(i) {
                var item = {
                    date: new Date($(this).find("pubDate").text()),
                    author: items[i].childNodes[1].textContent,
                    log: $(this).find("title").text()
                };
                howToAppend(item);
                if (i === 19) {
                    return false;
                }
            });
        } else {
            return statusText;
        }
    };
};

var appendSvn = function(item) {
    $("#svnTable").append("<tr><td>" + item.date.toLocaleDateString() + " alle " +
            item.date.toLocaleTimeString() + "</td><td>" + item.log + "</td><td>" + item.author + "</td></tr>");
};