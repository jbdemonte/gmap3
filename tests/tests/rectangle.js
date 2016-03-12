describe('rectangle', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [40.76, -73.9495], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {bounds: [40.780, -73.932, 40.742, -73.967], a: 123};
    this.handler
      .rectangle(options)
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(rectangle.a).to.be.equal(123);
        expect(options).to.eql({bounds: [40.780, -73.932, 40.742, -73.967], a: 123});
        expect(this.get(1)).to.be.equal(rectangle);
        done();
      });
  });

  it('would convert the bound as array', function (done) {
    this.handler
      .rectangle({bounds: [40.780, -73.932, 40.742, -73.967]})
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.getMap()).to.be.an.instanceof(google.maps.Map);
        var bounds = rectangle.getBounds();
        expect(bounds.getNorthEast().lat()).to.be.closeTo(40.780, 0.01);
        expect(bounds.getNorthEast().lng()).to.be.closeTo(-73.932, 0.01);
        expect(bounds.getSouthWest().lat()).to.be.closeTo(40.742, 0.01);
        expect(bounds.getSouthWest().lng()).to.be.closeTo(-73.967, 0.01);
        done();
      });
  });

  it('would modify bounds as literal object', function (done) {
    var bounds = {north:40.780, east:-73.932, south:40.742, west:-73.967};
    this.handler
      .rectangle({bounds: bounds})
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.getMap()).to.be.an.instanceof(google.maps.Map);
        var bounds = rectangle.getBounds();
        expect(bounds.getNorthEast().lat()).to.be.closeTo(40.780, 0.01);
        expect(bounds.getNorthEast().lng()).to.be.closeTo(-73.932, 0.01);
        expect(bounds.getSouthWest().lat()).to.be.closeTo(40.742, 0.01);
        expect(bounds.getSouthWest().lng()).to.be.closeTo(-73.967, 0.01);
        done();
      });
  });

  it('would not modify the bounds as google.maps.LatLngBounds object', function (done) {
    var bounds = new google.maps.LatLngBounds({lat: 40.742, lng: -73.967}, {lat: 40.780, lng: -73.932});
    this.handler
      .rectangle({bounds: bounds})
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(rectangle.getBounds()).to.equal(bounds);
        expect(bounds.getNorthEast().lat()).to.be.closeTo(40.780, 0.01);
        expect(bounds.getNorthEast().lng()).to.be.closeTo(-73.932, 0.01);
        expect(bounds.getSouthWest().lat()).to.be.closeTo(40.742, 0.01);
        expect(bounds.getSouthWest().lng()).to.be.closeTo(-73.967, 0.01);
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .rectangle()
      .then(function (rectangle) {
        previous = rectangle;
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.getMap()).to.be.an.instanceof(google.maps.Map);
      })
      .rectangle()
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(rectangle).not.to.be.equal(previous);
        done();
      });
  });

});