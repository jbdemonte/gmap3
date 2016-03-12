describe('fit', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [40.76, -73.9495], zoom: 16});
    this.handler.wait(500).then(function () {done();});
  });

  it('should handle infowindows', function (done) {
    var map, infowindow;
    this.handler
      .infowindow({position: [40, -73], content: 'YES'})
      .then(function (_infowindow) {
        map = this.get(0);
        infowindow = _infowindow;
        infowindow.open(map);
      })
      // infowindow auto center the map, so, we wait a while then recenter the map to test the fit
      .wait(1000)
      .then(function () {
        map.setCenter(new google.maps.LatLng(40.76, -73.9495));
        map.setZoom(16);
      })
      .wait(500)
      .then(function () {
        expect(map.getCenter().lat()).to.be.closeTo(40.76, 0.001);
        expect(map.getCenter().lng()).to.be.closeTo(-73.9495, 0.001);
        expect(map.getZoom()).to.be.equal(16);
      })
      .fit()
      .wait(100) // have to wait to test real bounds after map update
      .then(function () {
        expect(map.getCenter().lat()).not.to.be.closeTo(40.76, 0.001);
        expect(map.getCenter().lng()).not.to.be.closeTo(-73.9495, 0.001);
        expect(map.getZoom()).not.to.be.equal(16);
        expect(map.getBounds().contains(infowindow.getPosition())).to.be.true;

        done();
      });
  });

  it('should handle all markers', function (done) {
    this.handler
      .marker({position: [40, -73]})
      .marker([
        {position: {lat: 41, lng: -72}},
        {position: [35, -50]},
        {position: new google.maps.LatLng(46, -100)}
      ])
      .fit()
      .wait(100) // have to wait to test real bounds after map update
      .then(function () {
        var map = this.get(0);
        var mapBounds = map.getBounds();
        expect(map.getZoom()).not.to.be.equal(16);

        var marker = this.get(1);
        expect(mapBounds.contains(marker.getPosition())).to.be.true;

        var markers = this.get(2);
        markers.forEach(function (marker) {
          expect(mapBounds.contains(marker.getPosition())).to.be.true;
        });
        done();
      });
  });

  it('should handle circles', function (done) {
    this.handler
      .circle({center: [35, -50], radius: 100000})
      .fit()
      .wait(100) // have to wait to test real bounds after map update
      .then(function () {
        var map = this.get(0);
        var mapBounds = map.getBounds();

        expect(map.getCenter().lat()).not.to.be.closeTo(40.76, 0.001);
        expect(map.getCenter().lng()).not.to.be.closeTo(-73.9495, 0.001);
        expect(map.getZoom()).not.to.be.equal(16);

        var circle = this.get(1);
        expect(mapBounds.contains(circle.getBounds().getNorthEast())).to.be.true;
        expect(mapBounds.contains(circle.getBounds().getSouthWest())).to.be.true;

        done();
      });
  });

  it('should handle rectangles', function (done) {
    this.handler
      .rectangle({bounds: [45, -74, 42, -75]})
      .fit()
      .wait(100) // have to wait to test real bounds after map update
      .then(function () {
        var map = this.get(0);
        var mapBounds = map.getBounds();

        expect(map.getCenter().lat()).not.to.be.closeTo(40.76, 0.001);
        expect(map.getCenter().lng()).not.to.be.closeTo(-73.9495, 0.001);
        expect(map.getZoom()).not.to.be.equal(16);

        var rectangle = this.get(1);
        expect(mapBounds.contains(rectangle.getBounds().getNorthEast())).to.be.true;
        expect(mapBounds.contains(rectangle.getBounds().getSouthWest())).to.be.true;

        done();
      });
  });

  it('should handle polygon', function (done) {
    this.handler
      .polygon({
        paths: [
          [46, -74],
          {lat: 43, lng: -78},
          [42, -75]
        ]
      })
      .fit()
      .wait(100) // have to wait to test real bounds after map update
      .then(function () {
        var map = this.get(0);
        var mapBounds = map.getBounds();

        expect(map.getCenter().lat()).not.to.be.closeTo(40.76, 0.001);
        expect(map.getCenter().lng()).not.to.be.closeTo(-73.9495, 0.001);
        expect(map.getZoom()).not.to.be.equal(16);

        expect(mapBounds.contains(new google.maps.LatLng(46, -74))).to.be.true;
        expect(mapBounds.contains(new google.maps.LatLng(43, -78))).to.be.true;
        expect(mapBounds.contains(new google.maps.LatLng(42, -75))).to.be.true;

        done();
      });
  });

  it('should handle polyline', function (done) {
    this.handler
      .polyline({
        path: [
          [46, -74],
          {lat: 43, lng: -78},
          [42, -75]
        ]
      })
      .fit()
      .wait(100) // have to wait to test real bounds after map update
      .then(function () {
        var map = this.get(0);
        var mapBounds = map.getBounds();

        expect(map.getCenter().lat()).not.to.be.closeTo(40.76, 0.001);
        expect(map.getCenter().lng()).not.to.be.closeTo(-73.9495, 0.001);
        expect(map.getZoom()).not.to.be.equal(16);

        expect(mapBounds.contains(new google.maps.LatLng(46, -74))).to.be.true;
        expect(mapBounds.contains(new google.maps.LatLng(43, -78))).to.be.true;
        expect(mapBounds.contains(new google.maps.LatLng(42, -75))).to.be.true;

        done();
      });
  });

});