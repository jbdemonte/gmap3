describe('trafficlayer', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [34.04924594193164, -118.24104309082031], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would create an instance', function (done) {
    this.handler
      .trafficlayer()
      .then(function (layer) {
        expect(layer).to.be.an.instanceof(google.maps.TrafficLayer);
        expect(layer.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(this.get(1)).to.be.equal(layer);
        done();
      });
  });

});