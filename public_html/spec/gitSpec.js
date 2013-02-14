/* 
 * This spec tests the parsing logic of git.js
 * It also tests the correct behavior of the fetching logic
 * in case of server malfunction.
 */
describe("Git request", function() {
    describe("If response status is \"success\"", function() {
        var commitData;
        var branchData;
        
        beforeEach(function() {
            commitData = $.parseXML('<?xml version="1.0" encoding="utf-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><item><title>Rimosso il cachetime dalla DownloadResource.</title><author>Federico Russo &lt;russo.federico@anteash.com&gt;</author><pubDate>Fri, 8 Feb 2013 07:35:11 +0000</pubDate></item></rss>');
            
            branchData = $.parseXML('<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-US" lang="en-US"><body><table class="heads"><tr class="dark"><td><i>3 hours ago</i></td><td><a class="list name" href="/?p=bbox.git;a=shortlog;h=refs/heads/develop">develop</a></td><td class="link"><a href="/?p=bbox.git;a=shortlog;h=refs/heads/develop">shortlog</a> | <a href="/?p=bbox.git;a=log;h=refs/heads/develop">log</a> | <a href="/?p=bbox.git;a=tree;h=refs/heads/develop;hb=refs/heads/develop">tree</a></td></tr></table></body></html>');
        });

        it("should transform data's array into object", function() {
            parseCommit($(commitData), function(parsedData) {
                expect(parsedData[0].title).toEqual("Rimosso il cachetime dalla DownloadResource.");
                expect(parsedData[0].author).toEqual("Federico Russo");
                expect(parsedData[0].pubDate).toEqual(new Date("Fri, 8 Feb 2013 07:35:11 +0000"));
            });
            parseBranch($(branchData), function(parsedData) {
                expect((parsedData[0].name).text()).toEqual("develop");
                expect((parsedData[0].date).text()).toEqual("3 ore fa");
            });
        });
    });

    describe("If response status isn't \"success\"", function() {
        it("should return the status.", function() {
            var gitFetch = fetchGit();
            expect(gitFetch("dummy data", "failed")).toEqual("failed");
        });
    });
});