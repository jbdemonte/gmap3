describe('polyline', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {path: [[46, -74], {lat: 43, lng: -78}, [42, -75]], a: 123};
    this.handler
      .polyline(options)
      .then(function (polyline) {
        expect(polyline).to.be.an.instanceof(google.maps.Polyline);
        expect(polyline.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(polyline.a).to.be.equal(123);
        expect(options).to.deep.equal({path: [[46, -74], {lat: 43, lng: -78}, [42, -75]], a: 123});
        expect(this.get(1)).to.be.equal(polyline);
        done();
      });
  });

  it('would convert the position as array', function (done) {
    var latLng = new google.maps.LatLng(42, -75);
    this.handler
      .polyline({
        path: [
          [46, -74],
          {lat: 43, lng: -78},
          latLng
        ]
      })
      .then(function (polyline) {
        expect(polyline).to.be.an.instanceof(google.maps.Polyline);
        expect(polyline.getMap()).to.be.an.instanceof(google.maps.Map);
        var path = polyline.getPath().getArray();
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
      .polyline()
      .then(function (polyline) {
        previous = polyline;
        expect(polyline).to.be.an.instanceof(google.maps.Polyline);
        expect(polyline.getMap()).to.be.an.instanceof(google.maps.Map);
      })
      .polyline()
      .then(function (polyline) {
        expect(polyline).to.be.an.instanceof(google.maps.Polyline);
        expect(polyline.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(polyline).not.to.be.equal(previous);
        done();
      });
  });

});