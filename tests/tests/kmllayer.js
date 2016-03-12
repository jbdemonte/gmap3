describe('kmllayer', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [41.876, -87.624], zoom: 11});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {url: 'http://googlemaps.github.io/js-v2-samples/ggeoxml/cta.kml', a: 123};
    this.handler
      .kmllayer(options)
      .then(function (kmllayer) {
        expect(kmllayer).to.be.an.instanceof(google.maps.KmlLayer);
        expect(kmllayer.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(kmllayer.a).to.be.equal(123);
        expect(options).to.deep.equal({url: 'http://googlemaps.github.io/js-v2-samples/ggeoxml/cta.kml', a: 123});
        expect(this.get(1)).to.be.equal(kmllayer);
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .kmllayer()
      .then(function (kmllayer) {
        previous = kmllayer;
        expect(kmllayer).to.be.an.instanceof(google.maps.KmlLayer);
        expect(kmllayer.getMap()).to.be.an.instanceof(google.maps.Map);
      })
      .kmllayer()
      .then(function (kmllayer) {
        expect(kmllayer).to.be.an.instanceof(google.maps.KmlLayer);
        expect(kmllayer.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(kmllayer).not.to.be.equal(previous);
        done();
      });
  });

});