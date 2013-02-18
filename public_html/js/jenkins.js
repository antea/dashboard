/* 
 * This js allows the ritrieving data from a jenkins webclient
 * for the purpose of printing it by appending to a <table>.
 */

var jenkinsCheck = (new Date()).getTime();

getJenkins = function(url, urlDate) {
    var jenkinsAppend = "#jenkinsTable"; //Variabile che memorizza la tabella destinata alla stampa dei build

    var printJenkins = function(parsedData) {
        $(jenkinsAppend).empty();
        for (i = 0; i < parsedData.length; i++) {
            $(jenkinsAppend).append("<tr><td>" + parsedData[i].label + "</td><td>" + parsedData[i].name + "</td><td>" + parsedData[i].date.toLocaleString() +
                    "</td><td>" + parsedData[i].state + "</td></tr>");
        }
    };

    var parseJenkins = function(json, xml, printFunction) {
        var found = []; //Array da popolare con i dati trovati, da passare alla funzione di stampa
        var $json = $(json.jobs);
        $json.each(function(i) {
            found[i] = {};
            found[i].name = this.name;
            var jobColor = this.color;
            switch (jobColor) {
                case "blue" :
                    found[i].state = "fermo";
                    found[i].label = " <span class=\"label label-info pull-right\">Stabile</span> ";
                    break;
                case "blue_anime" :
                    found[i].state = "build in corso";
                    found[i].label = " <span class=\"label label-info pull-right\">Stabile</span> ";
                    break;
                case "red":
                    found[i].state = "fermo";
                    found[i].label = " <span class=\"label label-important pull-right\">Rotto</span> ";
                    break;
                case "red_anime":
                    found[i].state = "build in corso";
                    found[i].label = " <span class=\"label label-important pull-right\">Rotto</span> ";
                    break;
                case "yellow":
                    found[i].state = "fermo";
                    found[i].label = " <span class=\"label label-warning pull-right\">Instabile</span> ";
                    break;
                case "yellow_anime":
                    found[i].state = "build in corso";
                    found[i].label = " <span class=\"label label-warning pull-right\">Instabile</span> ";
                    break;
            }
        });
        
        //Recupera la data di build
        xml.find("entry").each(function(i) {
            $this = $(this);
            var date = new Date($this.find("published").text());
            found[i].date = date;
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
    $.getJSON(url, fetchJenkins(urlDate, parseJenkins, printJenkins));
};