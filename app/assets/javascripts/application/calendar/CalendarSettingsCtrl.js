(function () {
  'use strict';
  angular.module('dtracker')
    .controller('CalendarSettingsCtrl', ['$scope', '$http',
      function ($scope, $http) {
      var calendarSettings = this;
      var times = $('.settings').data('slot-duration').split(":");
      var d = new Date();
      d.setHours( parseInt(times[0], 10) );
      d.setMinutes( parseInt(times[1], 10) );
      d.setSeconds( parseInt(times[2], 10));
      calendarSettings.slot_duration = d;
      calendarSettings.message = null;

      calendarSettings.setSlotDuration = function () {
        // 01:00:00
        // 60
        var slot_duration = moment(calendarSettings.slot_duration).format("HH:mm:ss");
        $http.put('/api/calendar_settings',
          { calendar_setting:
            {
              slot_duration: slot_duration
            }
          })
        .success(function(data, status, headers, config) {
          // Notify about success
          // Update attribute
          $('.settings').data('slot-duration', slot_duration);
          var times = slot_duration.split(':');
          var minutes = parseInt(times[0], 10) * 60 + parseInt(times[1], 10);
          $('.settings').data('schedule-interval', minutes);

          calendarSettings.message = {
            content: 'Time slot was updates successfully.',
            type: 'success'
          };
        })
        .error(function(data, status, headers, config) {
          calendarSettings.message = {
            content: 'Error happened during update.',
            type: 'error'
          };
        });
      };
    }]);
}());