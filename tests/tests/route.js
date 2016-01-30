describe('route', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
  });

  it('would proceed to route resolution', function (done) {
    this.handler
      .route({
        origin: [1, 2],
        destination: [3, 4]
      })
      .then(function (result) {
        expect(result.options.origin.lat()).to.be.equal(1);
        expect(result.options.origin.lng()).to.be.equal(2);
        expect(result.options.destination.lat()).to.be.equal(3);
        expect(result.options.destination.lng()).to.be.equal(4);
        expect(this.get(1)).to.be.equal(result);
        done();
      });
  });

});