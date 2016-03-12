describe('route', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would proceed to route resolution', function (done) {
    this.handler
      .route({
        origin:"48 Pirrama Road, Pyrmont NSW",
        destination:"Bondi Beach, NSW",
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      })
      .then(function (result) {
        expect(result.status).to.be.equal('OK');
        expect(result.routes).to.be.an('array');
        expect(this.get(1)).to.be.equal(result);
        done();
      });
  });

});