(function (myApp) {
  
  "use strict";
  
  myApp.controller("TabOne", TabOneController);

  TabOneController.$inject = ["$scope", "$timeout", "S3Bucket", "DOCS_BUCKET_NAME"];
  function TabOneController (  $scope,   $timeout,   S3Bucket,   DOCS_BUCKET_NAME) {

    var docstore = new S3Bucket(DOCS_BUCKET_NAME);

    $scope.visiblePage = "Meow";
    $scope.md = "Meow";
    
    $scope.title = docstore.bucketListUrl
      .replace("?", "\n  ?")
      .replace(/&/g, "\n  &");

    $scope.locations = [];
    $scope.niceLocations = [];
    $scope.prefixes = [];
    $scope.nicePrefixes = [];

    $scope.childrenOf = {};

    $scope.expanded = {};

    $scope.openDocPage = function (s3Object) {
      docstore.fetchObject(s3Object.original)
      	.then(function (res) {
          var converter = new showdown.Converter();
          var text = res.d.Content;
        	$timeout(function () {
          	$scope.visiblePage = text;
            $scope.md = text;
            console.log(text);
            console.log(converter.makeHtml(text));
          	// $scope.visiblePage = converter.makeHtml(text);
          });
        });
    };

    $scope.expand = function (prefix) {
      docstore.fetch(prefix.original)
        .then(function (res) {

          $scope.expanded[prefix.original] = true;

          var locations = pluckXmlEls(res.data, "Key");
          var niceLocations = locations.slice(0).map(function (value) {
            return {
              original: value,
              name: "index.md" === value && "About v1.0.0" 
                || value.substr(prefix.original.length).replace(/\_/g, " ").replace(/\.md$/, ""),
            };
          });
          var prefixes = pluckXmlEls(res.data, "Prefix");
          prefixes.slice(0);
          var nicePrefixes = prefixes.slice(0).map(function (value) {
            return {
              prefixes: [],
              locations: [],
              original: value,
              name: value.substr(prefix.original.length).substr(3)
                .replace(/\/$/, "")
                .replace(/\_/g, " "),
            };
          });

          $scope.childrenOf[prefix.original] = {
            locations: locations,
            niceLocations: niceLocations,
            prefixes: prefixes,
            nicePrefixes: nicePrefixes
          };

          $timeout(function () {
            prefix.locations.push(...niceLocations);
            prefix.prefixes.push(...nicePrefixes);
          });

        }).catch(function (err) {

        });
    };

    function pluckXmlEls (xmld, tagName) {

      var d = xmld.replace(/\>\</g, ">\n<");

      var tagOpen = '\<' + tagName + '\>';
      var tagClose = '\<\/' + tagName + '\>';

      var exprTargetElem = new RegExp(tagOpen + '(.+)' + tagClose, 'gm');
      var exprOpenTag = new RegExp('^' + tagOpen, '');
      var exprCloseTag = new RegExp(tagClose + '$', '');

      var cs = d.match(exprTargetElem).map(function (key) {
        return key.replace(exprOpenTag, '').replace(exprCloseTag, '');
      });

      return cs;

    }

    docstore.fetchRoot()
      .then(function (res) {

        var locations = pluckXmlEls(res.data, "Key");
        var niceLocations = locations.slice(0).map(function (value) {
          return {
            original: value,
            name: "index.md" === value && "About v1.0.0" 
              || value.replace(/\_/g, " ").replace(/\.md$/, ""),
          };
        });
        var prefixes = pluckXmlEls(res.data, "Prefix");
        var nicePrefixes = prefixes.slice(0).map(function (value) {
          return {
            prefixes: [],
            locations: [],
            original: value,
            name: value.substr(3)
              .replace(/\/$/, "")
              .replace(/\_/g, " "),
          };
        });

        $timeout(function () {

          $scope.niceLocations.push(...niceLocations);
          $scope.locations.push(...locations);

          $scope.nicePrefixes.push(...nicePrefixes);
          $scope.prefixes.push(...prefixes);

        });

      }).catch(function (err) {
        console.log(arguments[0]);
      	console.error(err);
      });

  }
  
})(window.myApp);
