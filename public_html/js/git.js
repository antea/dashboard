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
    data.find("tr").each(function(i) {
        if (i === 5) {
            return false;
        }
        found[i] = {};
        $this = $(this);
        $this.find("td").each(function(j) {
            var $this = $(this);
            if (j === 0) {
                found[i].date = $this;
                found[i].date.text(found[i].date.text().replace("months", "mesi")
                        .replace("month", "mese").replace("weeks", "settimane")
                        .replace("week", "settimana").replace("hours", "ore")
                        .replace("hour", "ora").replace("ago", "fa"));
            }
            else if (j === 1) {
                found[i].name = $this;
                return false;
            }
        });
    });
    printFunction(found);
};

var printCommit = function(parsedData) {
    $(commitAppend).html("<h4>Commit più recenti in develop</h4>");
    for (i = 0; i < parsedData.length; i++) {
        $(commitAppend).append("<blockquote><p>" + parsedData[i].title + "</p>" + "<p><small>" +
                parsedData[i].author + " il " + parsedData[i].pubDate.toLocaleString() + ".</p></small></blockquote>");
    }
};

var parseCommit = function(data, printFunction) {
    var parsedData = [];
    data.find("item").each(function(index) {
        if (index === 5) {
            return false;
        }
        var $this = $(this);
        parsedData[index] = {
            title: $this.find("title").text(),
            pubDate: new Date($this.find("pubDate").text()),
            author: $this.find("author").text().split(" <")[0]
        };
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