/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

getJenkins = function() {
    var found = [];

    function build() {
        this.name;
        this.color;
        this.date;
        this.state;
    }

    $.getJSON(jenkinsUrl, function(data) {
        var obj = data;
        var j = 0;
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
        $.get(jenkinsUrlDate, function(xml) {
            var $xml = $(xml);
            $xml.find("entry").each(function(index) {
                $this = $(this);
                var date = new Date($this.find("published").text());
                found[index].date = date;
            });
            $("#jenkinsTable").empty();
            for (i = 0; i < found.length; i++) {
                $("#jenkinsTable").append("<tr class=\"" + found[i].color + "\"><td><strong>" + found[i].name + "</strong></td><td>" + found[i].date.toLocaleString() +
                        "</td><td>" + found[i].state + "</td></tr>");
            }
        });
    });
};