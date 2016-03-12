describe('overlay', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would resolve the address', function (done) {
    this.handler
      .overlay({address: '5 Rue Bellevue, 83910 Pourrières', content: '--content--'})
      .then(function (overlay) {
        expect(overlay).to.be.an.instanceof(google.maps.OverlayView);
        expect(overlay.getPosition().lat()).to.be.closeTo(43.5, 0.1);
        expect(overlay.getPosition().lng()).to.be.closeTo(5.7, 0.1);
        expect(overlay.$.html()).to.be.equal('--content--');
        done();
      });
  });

  it('would convert the position as array', function (done) {
    this.handler
      .overlay({position: [10,20], content: '--content--'})
      .then(function (overlay) {
        expect(overlay).to.be.an.instanceof(google.maps.OverlayView);
        expect(overlay.getPosition().lat()).to.be.equal(10);
        expect(overlay.getPosition().lng()).to.be.equal(20);
        expect(overlay.$.html()).to.be.equal('--content--');
        done();
      });
  });

  it('would not modify position as literal object', function (done) {
    var position = {lat: 10, lng: 20};
    this.handler
      .overlay({position: position, content: '--content--'})
      .then(function (overlay) {
        expect(overlay).to.be.an.instanceof(google.maps.OverlayView);
        expect(overlay.getPosition().lat()).to.be.equal(10);
        expect(overlay.getPosition().lng()).to.be.equal(20);
        expect(position).to.eql({lat: 10, lng: 20});
        expect(overlay.$.html()).to.be.equal('--content--');
        done();
      });
  });

  it('would not modify the position as google.maps.LatLng object', function (done) {
    var position = new google.maps.LatLng(10, 20);
    this.handler
      .overlay({position: position, content: '--content--'})
      .then(function (overlay) {
        expect(overlay).to.be.an.instanceof(google.maps.OverlayView);
        expect(overlay.getPosition().lat()).to.be.equal(10);
        expect(overlay.getPosition().lng()).to.be.equal(20);
        expect(overlay.getPosition()).to.equal(position);
        expect(overlay.$.html()).to.be.equal('--content--');
        done();
      });
  });

  it('would handle bounds instead of position', function (done) {
    this.handler
      .overlay({bounds: [45, -74, 42, -75], content: '--content--'})
      .then(function (overlay) {
        expect(overlay).to.be.an.instanceof(google.maps.OverlayView);
        var bounds = overlay.getBounds();
        expect(bounds).to.be.an.instanceof(google.maps.LatLngBounds);
        expect(bounds.getNorthEast().lat()).to.be.equal(45);
        expect(bounds.getNorthEast().lng()).to.be.equal(-74);
        expect(bounds.getSouthWest().lat()).to.be.equal(42);
        expect(bounds.getSouthWest().lng()).to.be.equal(-75);
        expect(overlay.$.html()).to.be.equal('--content--');
        done();
      });
  });

});