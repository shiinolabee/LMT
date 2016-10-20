(function(){

	'use strict';

	angular.module('cereliApp').factory('CalendarConfigFactory', function(){}).config(function(calendarConfig) {
         
        calendarConfig.dateFormatter = 'moment'; //use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.

        calendarConfig.allDateFormats.moment.date.hour = 'HH:mm a'; //this will configure times on the day view to display in 24 hour format rather than the default of 12 hour

        calendarConfig.allDateFormats.moment.title.day = 'ddd D MMM'; //this will configure the day view title to be shorter

        calendarConfig.i18nStrings.weekNumber = 'Week {week}'; //This will set the week number hover label on the month view

        calendarConfig.displayAllMonthEvents = true; //This will display all events on a month view even if they're not in the current month. Default false.

        calendarConfig.showTimesOnWeekView = true; //Make the week view more like the day view, with the caveat that event end times are ignored.

        console.info('Loaded Calendar Config Successful');

    });

})();