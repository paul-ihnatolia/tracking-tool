(function () {
  "use strict";
  angular.module('dtracker')
    .controller('NewShipmentCtrl', ['$scope', '$rootScope','Shipment', 'CheckShipment', '$state',
      function ($scope, $rootScope, Shipment, CheckShipment, $state) {
      var newShipment = this;
      newShipment.shipment = {
        po: '',
        company: '',
        startDate: '',
        endDate: '',
        status: ''
      };

      newShipment.showShipmentForm = false;

      newShipment.avaliableStatuses = ["shipping", "receiving"];

      newShipment.createNewShipment = function () {
        var shipmentCal = {};
        var s = newShipment.shipment;
        shipmentCal.start = s.startDate;
        shipmentCal.title = s.po +
        ' - ' + s.company;
        shipmentCal.start = moment(s.startDate).format("YYYY-MM-DD HH:mm:ss z");
        shipmentCal.end = moment(s.startDate).add(s.timeElapsed, 'minutes').format("YYYY-MM-DD HH:mm:ss z");
        shipmentCal.allDay = false;
        // Contact to service
        if (CheckShipment.isOverlapping(shipmentCal)) {
          alert('New shipment is overlapping existing!');
        } else {
          // Call to the server
          var shipment = new Shipment({shipment: {start_date: shipmentCal.start,
                                                  end_date: shipmentCal.end,
                                                  po: s.po,
                                                  company: s.company,
                                                  status: s.status}});
          shipment.$save(
            function (data) {
              console.log(data);
              shipmentCal.color = data.shipment.status === "shipping" ? "#FF8C00" : "rgb(138, 192, 7)";
              shipmentCal.sid = data.shipment.id;
              $rootScope.$emit('addShipmentToCalendar', {shipment: shipmentCal});
              newShipment.shipment = {
                po: '',
                company: '',
                startDate: '',
                endDate: '',
                timeElapsed: ''
              };
              newShipment.showShipmentForm = false;
            },
            function (error) {
              alert("Some errors happened!");
            }
          );
        }
      };

      newShipment.showForm = function (e, data) {
        
        newShipment.shipment = {
          po: '',
          company: '',
          startDate: data.start,
          endDate: '',
          timeElapsed: data.interval
        };
      };

      $rootScope.$on('shipment:create', newShipment.showForm);
    }]);
}());