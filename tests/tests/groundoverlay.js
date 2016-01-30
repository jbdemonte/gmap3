describe('groundoverlay', function () {
  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    this.handler
      .groundoverlay('url', [1,2,3,4], options)
      .then(function (groundoverlay) {
        expect(groundoverlay).to.be.an.instanceof(google.maps.GroundOverlay);
        expect(groundoverlay.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(groundoverlay.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});

        expect(groundoverlay.__data.url).to.be.equal('url');
        expect(groundoverlay.__data.bounds).to.be.an.instanceof(google.maps.LatLngBounds);
        expect(groundoverlay.__data.bounds.ne().lat).to.be.equal(1);
        expect(groundoverlay.__data.bounds.ne().lng).to.be.equal(2);
        expect(groundoverlay.__data.bounds.sw().lat).to.be.equal(3);
        expect(groundoverlay.__data.bounds.sw().lng).to.be.equal(4);

        expect(this.get(1)).to.be.equal(groundoverlay);
        done();
      });
  });

  it('would modify bounds as literal object', function (done) {
    var bounds = {north: 1, east: 2, south: 3, west: 4};
    this.handler
      .groundoverlay('url', bounds, {})
      .then(function (groundoverlay) {
        expect(groundoverlay).to.be.an.instanceof(google.maps.GroundOverlay);
        expect(groundoverlay.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(groundoverlay.__data.bounds).to.be.an.instanceof(google.maps.LatLngBounds);
        expect(groundoverlay.__data.bounds.ne().lat).to.be.equal(1);
        expect(groundoverlay.__data.bounds.ne().lng).to.be.equal(2);
        expect(groundoverlay.__data.bounds.sw().lat).to.be.equal(3);
        expect(groundoverlay.__data.bounds.sw().lng).to.be.equal(4);
        done();
      });
  });

  it('would not modify the bounds as google.maps.LatLngBounds object', function (done) {
    var bounds = new google.maps.LatLngBounds({south: 3, west: 4}, {north: 1, east: 2});
    this.handler
      .groundoverlay('url', bounds, {})
      .then(function (groundoverlay) {
        expect(groundoverlay).to.be.an.instanceof(google.maps.GroundOverlay);
        expect(groundoverlay.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(groundoverlay.__data.bounds).to.equal(bounds);
        expect(groundoverlay.__data.bounds.ne().north).to.be.equal(1);
        expect(groundoverlay.__data.bounds.ne().east).to.be.equal(2);
        expect(groundoverlay.__data.bounds.sw().south).to.be.equal(3);
        expect(groundoverlay.__data.bounds.sw().west).to.be.equal(4);
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
        expect(groundoverlay.__data.map).to.be.an.instanceof(google.maps.Map);
      })
      .groundoverlay()
      .then(function (groundoverlay) {
        expect(groundoverlay).to.be.an.instanceof(google.maps.GroundOverlay);
        expect(groundoverlay.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(groundoverlay).not.to.be.equal(previous);
        done();
      })
  });

});