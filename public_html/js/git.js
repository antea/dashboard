/* 
 * This js allows the ritrieving data from a git webclient
 * for the purpose of printing it by appending to a <div>.
 */

var gitCheck = (new Date()).getTime();

getGit = function(urlCommit, urlBranch) {
    var branchAppend = "#branchDiv"; //Variabile che memorizza il div destinato alla stampa dei branch
    var commitAppend = "#commitDiv"; //Variabile che memorizza il div destinato alla stampa dei commit

    var printBranch = function(parsedData) {
        $(branchAppend).html("<h4>Branch più recenti</h4>");
        for (i = 0; i < parsedData.length; i++) {
            $(branchAppend).append("<blockquote><p>" + parsedData[i].name.text() + "</p><p><small>" + parsedData[i].date.text() + "</p></small></blockquote>");
        }
    };

    var printCommit = function(parsedData) {
        $(commitAppend).html("<h4>Commit più recenti in develop</h4>");
        for (i = 0; i < parsedData.length; i++) {
            $(commitAppend).append("<blockquote><p>" + parsedData[i].title + "</p>" + "<p><small>" +
                    parsedData[i].author + " il " + parsedData[i].pubDate.toLocaleString() + ".</p></small></blockquote>");
        }
    };

    var parseBranch = function(data, printFunction) {
        var MAX_BRANCH_COUNT = 5; //Variabile che memorizza il numero massimo di branch da stampare
        var found = []; //Array da popolare con i dati trovati, da passare alla funzione di stampa
        data.find("tr").each(function(i) {
            if (i === MAX_BRANCH_COUNT) {
                return false;
            }
            $this = $(this);
            found[i] = {
                name: $this.children("td:nth-of-type(2)"), //Seconda cella della tabella dove è scritto il nome del branch
                date: $this.children("td:nth-of-type(1)") //Prima cella della tabella dove è scritta la data di aggiornamento del branch
            };
            //Traduce la data da inglese ad italiano
            found[i].date.text(found[i].date.text().replace("months", "mesi")
                    .replace("month", "mese").replace("weeks", "settimane")
                    .replace("week", "settimana").replace("days", "giorni")
                    .replace("day", "giorno").replace("hours", "ore")
                    .replace("hour", "ora").replace("ago", "fa"));
        });
        printFunction(found);
    };

    var parseCommit = function(data, printFunction) {
        var MAX_COMMIT_COUNT = 5; //Variabile che memorizza il numero massimo di commit da stampare
        var found = []; //Array da popolare con i dati trovati, da passare alla funzione di stampa
        data.find("item").each(function(i) {
            if (i === MAX_COMMIT_COUNT) {
                return false;
            }
            var $this = $(this);
            found[i] = {
                title: $this.find("title").text(),
                pubDate: new Date($this.find("pubDate").text()),
                author: $this.find("author").text().split(" <")[0]
            };
        });
        printFunction(found);
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

    $.get(urlCommit, fetchGit(parseCommit, printCommit));
    $.get(urlBranch, fetchGit(parseBranch, printBranch));
};