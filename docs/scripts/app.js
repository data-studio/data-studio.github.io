(function (window, angular) {
  
  "use strict";
  
  var myApp = angular.module("MyApp", ["ngMaterial"]);
  
  myApp
    .constant("DOCS_BUCKET_NAME", "data-studio")
    .constant("S3_DOC_ROOT", "pub/doc/latest/");

  window.myApp = myApp;
  
})(window, angular);
