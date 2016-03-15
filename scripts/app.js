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
          items.sort(function (a, b) {
            return a.name < b.name ? -1 : 1;
          });
        }
      }
    };
  })

  .directive('item', function () {
    return {
      restrict: 'E',
      require: '^params',
      link: function (scope, element, attrs, ctrl) {
        var item = {
          name: attrs.name,
          types: (attrs.type || '').split(','),
          optional: 'optional' in attrs,
          doc: attrs.doc,
          contents: '<p>' + element.html() + '</p>' +
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

;