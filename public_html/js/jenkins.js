/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var rssurl = 'http://jenkins.antea.bogus/hudson/api/json';
$.getJSON(rssurl, function(data) {
    var obj = data;
    for (i = 0; i < obj.jobs.length; i++) {
        $("#jenkinsDiv").append("<p>" + obj.jobs[i].name + "</p>");
    }
    ;
});
