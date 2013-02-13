/* 
 * This js allows users authenticating with GoogleCalendarAPI and retrieving
 * informations about next five events of a specified calendar. To use this js
 * you must retrieve the apiKey and the clientId from the Google Api Console after 
 * registering your project
 */

var scope = "https://www.googleapis.com/auth/calendar";
var ongoingEventsDiv = "#OngoingEventsDiv";
var nextEventsDiv = "#NextEventsDiv";
var calendarCheck = Date.now();

function authorizeClient() {
    var config = {
        'client_id': clientId,
        'scope': scope
    };
    gapi.auth.authorize(config, function() {
        makeNextEventsRequest();
    });
}

function makeNextEventsRequest() {
    var now = new Date().toISOString();
    gapi.client.load('calendar', 'v3', function() {
        var request = gapi.client.calendar.events.list({
            'calendarId': calendarId,
            'timeMin': now,
            'maxResults': 6,
            'fields': 'items(summary,start,end)',
            'orderBy': 'startTime',
            'singleEvents': 'true'
        });
        request.execute(callbackGoogleRequest(appendGoogleEvents));
    });
}

var callbackGoogleRequest = function(appendGoogleToHtml) {
    return function(response) {
        $(ongoingEventsDiv).css("display", "block");
        $(nextEventsDiv).css("display", "block");
        clearDiv();
        calendarCheck = Date.now();
        var items = response.items;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].start.dateTime) {
                    var event = {
                        summary: items[i].summary,
                        startDateTime: items[i].start.dateTime,
                        date: new Date(items[i].start.dateTime).toLocaleDateString(),
                        startTime: items[i].start.dateTime.substr(11, 5),
                        endTime: items[i].end.dateTime.substr(11, 5)
                    };
                    appendGoogleToHtml(event);
                } else {
                    var event = {
                        summary: items[i].summary,
                        startDate: new Date(items[i].start.date),
                        endDate: new Date(items[i].end.date)
                    };
                    appendGoogleToHtml(event);
                }
            }
            if ($(ongoingEventsDiv).find('div').length === 3) {
                $(ongoingEventsDiv).css("display", "none");
            }
            if ($(nextEventsDiv).find('div').length === 3) {
                $(nextEventsDiv).css("display", "none");
            }
        }
    };
};

function appendGoogleEvents(googleEvent) {
    if (googleEvent.startDateTime) {
        $(eventState(googleEvent.startDateTime)).append("<div class=\"well well-small\"><h4>" +
                googleEvent.date + " dalle " + googleEvent.startTime + " alle " + googleEvent.endTime +
                "</h4><blockquote><h5>" + googleEvent.summary + "</h5></blockquote></div>");
    } else {
        if (googleEvent.startDate.getMonth() === googleEvent.endDate.getMonth() &&
                googleEvent.startDate.getDate() === googleEvent.endDate.getDate() - 1) {
            $(eventState(googleEvent.startDate)).append("<div class=\"well well-small\"><h4>" +
                    googleEvent.startDate.toLocaleDateString() + "</br></h4><blockquote><h5>" +
                    googleEvent.summary + "</h5></blockquote></div>");
        } else {
            googleEvent.endDate.setDate(googleEvent.endDate.getDate() - 1);
            $(eventState(googleEvent.startDate)).append("<div class=\"well well-small\"><h4>Dal " +
                    googleEvent.startDate.toLocaleDateString() + " al " + googleEvent.endDate.toLocaleDateString() +
                    "</h4><blockquote><h5>" + googleEvent.summary + "</h5></blockquote></div>");
        }
    }
}

var eventState = function(startDate) {
    var now = new Date();
    var date = new Date(startDate);
    if (date < now) {
        var divNum = $(ongoingEventsDiv).find('div').length % 2;
        return ongoingEventsDiv + divNum;
    } else {
        var divNum = $(nextEventsDiv).find('div').length % 2;
        return nextEventsDiv + divNum;
    }
};

var clearDiv = function() {
    $(ongoingEventsDiv + "0").empty();
    $(ongoingEventsDiv + "1").empty();
    $(nextEventsDiv + "0").empty();
    $(nextEventsDiv + "1").empty();
};