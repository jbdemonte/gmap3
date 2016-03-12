describe('plugin', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('should start a gmap3 chain', function () {
    expect(this.$element.length).to.be.equal(1);
    expect(this.handler).to.be.an('object');
    expect(this.handler).not.to.be.an.instanceof(jQuery);
  });

  it('should allow to chain jQuery', function () {
    expect(this.handler.$).to.be.an.instanceof(jQuery);
    expect(this.handler.$).to.be.equal(this.$element);
  });

  it('should handle multiple elements', function (done) {
    this.$element = jQuery('<div></div><div></div><div></div>');
    this.handler = this.$element.gmap3({});
    expect(this.$element.length).to.be.equal(3);
    expect(this.handler).to.be.an('object');
    expect(this.handler).not.to.be.an.instanceof(jQuery);

    var maps = [];

    this.handler
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        maps.push(map);
      })
      .then(function () {
        expect(maps.length).to.be.equal(3);
        // check that all maps are differents one
        expect(maps[0]).not.to.be.equal(maps[1]);
        expect(maps[0]).not.to.be.equal(maps[2]);
        expect(maps[1]).not.to.be.equal(maps[2]);
        done();
      });

  });

});