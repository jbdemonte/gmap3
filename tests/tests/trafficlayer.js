describe('trafficlayer', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
  });

  it('would create an instance', function (done) {
    this.handler
      .trafficlayer()
      .then(function (layer) {
        expect(layer).to.be.an.instanceof(google.maps.TrafficLayer);
        expect(layer.__data.map).to.be.an.instanceof(google.maps.Map);
        done();
      });
  });

});