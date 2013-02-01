/* 
 * This js allows users authenticating with GoogleCalendarAPI and retrieving
 * informations about next five events of a specified calendar. To use this js
 * you must retrieve the apiKey and the clientId from the Google Api Console after 
 * registering your project
 */

var scope = "https://www.googleapis.com/auth/calendar";
var ongoingEventsDiv = "#OngoingEventsDiv";
var nextEventsDiv = "#NextEventsDiv";

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
    $(ongoingEventsDiv).css("display","block");
    $(nextEventsDiv).css("display","block");
    for (var i = 0; i < numberEvents; i++) {
        var summary = arrayEvents[i].summary;
        var startDateTime = arrayEvents[i].start.dateTime;
        if (startDateTime) {
            var date = new Date(startDateTime).toLocaleDateString();
            var startTime = startDateTime.substr(11, 8);
            var endTime = arrayEvents[i].end.dateTime.substr(11, 8);
            $(eventState(startDateTime)).append("<div class=\"well well-small\"><h4>" + date + "</h4><h4>Dalle " + startTime +
                    " alle " + endTime + "</h4><blockquote><h5>" + summary + "</h5></blockquote></div>");
        } else {
            var startDate = new Date(arrayEvents[i].start.date);
            var endDate = new Date(arrayEvents[i].end.date).toLocaleDateString();
            if (startDate === endDate) {
                $(eventState(startDate)).append("<div class=\"well well-small\"><h4>" + startDate.toLocaleDateString() +
                        "</h4><blockquote><h5>" + summary + "</h5></blockquote></div>");
            } else {
                $(eventState(startDate)).append("<div class=\"well well-small\"><h4>Dal " + startDate.toLocaleDateString() + 
                        " al " + endDate + "</h4><blockquote><h5>" + summary + "</h5></blockquote></div>");
            }
        }
    }
    if($(ongoingEventsDiv).find('div').length === 3){
        $(ongoingEventsDiv).css("display","none");
    }
    if($(nextEventsDiv).find('div').length === 3){
        $(nextEventsDiv).css("display","none");
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
var eventState = function(startDate) {
    var now = new Date();
    var date= new Date(startDate);
    if (date < now) {
        var divNum = $(ongoingEventsDiv).find('div').length%2;
        return ongoingEventsDiv+divNum;
    } else {
        var divNum = $(nextEventsDiv).find('div').length%2;
        return nextEventsDiv+divNum;
    }
};
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    authorizeClient();
}