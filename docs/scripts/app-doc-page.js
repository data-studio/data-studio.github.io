
(function (myApp, angular) {
  
  "use strict";
  
  myApp.directive("docPage", docPageDirective);

  docPageDirective.$inject = ["S3Object", "$compile"];
  function docPageDirective (  S3Object,   $compile) {
        
    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
      },
      link: function ($scope, element, attrs, controllers) {
                
        $scope.$watch('ngModel', function (newValue) {
          var newEl = angular.element('<div>' + newValue + '</div>');
          element.append(newEl);
          $compile(newEl)($scope);
        });
        
      },
      template: '<div>Meow</div>'
    };
  }
  
})(window.myApp, window.angular);
