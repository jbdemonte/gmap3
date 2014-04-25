/**
 * Class OverlayView
 * @constructor
 */
function OverlayView(map, opts, latLng, $div) {
  var self = this,
    listeners = [];

  defaults.classes.OverlayView.call(self);
  self.setMap(map);

  self.onAdd = function () {
    var panes = self.getPanes();
    if (opts.pane in panes) {
      $(panes[opts.pane]).append($div);
    }
    $.each("dblclick click mouseover mousemove mouseout mouseup mousedown".split(" "), function (i, name) {
      listeners.push(
        gm.event.addDomListener($div[0], name, function (e) {
          $.Event(e).stopPropagation();
          gm.event.trigger(self, name, [e]);
          self.draw();
        })
      );
    });
    listeners.push(
      gm.event.addDomListener($div[0], "contextmenu", function (e) {
        $.Event(e).stopPropagation();
        gm.event.trigger(self, "rightclick", [e]);
        self.draw();
      })
    );
  };

  self.getPosition = function () {
    return latLng;
  };

  self.setPosition = function (newLatLng) {
    latLng = newLatLng;
    self.draw();
  };

  self.draw = function () {
    var ps = self.getProjection().fromLatLngToDivPixel(latLng);
    $div
      .css("left", (ps.x + opts.offset.x) + "px")
      .css("top", (ps.y + opts.offset.y) + "px");
  };

  self.onRemove = function () {
    var i;
    for (i = 0; i < listeners.length; i++) {
      gm.event.removeListener(listeners[i]);
    }
    $div.remove();
  };

  self.hide = function () {
    $div.hide();
  };

  self.show = function () {
    $div.show();
  };

  self.toggle = function () {
    if ($div) {
      if ($div.is(":visible")) {
        self.show();
      } else {
        self.hide();
      }
    }
  };

  self.toggleDOM = function () {
    self.setMap(self.getMap() ? null : map);
  };

  self.getDOMElement = function () {
    return $div[0];
  };
}
