describe('polygon', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {paths: [[46, -74], {lat: 43, lng: -78}, [42, -75]], a: 123};
    this.handler
      .polygon(options)
      .then(function (polygon) {
        expect(polygon).to.be.an.instanceof(google.maps.Polygon);
        expect(polygon.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(polygon.a).to.be.equal(123);
        expect(options).to.deep.equal({paths: [[46, -74], {lat: 43, lng: -78}, [42, -75]], a: 123});
        expect(this.get(1)).to.be.equal(polygon);
        done();
      });
  });

  it('would arrays, literal & latLng', function (done) {
    var latLng = new google.maps.LatLng(42, -75);
    this.handler
      .polygon({
        paths: [
          [46, -74],
          {lat: 43, lng: -78},
          latLng
        ]
      })
      .then(function (polygon) {
        expect(polygon).to.be.an.instanceof(google.maps.Polygon);
        expect(polygon.getMap()).to.be.an.instanceof(google.maps.Map);
        var paths = polygon.getPaths().getArray();
        expect(paths.length).to.be.equal(1);
        var path = paths[0].getArray();
        expect(path.length).to.be.equal(3);
        expect(path[0].lat()).to.eql(46);
        expect(path[0].lng()).to.eql(-74);
        expect(path[1].lat()).to.eql(43);
        expect(path[1].lng()).to.eql(-78);
        expect(path[2].lat()).to.eql(42);
        expect(path[2].lng()).to.eql(-75);
        expect(path[2]).to.be.equal(latLng);
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .polygon()
      .then(function (polygon) {
        previous = polygon;
        expect(polygon).to.be.an.instanceof(google.maps.Polygon);
        expect(polygon.getMap()).to.be.an.instanceof(google.maps.Map);
      })
      .polygon()
      .then(function (polygon) {
        expect(polygon).to.be.an.instanceof(google.maps.Polygon);
        expect(polygon.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(polygon).not.to.be.equal(previous);
        done();
      });
  });

});