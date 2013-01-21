/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var jenkinsURL = 'http://jenkins.antea.bogus/hudson/api/json';
$.getJSON(jenkinsURL, function(data) {
    var obj = data;
    for (i = 0; i < obj.jobs.length; i++) {
        var jobColor = obj.jobs[i].color;
        var pClass;
        if (jobColor === "blue") {
            pClass = "text-info";
        } else if (jobColor === "red") {
            pClass = "text-error";
        } else if (jobColor === "yellow") {
            pClass = "text-warning";
        }
        $("#jenkinsDiv").append("<p class=" + pClass + ">" + obj.jobs[i].name +
                "</p>");
    }
    ;
});
