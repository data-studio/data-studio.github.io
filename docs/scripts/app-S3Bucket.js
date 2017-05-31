(function (myApp) {
  
  "use strict";
  
  myApp.factory("S3Bucket", S3BucketFactory);

  S3BucketFactory.$inject = ["$http", "S3_DOC_ROOT", "S3Object"];
  function S3BucketFactory (  $http,   S3_DOC_ROOT,   S3Object) {

    const AWS_S3_HOST = "s3.amazonaws.com";
    const LIST_BUCKET = "LIST_BUCKET";

    return function S3Bucket (bucketName) {

      var s3BucketHost = [bucketName, AWS_S3_HOST].join(".");

      Object.defineProperties(this, {
        bucketName: {
          value: bucketName,
        },
        bucketBaseUrl: {
          value: url("", ""),
        },
        bucketListUrl: {
          value: url(LIST_BUCKET, ""),
        },
      });

      this.fetchRoot = function () {
        return this.ls("latest/");
      };

      this.fetch = function (prefix) {
        return this.ls("latest/" + prefix);
      };

      this.fetchObject = function (path) {
        let s3Object = new S3Object(url("", "pub/doc/latest/" + path));
        return s3Object.fetch();
      };

      this.ls = function (prefix) {
        prefix = prefix || "";
        prefix = "pub/doc/" + prefix;
        return new Promise((resolve, reject) => {
          $http.get(url(LIST_BUCKET, prefix))
            .then(function (res) {
              res.data = res.data.replace(/(pub\/doc\/latest\/)/gm, '');
              resolve(res);
            }, reject);
        });
      };

      function url (reqType, path) {

        var query;
        var pathParts;

        var pathInUri = true;

        var uri = "https://" + s3BucketHost + "/";
        var queryParts = [];

        path = path || "";
        pathParts = path.split(/\//g);

        if (LIST_BUCKET === reqType) {
          pathInUri = false;
          queryParts = [
            "list-type=2",
            "delimiter=/",
            "prefix=" + path
          ];
        }

        if (pathInUri) {
          uri = uri + pathParts.join("/");
        }

        query = queryParts.length > 0
          && "?" + queryParts.join('&')
          || "";

        return uri + query;

      }

    };

  }
  
})(window.myApp);
