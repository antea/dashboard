/* 
 * This js is the script test for redmine, it test if redmine's logic works properly.
 */

describe("Redmine request", function() {
    describe("If response status isn't \"success\"", function() {
        it("Should return the status of the server response", function() {
            var redmineCallback = callbackRedmineRequest(function(issue) {
            });
            expect(redmineCallback("dummyData", "failed")).toEqual("failed");
        });
    });
    describe("If response status is \"success\"", function() {
        it("Should transform data's array into objects", function() {
            var redmineJson = $.parseJSON("{\"issues\":[{\"id\":3226,\"project\":{\"id\":1,\"name\":\"ProjectName\"},\"tracker\":{\"id\":1,\"name\":\"Bug\"},\"status\":{\"id\":1,\"name\":\"Nuovo\"},\"priority\":{\"id\":7,\"name\":\"Immediata\"},\"author\":{\"id\":6,\"name\":\"Autore\"},\"assigned_to\":{\"id\":6,\"name\":\"Developer\"},\"subject\":\"Issue's subject.\",\"description\":\"Issue's description.\",\"start_date\":\"2013-02-08\",\"done_ratio\":0,\"created_on\":\"2013-02-08T16:57:31Z\",\"updated_on\":\"2013-02-08T16:57:31Z\"}],\"total_count\":219,\"offset\":0,\"limit\":1}");
            expect(redmineJson.issues[0].id).toEqual(3226);
            var redmineCallback = callbackRedmineRequest(function(testIssue) {
                expect(testIssue.nameDeveloper).toEqual("Developer");
                expect(testIssue.subject).toEqual("Issue's subject.");
                expect(testIssue.project).toEqual("ProjectName");
                expect(testIssue.priority).toEqual(7);
            });
            redmineCallback(redmineJson, "success");
        });
    });
});