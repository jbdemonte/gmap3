describe('latlng', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3();
  });

  it('would resolve the address', function (done) {
    this.handler
      .latlng({address: '100,200'})
      .then(function (latlng) {
        expect(latlng).to.be.an.instanceof(google.maps.LatLng);
        expect(latlng.lat()).to.be.equal(100);
        expect(latlng.lng()).to.be.equal(200);
        done();
      });
  });

  it('would convert the position as array', function (done) {
    this.handler
      .latlng({latlng: [100,200]})
      .then(function (latlng) {
        expect(latlng).to.be.an.instanceof(google.maps.LatLng);
        expect(latlng.lat()).to.be.equal(100);
        expect(latlng.lng()).to.be.equal(200);
        done();
      });
  });

  it('would not modify position as literal object', function (done) {
    var position = {lat: 100, lng: 200};
    this.handler
      .latlng({latlng: position})
      .then(function (latlng) {
        expect(latlng).not.to.be.equal(position);
        expect(latlng.lat).to.be.equal(100);
        expect(latlng.lng).to.be.equal(200);
        done();
      });
  });

  it('would handle multiples items with multiple address resolutions', function (done) {
    var latlngs = [];
    this.handler
      .latlng([
        {address: '1,2'},
        {address: '3,4'},
        {address: '5,6'}
      ])
      .then(function (items) {
        expect(items.length).to.be.equal(3);

        items.forEach(function (latlng, index) {
          expect(latlng).to.be.an.instanceof(google.maps.LatLng);
          expect(latlng.lat()).to.be.equal(1 + 2 * index);
          expect(latlng.lng()).to.be.equal(2 + 2 * index);
        });

        done();
      })
  });

});