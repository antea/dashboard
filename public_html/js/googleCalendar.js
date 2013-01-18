/* 
 * This js allows users authenticating with GoogleCalendarAPI and retrieving
 * informations about next five events of a specified calendar. To use this js
 * you must retrieve the apiKey and the clientId from the Google Api Console after 
 * registering your project
 */

var scope = "https://www.googleapis.com/auth/calendar";

function authorizeClient() {
    var config = {
        'client_id': clientId,
        'scope': scope
    };
    gapi.auth.authorize(config, function() {
        makeNextEventsRequest();
    });
}

function appendEvents(arrayEvents, numberEvents) {
    for (var i = 0; i < numberEvents; i++) {
        var summary = arrayEvents[i].summary;
        if (arrayEvents[i].start.dateTime) {
            var date = arrayEvents[i].start.dateTime.substr(0, 10);
            var startTime = arrayEvents[i].start.dateTime.substr(11, 8);
            var endTime = arrayEvents[i].end.dateTime.substr(11, 8);
            $("#calendarUl").append("<li>" + date + " since " + startTime + " to " +
                    endTime + " : " + summary + "</li>");
        } else {
            var startDate = arrayEvents[i].start.date;
            var endDate = arrayEvents[i].end.date;
            if (startDate === endDate) {
                $("#calendarUl").append("<li>" + startDate + " : " + summary + "</li>");
            } else {
                $("#calendarUl").append("<li>Since " + startDate + " to " + endDate + " : " +
                        summary + "</li>");
            }
        }
    }
}

function makeNextEventsRequest() {
    var now = new Date().toISOString();
    gapi.client.load('calendar', 'v3', function() {
        var request = gapi.client.calendar.events.list({
            'calendarId': calendarId,
            'timeMin': now,
            'fields': 'items(summary,start,end)'
        });
        request.execute(function(response) {
            var items = response.items;
            if (items.length >= 5) {
                appendEvents(items, 5);
            } else {
                appendEvents(items, items.length);
            }
        });

    });
}
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    authorizeClient();
}