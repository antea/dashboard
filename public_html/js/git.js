/* 
 * This js allows the ritrieving data from a git webclient
 * for the purpose of printing it by appending to a <div>.
 */

var gitCheck = (new Date()).getTime();
var branchAppend = "#branchDiv";
var commitAppend = "#commitDiv";

getGit = function(urlCommit, urlBranch) {
    $.get(urlCommit, fetchGit(parseCommit, printCommit));
    $.get(urlBranch, fetchGit(parseBranch, printBranch));
};

var printBranch = function(parsedData) {
    $(branchAppend).empty();
    $(branchAppend).append("<h4>Branch più recenti</h4>");
    for (i = 0; i < parsedData.length; i++) {
        $(branchAppend).append("<blockquote><p>" + parsedData[i].name.text() + "</p><p><small>" + parsedData[i].date.text() + "</p></small></blockquote>");
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
            return false;
        }
    });
    printFunction(found);
};

var printCommit = function(parsedData) {
    $(commitAppend).empty();
    $(commitAppend).append("<h4>Commit più recenti in develop</h4>");
    for (i = 0; i < parsedData.length; i++) {
        $(commitAppend).append("<blockquote><p>" + parsedData[i].title + "</p>" + "<p><small>" +
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
            return false;
        }
    });
    printFunction(parsedData);
};

var fetchGit = function(parseFunction, printFunction) {
    return function(data, textStatus) {
        if (textStatus !== "success") {
            return textStatus;
        } else {
            gitCheck = (new Date()).getTime();
            $data = $(data);
            parseFunction($data, printFunction);
        }
    };
};