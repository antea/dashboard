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
    $.ajax({
        url: 'http://redmine.antea.bogus/issues.json',
        data: {'key': redmineKey, 'status_id': statusOngoing}
    }).done(function(response) {
        var issues = response.issues;
        for (var i = 0; i < issues.length; i++) {
            var nameDeveloper = issues[i].assigned_to.name;
            var subject = issues[i].subject;
            var project = issues[i].project.name;
            var priority = issues[i].priority.id;
            $("#redmineUl").append("<li style = " + colorPriority(priority) + ">Project: <strong>" +
                    project + "</strong> : <strong>" + subject + "</strong> assigned to <strong>" +
                    nameDeveloper + "</strong></li>");
        }
    });
}

function colorPriority(num) {
    switch (num) {
        case eval(lowPriority) :
            return "\"color : lightskyblue\"";
        case eval(normalPriority) :
            return "\"color : lightgreen\"";
        case eval(urgentPriority) :
            return "\"color : orange\"";
        case eval(immediatePriority) :
            return "\"color : red\"";
    }
}
retrieveInformation();