/* 
 * This js is the script test for google Calendar, it test if googleCalendar's 
 * logic works properly.
 */

describe("Google Calendar request", function() {
    describe("If response is a full day event", function() {
        it("Should transform the response into objects", function() {
            var calendarJson = $.parseJSON("{\"items\": [{\"summary\": \"Riepilogo\",\"start\": {\"date\": \"2013-02-11\"},\"end\": {\"date\": \"2013-02-15\"}}]}");
            expect(calendarJson.items[0].summary).toEqual("Riepilogo");
            var googleCallback = callbackGoogleRequest(function(googleEvent) {
                expect(googleEvent.summary).toEqual("Riepilogo");
                expect(googleEvent.startDate).toEqual(new Date("2013-02-11"));
                expect(googleEvent.endDate).toEqual(new Date("2013-02-15"));
            });
            googleCallback(calendarJson);
        });
    });
    describe("If response is a normal event", function() {
        it("Should transform the response into objects", function() {
            var calendarJson = $.parseJSON('{"items": [{"summary": "Riepilogo","start": {"dateTime": "2013-02-13T17:00:00+01:00"},"end": {"dateTime": "2013-02-13T18:00:00+01:00"}}]}');
            expect(calendarJson.items[0].summary).toEqual("Riepilogo");
            var googleCallback = callbackGoogleRequest(function(googleEvent) {
                expect(googleEvent.summary).toEqual("Riepilogo");
                expect(googleEvent.startDateTime).toEqual("2013-02-13T17:00:00+01:00");
                expect(googleEvent.date).toEqual("13/2/2013");
                expect(googleEvent.startTime).toEqual("17:00");
                expect(googleEvent.endTime).toEqual("18:00");
            });
            googleCallback(calendarJson);
        });
    });
});