describe('map', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3();
  });

  it('would not modify options and return an instance attached to the element and based on options', function (done) {
    var options = {a: 123};
    this.handler
      .map(options)
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(map.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});
        done();
      });
  });

  it('would resolve the address', function (done) {
    this.handler
      .map({address: '100,200'})
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(map.__data.center).to.be.an.instanceof(google.maps.LatLng);
        expect(map.__data.center.lat()).to.be.equal(100);
        expect(map.__data.center.lng()).to.be.equal(200);
        done();
      });
  });

  it('would convert the center as array', function (done) {
    this.handler
      .map({center: [100,200]})
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(map.__data.center).to.be.an.instanceof(google.maps.LatLng);
        expect(map.__data.center.lat()).to.be.equal(100);
        expect(map.__data.center.lng()).to.be.equal(200);
        done();
      });
  });

  it('would not modify the center as literal object', function (done) {
    var center = {lat: 100, lng: 200};
    this.handler
      .map({center: center})
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(map.__data.center).not.to.equal(center); // should have clone the options object to not modify it
        expect(map.__data.center).to.deep.equal({lat: 100, lng: 200});
        done();
      });
  });

  it('would not modify the center as google.maps.LatLng object', function (done) {
    var center = new google.maps.LatLng(100, 200);
    this.handler
      .map({center: center})
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(map.__data.center).to.equal(center);
        expect(map.__data.center.lat()).to.be.equal(100);
        expect(map.__data.center.lng()).to.be.equal(200);
        done();
      });
  });

});