/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var gitUrl = 'http://git.antea.bogus/?p=bbox.git;a=rss;h=refs/heads/develop';
$.get(gitUrl, function(data) {
    var $xml = $(data);
    $xml.find("item").each(function(index) {
        var $this = $(this),
                item = {
        title: $this.find("title").text(),
                pubDate: new Date($this.find("pubDate").text()),
                author: $this.find("author").text().split(" <")[0]
        };
        $("#gitDiv").append("<h3>" + item.title + "</h3>" + "<ul><li>Autore: " +
                item.author + "</li>" + "<li>In: " + item.pubDate.toUTCString() + ".</li></ul>");
        //console.log(item.pubDate);
        if (index === 4) {
            return false;
        }
    });
});

