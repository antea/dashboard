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
var redmineCheck = Date.now();

function getRedmine() {
    $.getJSON(redmineUrl,
            {'key': redmineKey, 'status_id': statusOngoing}
    , callbackRedmineRequest(appendRedmineToHtml));
}

var callbackRedmineRequest = function(howToappend) {
    return function(response, status) {
        if (status === "success") {
            redmineCheck = Date.now();
            $(redmineTable).empty();
            var issues = response.issues;
            for (var i = 0; i < issues.length; i++) {
                var issue = {
                    nameDeveloper: issues[i].assigned_to.name,
                    subject: issues[i].subject,
                    project: issues[i].project.name,
                    priority: issues[i].priority.id
                };
                howToappend(issue);
            }
        } else {
            return status;
        }
    };
};

var appendRedmineToHtml = function(issue) {
    var projectNoSpace = issue.project.replace(/ /g, "_");
    if ($.find("#" + projectNoSpace).length !== 0) {
        appendRow(projectNoSpace, issue);
    } else {
        appendFirstRow(projectNoSpace, issue);
    }
};

var appendRow = function(projectNoSpace, issue) {
    $("#" + projectNoSpace).after("<tr><td></td><td  class=" + colorPriority(issue.priority)
            + ">" + issue.subject + "</td><td  class=" + colorPriority(issue.priority) + ">"
            + issue.nameDeveloper + "</td></tr>");
};

var appendFirstRow = function(projectNoSpace, firstIssue) {
    $(redmineTable).append("<tr id=\"" + projectNoSpace + "\"><td><strong>"
            + firstIssue.project + "</strong></td><td class=" + colorPriority(firstIssue.priority) + ">"
            + firstIssue.subject + "</td><td class=" + colorPriority(firstIssue.priority) + ">"
            + firstIssue.nameDeveloper + "</td></tr>");
};

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
