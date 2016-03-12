describe('bicyclinglayer', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [42.3726399, -71.1096528], zoom: 14});
    this.handler.wait(500).then(function () {done();});
  });

  it('would create an instance', function (done) {
    this.handler
      .bicyclinglayer()
      .then(function (layer) {
        expect(layer).to.be.an.instanceof(google.maps.BicyclingLayer);
        expect(layer.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(this.get(0)).to.be.equal(layer.getMap());
        expect(this.get(1)).to.be.equal(layer);
        done();
      });
  });

});