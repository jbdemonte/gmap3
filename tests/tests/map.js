describe('map', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3(); // called empty, should not generate the map
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance attached to the element and based on options', function (done) {
    var options = {center: [37.772323, -122.214897], zoom: 13, a: 123};
    this.handler
      .then(function (previous) {
        expect(previous).to.be.undefined;
        expect(this.get()).to.eql([]);
      })
      .map(options)
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(map.a).to.be.equal(123);
        expect(options).to.deep.equal({center: [37.772323, -122.214897], zoom: 13, a: 123});
        expect(this.get(0)).to.be.equal(map);
        done();
      });
  });

  it('would resolve the address', function (done) {
    this.handler
      .map({address: '5 Rue Bellevue, 83910 Pourrières'})
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(map.getCenter().lat()).to.be.closeTo(43.5, 0.1);
        expect(map.getCenter().lng()).to.be.closeTo(5.7, 0.1);
        done();
      });
  });

  it('would convert the center as array', function (done) {
    this.handler
      .map({center: [10,20]})
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(map.getCenter().lat()).to.be.equal(10);
        expect(map.getCenter().lng()).to.be.equal(20);
        done();
      });
  });

  it('would not modify the center as literal object', function (done) {
    var center = {lat: 10, lng: 20};
    this.handler
      .map({center: center})
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(center).to.eql({lat: 10, lng: 20});
        expect(map.getCenter().lat()).to.be.equal(10);
        expect(map.getCenter().lng()).to.be.equal(20);
        done();
      });
  });

  it('would not modify the center as google.maps.LatLng object', function (done) {
    var center = new google.maps.LatLng(10, 20);
    this.handler
      .map({center: center})
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(map.getCenter()).to.be.equal(center);
        expect(map.getCenter().lat()).to.be.equal(10);
        expect(map.getCenter().lng()).to.be.equal(20);
        done();
      });
  });

});