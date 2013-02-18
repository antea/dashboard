/* 
 * This js allows users authenticating with GoogleCalendarAPI and retrieving
 * informations about next five events of a specified calendar. To use this js
 * you must retrieve the apiKey and the clientId from the Google Api Console after 
 * registering your project
 */

var SCOPE = "https://www.googleapis.com/auth/calendar";
var ONGOING_EVENTS_DIV = "#OngoingEventsDiv";
var NEXT_EVENTS_DIV = "#NextEventsDiv";
var calendarCheck = Date.now();

/**
 * This function is used to authorize client to google api. Then it call 
 * makeNextEventsRequest.
 * 
 */
function authorizeClient() {
    var config = {
        'client_id': clientId,
        'scope': SCOPE
    };
    gapi.auth.authorize(config, function() {
        makeNextEventsRequest();
    });
}

/**
 *  This function is used to makes a request to google calendar api with a series of
 *  parameters. Then it call the callbackGoogleRequest.
 *  
 */
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
        request.execute(callbackGoogleRequest(putGoogleEventsIntoWell));
    });
}

/**
 * This function return a function that process an event's list and transform it in
 * a series of objects. Objects can be of two types depending on the duration of 
 * the event that contain
 * 
 * This function was made to separate logic from data retrieving,
 * and to test the logic one.
 * 
 * @param {function} appendGoogleToHtml : a function that explain what to do with
 * the obtained object.
 * 
 */
var callbackGoogleRequest = function(appendGoogleToHtml) {
    return function(response) {
        $(ONGOING_EVENTS_DIV).css("display", "block");//shows the div
        $(NEXT_EVENTS_DIV).css("display", "block");//shows the div
        clearDiv();
        calendarCheck = Date.now();//it contains the time of the last request
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
            if ($(ONGOING_EVENTS_DIV).find('div').length === 3) {
                $(ONGOING_EVENTS_DIV).css("display", "none");
            }
            if ($(NEXT_EVENTS_DIV).find('div').length === 3) {
                $(NEXT_EVENTS_DIV).css("display", "none");
            }
        }
    };
};

/**
 * This function is used to put into a Bootstrap's well the information passed into
 * parameter. It should stamp the event's time and date when the event take place.
 * If the event is an all-day event, it should stamp only the date.
 * If the event during more then one day, it stamps only the range of date.
 * 
 * @param {object} googleEvent : an object contain google calendar event
 */
function putGoogleEventsIntoWell(googleEvent) {
    if (googleEvent.startDateTime) {
        $(divWhereToAppend(googleEvent.startDateTime)).append("<div class=\"well well-small\"><h4>" +
                googleEvent.date + " dalle " + googleEvent.startTime + " alle " + googleEvent.endTime +
                "</h4><blockquote><h5>" + googleEvent.summary + "</h5></blockquote></div>");
    } else {
        if (googleEvent.startDate.getMonth() === googleEvent.endDate.getMonth() &&
                googleEvent.startDate.getDate() === googleEvent.endDate.getDate() - 1) {
            $(divWhereToAppend(googleEvent.startDate)).append("<div class=\"well well-small\"><h4>" +
                    googleEvent.startDate.toLocaleDateString() + "</br></h4><blockquote><h5>" +
                    googleEvent.summary + "</h5></blockquote></div>");
        } else {
            googleEvent.endDate.setDate(googleEvent.endDate.getDate() - 1);
            $(divWhereToAppend(googleEvent.startDate)).append("<div class=\"well well-small\"><h4>Dal " +
                    googleEvent.startDate.toLocaleDateString() + " al " + googleEvent.endDate.toLocaleDateString() +
                    "</h4><blockquote><h5>" + googleEvent.summary + "</h5></blockquote></div>");
        }
    }
}

/**
 * This function return the div where to append depending on whether an event is 
 * in progress or planning and depending on it's even or odd in its category.
 * 
 * @param {String} startDate A string representing the date to evaluate.
 * @returns {String} the div where to append.
 */
var divWhereToAppend = function(startDate) {
    var now = new Date();
    var date = new Date(startDate);
    if (date < now) {
        var divNum = $(ONGOING_EVENTS_DIV).find('div').length % 2;
        return ONGOING_EVENTS_DIV + divNum;
    } else {
        var divNum = $(NEXT_EVENTS_DIV).find('div').length % 2;
        return NEXT_EVENTS_DIV + divNum;
    }
};

/**
 * Clear all the div.
 */
var clearDiv = function() {
    $(ONGOING_EVENTS_DIV + "0").empty();
    $(ONGOING_EVENTS_DIV + "1").empty();
    $(NEXT_EVENTS_DIV + "0").empty();
    $(NEXT_EVENTS_DIV + "1").empty();
};