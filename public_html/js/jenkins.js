/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var jenkinsCheck = (new Date()).getTime();

getJenkins = function(url, urlDate) {
    fetchJenkins(url, urlDate, parseJenkins, printJenkins);
};
var printJenkins = function(parsedData) {
    $("#jenkinsTable").empty();
    for (i = 0; i < parsedData.length; i++) {
        $("#jenkinsTable").append("<tr class=\"" + parsedData[i].color + "\"><td>" + parsedData[i].name + "</td><td>" + parsedData[i].date.toLocaleString() +
                "</td><td>" + parsedData[i].state + "</td></tr>");
    }
};

var parseJenkins = function(json, xml, printFunction) {
    var found = [];
    function build() {
        this.name;
        this.color;
        this.date;
        this.state;
    }
    var obj = json;
    for (i = 0; i < obj.jobs.length; i++) {
        var jobColor = obj.jobs[i].color;
        found[i] = new build();
        found[i].name = obj.jobs[i].name;
        switch (jobColor) {
            case "blue" :
                found[i].state = "fermo";
                found[i].color = "alert alert-info";
                break;
            case "blue_anime" :
                found[i].state = "build in corso";
                found[i].color = "alert alert-info";
                break;
            case "red":
                found[i].state = "fermo";
                found[i].color = "alert alert-error";
                break;
            case "red_anime":
                found[i].state = "build in corso";
                found[i].color = "alert alert-error";
                break;
            case "yellow":
                found[i].state = "fermo";
                found[i].color = "alert";
                break;
            case "yellow_anime":
                found[i].state = "build in corso";
                found[i].color = "alert";
                break;
        }
    }
    xml.find("entry").each(function(index) {
        $this = $(this);
        var date = new Date($this.find("published").text());
        found[index].date = date;
    });
    printFunction(found);
};

var fetchJenkins = function(url, urlDate, parseFunction, printFunction) {
    $.getJSON(url, function(json, textStatus) {
        if (textStatus !== "success") {
            return;
        } else {
            jenkinsCheck = (new Date()).getTime();
            $.get(urlDate, function(xml) {
                $xml = $(xml);
                parseFunction(json, $xml, printFunction);
            });
        }
    });
};