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
            var date = new Date(arrayEvents[i].start.dateTime).toLocaleDateString();
            var startTime = arrayEvents[i].start.dateTime.substr(11, 8);
            var endTime = arrayEvents[i].end.dateTime.substr(11, 8);
            $("#calendarUl").append("<li>" + date + " Dalle " + startTime + " alle " +
                    endTime + " : " + summary + "</li>");
        } else {
            var startDate = new Date(arrayEvents[i].start.date).toLocaleDateString();
            var endDate = new Date(arrayEvents[i].end.date).toLocaleDateString();
            if (startDate === endDate) {
                $("#calendarUl").append("<li>" + startDate + " : " + summary + "</li>");
            } else {
                $("#calendarUl").append("<li>Dal " + startDate + " al " + endDate + " : " +
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
            'fields': 'items(summary,start,end)',
            'orderBy': 'startTime',
            'singleEvents': 'true'
        });
        request.execute(function(response) {
            var items = response.items;
            if (items) {
                if (items.length >= 5) {
                    appendEvents(items, 5);
                } else {
                    appendEvents(items, items.length);
                }
            }
        });

    });
}
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    authorizeClient();
}