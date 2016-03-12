describe('transitlayer', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [51.501904, -0.115871], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would create an instance', function (done) {
    this.handler
      .transitlayer()
      .then(function (layer) {
        expect(layer).to.be.an.instanceof(google.maps.TransitLayer);
        expect(layer.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(this.get(1)).to.be.equal(layer);
        done();
      });
  });

});