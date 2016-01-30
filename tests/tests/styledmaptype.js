describe('styledmaptype', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    var styles = {b: 456};
    this.handler
      .styledmaptype('style1', styles, options)
      .then(function (style) {
        expect(style).to.be.an.instanceof(google.maps.StyledMapType);
        expect(style.__data.options.a).to.be.equal(123);
        expect(style.__data.styles.b).to.be.equal(456);
        expect(options).to.deep.equal( {a: 123});
        expect(styles).to.deep.equal( {b: 456});
        expect(this.get(1)).to.be.equal(style);
        expect(this.get(0).__data.__mapTypes[0].id).to.be.equal('style1');
        expect(this.get(0).__data.__mapTypes[0].styles).to.be.equal(style);
        done();
      });
  });

});