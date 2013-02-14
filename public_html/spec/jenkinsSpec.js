/* 
 * This spec tests the parsing logic of jenkins.js
 * It also tests the correct behavior of the fetching logic
 * in case of server malfunction.
 */
describe("Jenkins request", function() {
    describe("If response status isn't \"success\"", function() {
        it("should return the status", function() {
            var jenkinsFetch = fetchJenkins();
            expect(jenkinsFetch("dummy data", "failed")).toEqual("failed");
        });
    });

    describe("If response status is \"success\"", function() {
        var jenkinsData;
        var jenkinsDateData;

        beforeEach(function() {
            jenkinsData = '{"assignedLabels":[{}],"mode":"NORMAL","nodeDescription":"the master Jenkins node","nodeName":"","numExecutors":1,"description":null,"jobs":[{"name":"name","url":"url","color":"blue"}],"overallLoad":{},"primaryView":{"name":"All","url":"http://dev.imc.bogus:8080/hudson/"},"quietingDown":false,"slaveAgentPort":0,"unlabeledLoad":{},"useCrumbs":false,"useSecurity":false,"views":[{"name":"All","url":"http://dev.imc.bogus:8080/hudson/"},{"name":"BlackBox builds","url":"http://dev.imc.bogus:8080/hudson/view/BlackBox%20builds/"},{"name":"Sonar builds","url":"http://dev.imc.bogus:8080/hudson/view/Sonar%20builds/"}]}';
            jenkinsDateData = '<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><title>BlackBox_develop #2264 (back to normal)</title><link type="text/html" href="http://dev.imc.bogus:8080/hudson/job/BlackBox_develop/2264/" rel="alternate"/><id>tag:hudson.dev.java.net,2008:http://dev.imc.bogus:8080/hudson/job/BlackBox_develop/</id><published>2013-02-13T14:46:55Z</published><updated>2013-02-13T14:46:55Z</updated></entry></feed>';
        });
        it ("should parse the data into an array", function(){
            $jenkinsData = $.parseJSON(jenkinsData);
            $jenkinsDateData = $($.parseXML(jenkinsDateData));
            parseJenkins($jenkinsData, $jenkinsDateData, function(parsedData){
                expect(parsedData[0].name).toEqual("name");
                expect(parsedData[0].state).toEqual("fermo");
                expect(parsedData[0].date).toEqual(new Date("2013-02-13T14:46:55Z"));
            });
        });
    });
});