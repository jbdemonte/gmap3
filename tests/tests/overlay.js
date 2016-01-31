describe('overlay', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
  });

  it('would resolve the address', function (done) {
    this.handler
      .overlay({address: '100,200', content: '--content--'})
      .then(function (overlay) {
        expect(overlay).to.be.an.instanceof(google.maps.OverlayView);
        expect(overlay.getPosition().lat()).to.be.equal(100);
        expect(overlay.getPosition().lng()).to.be.equal(200);
        expect(overlay.$.html()).to.be.equal('--content--');
        done();
      });
  });

  it('would convert the position as array', function (done) {
    this.handler
      .overlay({position: [100,200], content: '--content--'})
      .then(function (overlay) {
        expect(overlay).to.be.an.instanceof(google.maps.OverlayView);
        expect(overlay.getPosition().lat()).to.be.equal(100);
        expect(overlay.getPosition().lng()).to.be.equal(200);
        expect(overlay.$.html()).to.be.equal('--content--');
        done();
      });
  });

  it('would not modify position as literal object', function (done) {
    var position = {lat: 100, lng: 200};
    this.handler
      .overlay({position: position, content: '--content--'})
      .then(function (overlay) {
        expect(overlay).to.be.an.instanceof(google.maps.OverlayView);
        expect(overlay.getPosition()).to.deep.equal({lat: 100, lng: 200});
        expect(overlay.$.html()).to.be.equal('--content--');
        done();
      });
  });

  it('would not modify the position as google.maps.LatLng object', function (done) {
    var position = new google.maps.LatLng(100, 200);
    this.handler
      .overlay({position: position, content: '--content--'})
      .then(function (overlay) {
        expect(overlay).to.be.an.instanceof(google.maps.OverlayView);
        expect(overlay.getPosition()).to.equal(position);
        expect(overlay.$.html()).to.be.equal('--content--');
        done();
      });
  });

  it('would resolve the address', function (done) {
    this.handler
      .overlay({bounds: [1,2,3,4], content: '--content--'})
      .then(function (overlay) {
        expect(overlay).to.be.an.instanceof(google.maps.OverlayView);
        var bounds = overlay.getBounds();
        expect(bounds).to.be.an.instanceof(google.maps.LatLngBounds);
        expect(bounds.ne().lat).to.be.equal(1);
        expect(bounds.ne().lng).to.be.equal(2);
        expect(bounds.sw().lat).to.be.equal(3);
        expect(bounds.sw().lng).to.be.equal(4);
        expect(overlay.$.html()).to.be.equal('--content--');
        done();
      });
  });

});