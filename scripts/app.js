angular.module('project', ['Snippets', 'SnippetsThemeBootstrapButtons'])

  .config(function(snippetsProvider) {
    snippetsProvider.content.before(
      "<snippets-pane snippet='" + angular.toJson({
        name: 'Run',
        icon: 'fa fa-cog',
        cls: 'pull-right',
        run: true
      }) + "'><iframe ng-if='current.snippet.run' ng-src='{{trustSrc(path)}}'></iframe></snippets-pane>"
    );
  })

  .controller('MyCtrl', function ($scope, $sce) {
      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      };
  })

  .filter('safe', ['$sce', function($sce){
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }])

  .directive('params', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: 'partials/params.html',
      controller: function($scope) {
        var items = $scope.items = [];
        this.add = function(item) {
          items.push(item);
        }
      }
    };
  })

  .directive('methods', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: 'partials/methods.html',
      controller: function($scope) {
        var items = $scope.items = [];
        this.add = function(item) {
          items.push(item);
        }
      }
    };
  })

  .directive('item', function () {
    return {
      restrict: 'E',
      require: ['^?params', '^?methods'],
      link: function (scope, element, attrs, ctrls) {
        var ctrl = ctrls[0] || ctrls[1];
        var item = {
          name: attrs.name,
          types: (attrs.type || '').split(','),
          optional: 'optional' in attrs,
          doc: attrs.doc,
          contents: '<p>' +
                      ('return' in attrs ? '<strong> Return Value: ' + attrs.return + '</strong></br />' : '') +
                      element.html() +
                    '</p>' +
                    ('default' in attrs ? '<p class="default"> default = <em>' + attrs.default + '</em></p>' : '') +
                    ('example' in attrs ? '<p class="example"> e.g. <em>' + attrs.example + '</em></p>' : '')
        };
        element.remove();
        ctrl.add(item);
      }
    };
  })

  .directive('doc', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        var item = element.html();
        element.html('<a href="https://developers.google.com/maps/documentation/javascript/reference#' + (attrs.to || item) + '" target="_blank">' + (attrs.to ? item :  'google.maps.' + item) + '</a>');
      }
    };
  })

  .directive('donator', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: true,
      templateUrl: 'partials/donator.html',
      link: function (scope, element, attrs) {
        scope.img = attrs.img;
        scope.url = attrs.url;
        scope.author = attrs.author;
      }
    };
  })

  .directive('version', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.append('<version>new in v' + attrs.version + '</version>');
      }
    };
  })

;