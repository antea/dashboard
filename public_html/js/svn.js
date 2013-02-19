/* 
 * This js allows users retrieving information about last 20 commit's date, author
 * and log message of the Subversion's repository.
 */

var svnCheck = Date.now();
var SVN_TABLE = "#svnTable";

/**
 * This function makes a request to webSvn, then call callbackSvnRequest.
 * 
 */
var getSvn = function() {
    $.get(svnUrl, callbackSvnRequest(appendSvn));
};

/**
 * Returns a function that transform a data's xml into objects. If the request is 
 * not success the function return the status of server's response.
 * 
 * This function was made to separate logic from data retrieving to test it.
 * 
 * @param {function} howToAppend is a function that explain what to do with the 
 * data processed.
 * @returns {function} a function that transform the first 20 data's item from 
 * an xml to objects.
 */
var callbackSvnRequest = function(howToAppend) {
    return function(response, statusText) {
        if ("success" === statusText) {
            $(SVN_TABLE).empty();
            svnCheck = Date.now();
            var items = $(response).find("item");
            items.each(function(i) {
                if (i === 20) {
                    return false;
                }
                var item = {
                    date: new Date($(this).find("pubDate").text()),
                    author: items[i].childNodes[1].textContent,
                    log: $(this).find("title").text()
                };
                howToAppend(item);
            });
        } else {
            return statusText;
        }
    };
};

/**
 * This function is used to append the properties of an object into an html table. 
 * 
 * @param {object} item : the object to append.
 */
var appendSvn = function(item) {
    $(SVN_TABLE).append("<tr><td>" + item.date.toLocaleDateString() + " alle " +
            item.date.toLocaleTimeString() + "</td><td>" + item.log + "</td><td>" + item.author + "</td></tr>");
};