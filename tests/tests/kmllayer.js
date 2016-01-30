describe('kmllayer', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    this.handler
      .kmllayer(options)
      .then(function (kmllayer) {
        expect(kmllayer).to.be.an.instanceof(google.maps.KmlLayer);
        expect(kmllayer.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(kmllayer.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});
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
        expect(kmllayer.__data.map).to.be.an.instanceof(google.maps.Map);
      })
      .kmllayer()
      .then(function (kmllayer) {
        expect(kmllayer).to.be.an.instanceof(google.maps.KmlLayer);
        expect(kmllayer.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(kmllayer).not.to.be.equal(previous);
        done();
      })
  });

});