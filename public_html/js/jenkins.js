/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var jenkinsCheck = (new Date()).getTime();

getJenkins = function(url, urlDate) {
    var found = [];
    
    function build() {
        this.name;
        this.color;
        this.date;
        this.state;
    }
    
    $.getJSON(url, function(data, textStatus) {
        if (textStatus !== "success") {
            return;
        } else {
            jenkinsCheck = (new Date()).getTime();
            var obj = data;
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
        }
    });
    $.get(urlDate, function(xml) {
        var $xml = $(xml);
        $xml.find("entry").each(function(index) {
            $this = $(this);
            var date = new Date($this.find("published").text());
            found[index].date = date;
        });
        $("#jenkinsTable").empty();
        for (i = 0; i < found.length; i++) {
            $("#jenkinsTable").append("<tr class=\"" + found[i].color + "\"><td>" + found[i].name + "</td><td>" + found[i].date.toLocaleString() +
                    "</td><td>" + found[i].state + "</td></tr>");
        }
    });
};