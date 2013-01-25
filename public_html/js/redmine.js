/* 
 * This js allows users authenticating with RedmineAPI and retrieving
 * informations about the ongoing issues, in particular the issue's subject and 
 * the developer which an issue is assigned to. To use this js
 * you must retrieve the redmineKey from your personal Redmine page.
 */

var statusOngoing = "2";
var lowPriority = "3";
var normalPriority = "4";
var urgentPriority = "6";
var immediatePriority = "7";

function retrieveInformation() {
    $.getJSON(redmineUrl,
    {'key': redmineKey, 'status_id': statusOngoing}
    , function(response) {
        var issues = response.issues;
        for (var i = 0; i < issues.length; i++) {
            var nameDeveloper = issues[i].assigned_to.name;
            var subject = issues[i].subject;
            var project = issues[i].project.name;
            var priority = issues[i].priority.id;
            $("#redmineUl").append("<li class = " + colorPriority(priority) + ">Progetto: <strong>" +
                    project + "</strong> : <strong>" + subject + "</strong> assegnato a <strong>" +
                    nameDeveloper + "</strong></li>");
        }
    });
}

function colorPriority(num) {
    switch (num) {
        case eval(lowPriority) :
            return "lowPriority";
        case eval(normalPriority) :
            return "normalPriority";
        case eval(urgentPriority) :
            return "urgentPriority";
        case eval(immediatePriority) :
            return "immediatePriority";
    }
}
retrieveInformation();