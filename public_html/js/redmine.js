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
var redmineTable = "#redmineTable";

function getRedmine() {
    $.getJSON(redmineUrl,
            {'key': redmineKey, 'status_id': statusOngoing}
    , function(response) {
        $(redmineTable).empty();
        var issues = response.issues;
        for (var i = 0; i < issues.length; i++) {
            var nameDeveloper = issues[i].assigned_to.name;
            var subject = issues[i].subject;
            var project = issues[i].project.name;
            var projectNoSpace = project.replace(/ /g, "_");
            var priority = issues[i].priority.id;
            var apendRow = function() {
                $("#" + projectNoSpace).after("<tr><td></td><td  class=" + colorPriority(priority) + ">" + subject + "</td><td  class=" + colorPriority(priority) + ">" + nameDeveloper + "</td></tr>");
            };
            if ($.find("#" + projectNoSpace).length !== 0) {
                apendRow();
            } else {
                $(redmineTable).append("<tr id=\"" + projectNoSpace + "\"><td><strong>" + project + "</strong></td><td class=" + colorPriority(priority) + ">" + subject + "</td><td class=" + colorPriority(priority) + ">" + nameDeveloper + "</td></tr>");
            }
        }
    });
}

function colorPriority(num) {
    switch (num) {
        case eval(lowPriority) :
            return "\"lowPriority\"";
            break;
        case eval(normalPriority) :
            return "\"normalPriority\"";
            break;
        case eval(urgentPriority) :
            return "\"urgentPriority\"";
            break;
        case eval(immediatePriority) :
            return "\"immediatePriority\"";
            break;
    }
}
