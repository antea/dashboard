/* 
 * This js allows the ritrieving data from a jenkins webclient
 * for the purpose of printing it by appending to a <div>.
 */

var jenkinsCheck = (new Date()).getTime();

getJenkins = function(url, urlDate) {
    $.getJSON(url, fetchJenkins(urlDate, parseJenkins, printJenkins));
};
var printJenkins = function(parsedData) {
    $("#jenkinsTable").empty();
    for (i = 0; i < parsedData.length; i++) {
        $("#jenkinsTable").append("<tr><td>" + parsedData[i].label + parsedData[i].name + "</td><td>" + parsedData[i].date.toLocaleString() +
                "</td><td>" + parsedData[i].state + "</td></tr>");
    }
};

var parseJenkins = function(json, xml, printFunction) {
    var found = [];
    function build() {
        this.name;
        this.date;
        this.state;
        this.label;
    }
    var obj = json;
    for (i = 0; i < obj.jobs.length; i++) {
        var jobColor = obj.jobs[i].color;
        found[i] = new build();
        found[i].name = obj.jobs[i].name;
        switch (jobColor) {
            case "blue" :
                found[i].state = "fermo";
                found[i].label = " <span class=\"label label-info\">Stabile</span> ";
                break;
            case "blue_anime" :
                found[i].state = "build in corso";
                found[i].label = " <span class=\"label label-info\">Stabile</span> ";
                break;
            case "red":
                found[i].state = "fermo";
                found[i].label = " <span class=\"label label-important\">Danneggiata</span> ";
                break;
            case "red_anime":
                found[i].state = "build in corso";
                found[i].label = " <span class=\"label label-important\">Danneggiata</span> ";
                break;
            case "yellow":
                found[i].state = "fermo";
                found[i].label = " <span class=\"label label-warning\">Instabile</span> ";
                break;
            case "yellow_anime":
                found[i].state = "build in corso";
                found[i].label = " <span class=\"label label-warning\">Instabile</span> ";
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

var fetchJenkins = function(urlDate, parseFunction, printFunction) {
    return function(json, textStatus) {
        if (textStatus !== "success") {
            return textStatus;
        } else {
            jenkinsCheck = (new Date()).getTime();
            $.get(urlDate, function(xml) {
                $xml = $(xml);
                parseFunction(json, $xml, printFunction);
            });
        }
    };
};