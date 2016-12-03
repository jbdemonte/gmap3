describe('latlng', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3();
    this.handler.wait(500).then(function () {done();});
  });

  it('would resolve the address', function (done) {
    this.handler
      .latlng({address: '5 Rue Bellevue, 83910 Pourrières'})
      .then(function (latlng) {
        expect(latlng).to.be.an.instanceof(google.maps.LatLng);
        expect(latlng.lat()).to.be.closeTo(43.5, 0.1);
        expect(latlng.lng()).to.be.closeTo(5.7, 0.1);
        done();
      });
  });

  it('would handle latlng fail', function (done) {
    this.handler
      .latlng({address: '>>>>>'})
      .then(function () {
        done(new Error('error expected'));
      })
      .catch(function (err) {
        expect(err).to.be.equal('ZERO_RESULTS');
        done();
      });
  });

  it('would convert the position as array', function (done) {
    this.handler
      .latlng({latlng: [10,20]})
      .then(function (latlng) {
        expect(latlng).to.be.an.instanceof(google.maps.LatLng);
        expect(latlng.lat()).to.be.equal(10);
        expect(latlng.lng()).to.be.equal(20);
        done();
      });
  });

  it('would not modify position as literal object', function (done) {
    var position = {lat: 10, lng: 20};
    this.handler
      .latlng({latlng: position})
      .then(function (latlng) {
        expect(latlng).not.to.be.equal(position);
        expect(latlng.lat).to.be.equal(10);
        expect(latlng.lng).to.be.equal(20);
        done();
      });
  });
});