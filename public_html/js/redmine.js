/* 
 * This js allows users authenticating with RedmineAPI and retrieving
 * informations about the ongoing issues, in particular the issue's subject and 
 * the developer which an issue is assigned to. To use this js
 * you must retrieve the redmineKey from your personal Redmine page.
 */

var STATUS_ONGOING = "2";
var LOW_PRIORITY = "3";
var NORMAL_PRIORITY = "4";
var URGENT_PRIORITY = "6";
var IMMEDIATE_PRIORITY = "7";
var REDMINE_TABLE = "#redmineTable";
var redmineCheck = Date.now();

/**
 * This function makes a request to redmine, than call callbackRedmineRequest.
 * 
 */
function getRedmine() {
    $.getJSON(redmineUrl,
            {'key': redmineKey, 'status_id': STATUS_ONGOING}
    , callbackRedmineRequest(appendRedmineToHtml));
}

/**
 * Returns a function that transform a data's array into an object. This function
 * was made to separate logic from data retrieving to test it.
 * 
 * @param {function} howToappend is a function that explain what to do with the 
 * data processed and should have 1 parameter.
 * @returns {function} a function that transform a data's array into an object
 */
var callbackRedmineRequest = function(howToappend) {
    return function(response, status) {
        if (status === "success") {
            redmineCheck = Date.now();
            $(REDMINE_TABLE).empty();
            var issues = response.issues;
            issues.forEach(function(arrayElement) {
                var issue = {
                    nameDeveloper: arrayElement.assigned_to.name,
                    subject: arrayElement.subject,
                    project: arrayElement.project.name,
                    priority: arrayElement.priority.id
                };
                howToappend(issue);
            });
        } else {
            return status;
        }
    };
};

/**
 * This function is used to append the properties of an object into an html table.
 * It calls appendRow or appendFirstRow if the object is the first or not of the specified
 * project.
 * 
 * @param {object} issue: the object to append
 */
var appendRedmineToHtml = function(issue) {
    var projectNoSpace = issue.project.replace(/ /g, "_");
    if ($.find("#" + projectNoSpace).length !== 0) {
        appendRow(projectNoSpace, issue);
    } else {
        appendFirstRow(projectNoSpace, issue);
    }
};

var appendRow = function(projectNoSpace, issue) {
    $("#" + projectNoSpace).after("<tr><td></td><td>" + issue.subject + " " + colorPriority(issue.priority) + "</td><td>"
            + issue.nameDeveloper + "</td></tr>");
};

var appendFirstRow = function(projectNoSpace, firstIssue) {
    $(REDMINE_TABLE).append("<tr id=\"" + projectNoSpace + "\"><td><strong>"
            + firstIssue.project + "</strong></td><td>"
            + firstIssue.subject + " " + colorPriority(firstIssue.priority) + "</td><td>"
            + firstIssue.nameDeveloper + "</td></tr>");
};

/**
 * This function evaluate the parameter and return a lable to append into html.
 * 
 * @param {number} num the parameter to evaluate.
 * @returns {String} a string that should be used to append a label to html.
 */
function colorPriority(num) {
    switch (num) {
        case eval(LOW_PRIORITY) :
            return "<span class =\"label label-info\">Bassa priorità</span>";
            break;
        case eval(NORMAL_PRIORITY) :
            return "";
            break;
        case eval(URGENT_PRIORITY) :
            return "<span class =\"label label-warning\">Urgente</span>";
            break;
        case eval(IMMEDIATE_PRIORITY) :
            return "<span class =\"label label-important\">Immediata</span>";
            break;
    }
}