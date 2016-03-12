describe('groundoverlay', function () {
  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [40.740, -74.18], zoom: 12});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    this.handler
      .groundoverlay('http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg', [40.773941,  -74.12544, 40.712216, -74.22655], options)
      .then(function (groundoverlay) {
        expect(groundoverlay).to.be.an.instanceof(google.maps.GroundOverlay);
        expect(groundoverlay.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(groundoverlay.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});

        expect(groundoverlay.getUrl()).to.be.equal('http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg');
        var bounds = groundoverlay.getBounds();
        expect(bounds.getNorthEast().lat()).to.be.closeTo(40.773941, 0.001);
        expect(bounds.getNorthEast().lng()).to.be.closeTo(-74.12544, 0.001);
        expect(bounds.getSouthWest().lat()).to.be.closeTo(40.712216, 0.001);
        expect(bounds.getSouthWest().lng()).to.be.closeTo(-74.22655, 0.001);

        expect(this.get(1)).to.be.equal(groundoverlay);
        done();
      });
  });

  it('would modify bounds as literal object', function (done) {
    var bounds = {north: 40.773941, east: -74.12544, south: 40.712216, west: -74.22655};
    this.handler
      .groundoverlay('http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg', bounds, {})
      .then(function (groundoverlay) {
        expect(groundoverlay).to.be.an.instanceof(google.maps.GroundOverlay);
        expect(groundoverlay.getMap()).to.be.an.instanceof(google.maps.Map);

        expect(groundoverlay.getUrl()).to.be.equal('http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg');
        var bounds = groundoverlay.getBounds();
        expect(bounds.getNorthEast().lat()).to.be.closeTo(40.773941, 0.001);
        expect(bounds.getNorthEast().lng()).to.be.closeTo(-74.12544, 0.001);
        expect(bounds.getSouthWest().lat()).to.be.closeTo(40.712216, 0.001);
        expect(bounds.getSouthWest().lng()).to.be.closeTo(-74.22655, 0.001);

        expect(this.get(1)).to.be.equal(groundoverlay);
        done();
      });
  });


  it('would not modify the bounds as google.maps.LatLngBounds object', function (done) {
    var bounds = new google.maps.LatLngBounds({lat: 40.712216, lng: -74.22655}, {lat: 40.773941, lng: -74.12544});
    this.handler
      .groundoverlay('http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg', bounds, {})
      .then(function (groundoverlay) {
        expect(groundoverlay).to.be.an.instanceof(google.maps.GroundOverlay);
        expect(groundoverlay.getMap()).to.be.an.instanceof(google.maps.Map);

        expect(groundoverlay.getUrl()).to.be.equal('http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg');
        var bounds = groundoverlay.getBounds();
        expect(bounds.getNorthEast().lat()).to.be.closeTo(40.773941, 0.001);
        expect(bounds.getNorthEast().lng()).to.be.closeTo(-74.12544, 0.001);
        expect(bounds.getSouthWest().lat()).to.be.closeTo(40.712216, 0.001);
        expect(bounds.getSouthWest().lng()).to.be.closeTo(-74.22655, 0.001);
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .groundoverlay()
      .then(function (groundoverlay) {
        previous = groundoverlay;
        expect(groundoverlay).to.be.an.instanceof(google.maps.GroundOverlay);
        expect(groundoverlay.getMap()).to.be.an.instanceof(google.maps.Map);
      })
      .groundoverlay()
      .then(function (groundoverlay) {
        expect(groundoverlay).to.be.an.instanceof(google.maps.GroundOverlay);
        expect(groundoverlay.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(groundoverlay).not.to.be.equal(previous);
        done();
      });
  });
});