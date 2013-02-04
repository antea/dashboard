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
var redmineDiv = "#redmineInnerDiv";

function getRedmine() {
    $.getJSON(redmineUrl,
            {'key': redmineKey, 'status_id': statusOngoing}
    , function(response) {
        $(redmineDiv).empty();
        $(redmineDiv).append("<h4>Segnalazioni in corso:</h4>");
        var issues = response.issues;
        for (var i = 0; i < issues.length; i++) {
            var nameDeveloper = issues[i].assigned_to.name;
            var subject = issues[i].subject;
            var project = issues[i].project.name;
            var projectNoSpace = project.replace(/ /g, "_");
            var priority = issues[i].priority.id;
            var apendBlockquote = function() {
                var rowNumber = $("#" + projectNoSpace).find('blockquote').length%2;
                $("#" + projectNoSpace+rowNumber).append("<blockquote><p class = " + colorPriority(priority) + ">" + subject + "<small>Assegnato a " +
                        nameDeveloper + "</small></p></blokquote>");
                };
            if ($.find("#" + projectNoSpace).length !== 0) {
                apendBlockquote();
            } else {
                $(redmineDiv).append("<div class=\"row-fluid\"><div class=\"span12\"><div class=\"well well-small span12\" id=\""+projectNoSpace+"\"><h4>" + project + "</h4><div class=\"row-fluid\"><div class=\"span6\" id=\""+projectNoSpace+0+"\"></div><div class=\"span6\" id=\""+projectNoSpace+1+"\"></div></div></div></div></div>");
                apendBlockquote();
            }
        }
    });
}

function colorPriority(num) {
    switch (num) {
        case eval(lowPriority) :
            return "\"lowPriority\"";
        case eval(normalPriority) :
            return "\"normalPriority\"";
        case eval(urgentPriority) :
            return "\"urgentPriority\"";
        case eval(immediatePriority) :
            return "\"immediatePriority\"";
    }
}
