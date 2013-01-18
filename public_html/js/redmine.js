/* 
 * This js allows users authenticating with RedmineAPI and retrieving
 * informations about the ongoing issues, in particular the issue's subject and 
 * the developer which an issue is assigned to. To use this js
 * you must retrieve the redmineKey from your personal Redmine page.
 */

var redmineKey = "";//TODO insert your redmineKey

function retrieveInformation() {
    $.ajax({
        url: 'http://redmine.antea.bogus/issues.json',
        data: {'key': redmineKey, 'status_id': '2'}
    }).done(function(response) {
        var issues = response.issues;
        for (var i = 0; i < issues.length; i++) {
            var nameDeveloper = issues[i].assigned_to.name;
            var subject = issues[i].subject;
            var project = issues[i].project.name;
            var priority = issues[i].priority.id;
            $("#redmineUl").append("<li style = "+ colorPriority(priority)+">Project: <strong>" +
                    project + "</strong> : <strong>" + subject + "</strong> assigned to <strong>" +
                    nameDeveloper + "</strong></li>");
        }
    });
}

function colorPriority(num) {
    if (num === 3) {
        return "\"color : lightskyblue\"";
    } else {
        if (num === 4) {
            return "\"color : lightgreen\"";
        } else {
            if (num === 6) {
                return "\"color : orange\"";
            } else {
                return "\"color : red\"";
            }
        }
    }
}
retrieveInformation();

