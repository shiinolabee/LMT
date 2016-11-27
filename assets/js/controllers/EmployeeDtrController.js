(function(){
	'use strict';

	var employeeDtrController = function( $scope,  $state, moment, $document ){

		var _self = this;		

		_self.dtrDataList = $state.params.dtrDataList;
		_self.selectedDates = $state.params.selectedDates;

		if ( _self.selectedDates ) {
			_self.selectedMonth = moment(_self.selectedDates.startsAt).format('MM');
			_self.selectedYear = moment(_self.selectedDates.startsAt).format('YYYY');			
		}
		
		$scope.employeeList = $state.params.employeeList;	

		// console.log($scope.employeeList, _self.dtrDataList);		

		$scope.getSelectedDatesDifference = function(){
			
			var difference = moment(_self.selectedDates.endsAt).diff(moment(_self.selectedDates.startsAt), 'days') + 1;			

            var days = Array.apply(0, Array(difference)).map(function (_, i) {            	            	
            	return { date : moment([_self.selectedYear, parseInt(_self.selectedMonth) - 1, i + 1]).format('YYYY-MM-DD') };
        	});	      

        	$scope.daysDifference = days;
		};

		$scope.getDtrList = function(){
			return _self.dtrDataList;
		};

		$scope.calculateTotalRenderedHours = function(){

		};

		$scope.generatePDF = function(){
		 	
		 	console.log("Converting to PDF has started.");

		 	$scope.showLoader = true;

		 	var doc = new jsPDF('l', 'mm', 'a4');
		    
		    var element = document.getElementById('htmlData');

		    html2canvas((element), {
		    	logging : true
		    }).then(function( canvas ) {

		    	$scope.showLoader = false;

	    	 	var imgData = canvas.toDataURL(
	                'image/png');

	            var d = new Date();
	            var n = d.toLocaleDateString();

	            doc.page = 1; // use this as a counter.

	            function footer() {

	                doc.setFontSize(8);
	                doc.text(185, 295, n); //print number bottom right
	                doc.page++;

	            };

	            var imgWidth = 280;
	            var pageHeight = 200;
	            var imgHeight = canvas.height * imgWidth / canvas.width;
	            var heightLeft = imgHeight;
	            var position = 0;
	            var positionDecrementor = 20;

	            doc.addImage(imgData, 'PNG', 25, 5, imgWidth, imgHeight);

	            footer();

	            heightLeft -= pageHeight;

	            while (heightLeft >= 0) {
	                position = heightLeft - imgHeight;
	            	// console.info(position);
	                doc.addPage();
	                doc.addImage(imgData, 'PNG', 25, (position - positionDecrementor), imgWidth, imgHeight);
	                footer();
	                heightLeft -= pageHeight;
	                positionDecrementor = positionDecrementor + 20;
	            }

	            doc.save('Employee-DTR-' + n +'.pdf');
		    });     	

		};

		$scope.getSelectedDatesDifference();

	};

	angular.module('cereliApp').controller('employeeDtrController', employeeDtrController);

	employeeDtrController.$inject = [ '$scope', '$state', 'moment', '$document' ];
})();