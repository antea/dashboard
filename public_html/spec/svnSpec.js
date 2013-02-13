/* 
 * This js script tests svn.js' logic.
 */

describe("Subversion request", function() {
    describe("If server response isn't \"success\"", function() {
        it("Should return the status of the server response", function() {
            var svnCallback = callbackSvn(function(whatToDo) {
            });
            expect(svnCallback("dummyData", "failed")).toEqual("failed");
        });
    });
    describe('If server response is "success"', function() {
        it("Should transform xml data into objects", function() {
            var svnXml = $.parseXML("<rss version=\"2.0\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:atom=\"http://www.w3.org/2005/Atom\"><channel><item><pubDate>Tue, 12 Feb 2013 17:31:42 +0100</pubDate><dc:creator>Autore</dc:creator><title>LogDiSvn</title></item></channel></rss>");
            expect($(svnXml).find("item")[0].childNodes[1].textContent).toEqual("Autore");
            var svnCallback = callbackSvn(function(item) {
                expect(item.date).toEqual(new Date("Tue, 12 Feb 2013 17:31:42 +0100"));
                expect(item.author).toEqual("Autore");
                expect(item.log).toEqual("LogDiSvn");
            });
            svnCallback(svnXml, "success");
        });
    });
});