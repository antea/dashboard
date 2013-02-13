/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var gitCheck = (new Date()).getTime();

getGit = function(urlCommit, urlBranch) {
    fetch(urlBranch, parseBranch, printBranch);
    fetch(urlCommit, parseCommit, printCommit);
};

var printBranch = function(parsedData) {
    $("#branchDiv").empty();
    $("#branchDiv").append("<h4>Branch più recenti</h4>");
    for (i = 0; i < parsedData.length; i++) {
        $("#branchDiv").append("<blockquote><p>" + parsedData[i].name.text() + "</p><p><small>" + parsedData[i].date.text() + "</p></small></blockquote>");
    }
};

var parseBranch = function(data, printFunction) {
    var found = [];
    function branch() {
        this.name;
        this.date;
    }
    data.find("tr").each(function(i) {
        found[i] = new branch();
        $this = $(this);
        $this.find("td").each(function(j) {
            var $this = $(this);
            if (j === 0) {
                found[i].date = $this;
                found[i].date.text(found[i].date.text().replace("months", "mesi"));
                found[i].date.text(found[i].date.text().replace("month", "mese"));
                found[i].date.text(found[i].date.text().replace("weeks", "settimane"));
                found[i].date.text(found[i].date.text().replace("week", "settimana"));
                found[i].date.text(found[i].date.text().replace("hours", "ore"));
                found[i].date.text(found[i].date.text().replace("hour", "ora"));
                found[i].date.text(found[i].date.text().replace("ago", "fa"));
            }
            else if (j === 1) {
                found[i].name = $this;
                return false;
            }
        });
        if (i === 4) {
            printFunction(found);
            return false;
        }
    });
};

var printCommit = function(parsedData) {
    $("#commitDiv").empty();
    $("#commitDiv").append("<h4>Commit più recenti</h4>");
    for (i = 0; i < parsedData.length; i++) {
        $("#commitDiv").append("<blockquote><p>" + parsedData[i].title + "</p>" + "<p><small>" +
                parsedData[i].author + " il " + parsedData[i].pubDate.toLocaleString() + ".</p></small></blockquote>");
    }
};

var parseCommit = function(data, printFunction) {
    var parsedData = [];
    data.find("item").each(function(index) {
        var $this = $(this);
        var item = {
            title: $this.find("title").text(),
            pubDate: new Date($this.find("pubDate").text()),
            author: $this.find("author").text().split(" <")[0]
        };

        parsedData[index] = item;
        if (index === 4) {
            printFunction(parsedData);
            return false;
        }
    });
};

var fetch = function(url, parseFunction, printFunction) {
    $.get(url, function(data, textStatus) {
        if (textStatus !== "success") {
            return;
        } else {
            gitCheck = (new Date()).getTime();
            $data = $(data);
            parseFunction($data, printFunction);
        }
    });
};