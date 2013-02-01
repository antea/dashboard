/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

getGit = function() {
    $.get(gitUrl, function(data) {
        var $xml = $(data);
        $xml.find("item").each(function(index) {
            var $this = $(this);
            var item = {
                title: $this.find("title").text(),
                pubDate: new Date($this.find("pubDate").text()),
                author: $this.find("author").text().split(" <")[0]
            };
            $("#commitDiv").append("<blockquote><p>" + item.title + "</p>" + "<p><small>" +
                    item.author + " il " + item.pubDate.toLocaleString() + ".</p></small></blockquote>");
            if (index === 4) {
                return false;
            }
        });
    });

    $.get(gitWebUrl, function(result) {
        var $data = $(result);
        
        function branch() {
            this.name;
            this.date;
        }
        
        var found = [];
        //var i = 0;
        $data.find("tr").each(function(i) {
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
                else if (j === 1){
                    found[i].name = $this;
                    return false;
                }
            });
            if (i === 4) {
                return false;
            }
        });
        for (i = 0; i < found.length; i++) {
            $("#branchDiv").append("<blockquote><p>" + found[i].name.text() + "</p><p><small>" + found[i].date.text() + "</p></small></blockquote>");
        }
    });
};
