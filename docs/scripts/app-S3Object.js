(function (myApp) {
  
  "use strict";
  
  myApp.factory("S3Object", S3ObjectFactory);

  S3ObjectFactory.$inject = ["$http"];
  function S3ObjectFactory (  $http) {

    return function S3Object (url) {

      this.d = {
        Content: "",
      };

      this.fetch = function () {
        return new Promise((resolve, reject) => {
          fetchS3Object(url)
            .then((res) => {
              Object.assign(this.d, { Content: res.data });
              resolve(this);
            }, reject);
        });
      };

    };

    function fetchS3Object (url) {
      return $http.get(url);
    }

  }
  
})(window.myApp);
