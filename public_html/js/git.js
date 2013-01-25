/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$.get(gitUrl, function(data) {
    var $xml = $(data);
    $xml.find("item").each(function(index) {
        var $this = $(this);
        var item = {
            title: $this.find("title").text(),
            pubDate: new Date($this.find("pubDate").text()),
            author: $this.find("author").text().split(" <")[0]
        };
        $("#gitDiv").append("<blockquote><p>" + item.title + "</p>" + "<small>" +
                item.author + " il " + item.pubDate.toLocaleString() + ".</small></blockquote>");
        if (index === 4) {
            return false;
        }
    });
});

$.get(gitWebUrl, function(result) {
    var $data = $(result);
    var found = [];
    var i = 0;
    $data.find("tr").each(function(index) {
        var $this = $(this);
        $this.find("td").each(function(index) {
            var $this = $(this);
            if (index === 0) {
                found[i] = $this;
                found[i].text(found[i].text().replace("months","mesi"));
                found[i].text(found[i].text().replace("month","mese"));
                found[i].text(found[i].text().replace("weeks","settimane"));
                found[i].text(found[i].text().replace("week","settimana"));
                found[i].text(found[i].text().replace("hours","ore"));
                found[i].text(found[i].text().replace("hour","ora"));
                found[i].text(found[i].text().replace("ago","fa"));
            }
            else {
                found[i + 1] = $this;
                i = i + 2;
                return false;
            }
        });
        if (index === 4) {
            return false;
        }
    });
    for (i = 0; i < found.length; i += 2) {
        $("#branchDiv").append("<blockquote><p>" + found[i + 1].text() + "</p><small>" + found[i].text() + "</small></blockquote>");
    }
});

