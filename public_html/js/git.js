/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var gitURL = 'http://gitweb.antea.bogus/?p=bbox.git;a=rss;h=refs/heads/develop';
$.get(gitURL, function(data) {
    var $xml = $(data);
    $xml.find("item").each(function(index) {
        var $this = $(this);
        var item = {
            title: $this.find("title").text(),
            pubDate: new Date($this.find("pubDate").text()),
            author: $this.find("author").text().split(" <")[0]
        };
        $("#gitDiv").append("<h3>" + item.title + "</h3>" + "<ul><li>Autore: " +
                item.author + "</li>" + "<li>In: " + item.pubDate.toLocaleString() + ".</li></ul>");
        //console.log(item.pubDate);
        if (index === 4) {
            return false;
        }
    });
});
$.get("http://gitweb/?p=bbox.git;a=heads", function(result) {
    var $data = $(result);
    $data.find("tr").each(function(index) {
        var $this = $(this);
        $this.find("td").each(function(index) {
            var $this = $(this);
            $("#branchDiv").append("<p>" + $this.text() + "</p>");
            if (index === 1) {
                return false;
            }
        });
        if (index === 4) {
            return false;
        }
    });
});

