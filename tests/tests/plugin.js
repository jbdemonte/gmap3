describe('plugin', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
    this.handler.then(function () {
      done();
    });
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

  it('should allow to chain jQuery from most functions', function (done) {
    var self = this;
    var names = Object.keys(self.handler);
    expect(names.length).to.be.gt(0);
    names.forEach(function (name) {
      if (name !== 'get' && name !== '$') { // end return the jQuery chain
        expect(self.handler[name]()).to.be.equal(self.handler);
        expect(self.handler[name]().$).to.be.an.instanceof(jQuery);
        expect(self.handler[name]().$).to.be.equal(self.$element);
      }
    });
    self.handler.then(function () {
      done();
    });
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
        maps.push(map)
      })
      .then(function () {
        expect(maps.length).to.be.equal(3);
        // check that all maps are differents one
        expect(maps[0]).not.to.be.equal(maps[1]);
        expect(maps[0]).not.to.be.equal(maps[2]);
        expect(maps[1]).not.to.be.equal(maps[2]);
        done();
      })

  });

});