describe('directionsrenderer', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.$target = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    this.handler
      .directionsrenderer(options)
      .then(function (directionsrenderer) {
        expect(directionsrenderer).to.be.an.instanceof(google.maps.DirectionsRenderer);
        expect(directionsrenderer.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(directionsrenderer.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});
        expect(this.get(1)).to.be.equal(directionsrenderer);
        done();
      });
  });

  it('would not create anything if options is not defined', function (done) {
    this.handler
      .directionsrenderer()
      .then(function (directionsrenderer) {
        expect(directionsrenderer).to.be.an('undefined');
        expect(this.get().length).to.be.equal(2);
        expect(this.get(1)).to.be.an('undefined');
        done();
      });
  });

  it('would handle panel as jQuery object', function (done) {
    var self = this;
    var options = {panel: self.$target};
    this.handler
      .directionsrenderer(options)
      .then(function (directionsrenderer) {
        expect(directionsrenderer).to.be.an.instanceof(google.maps.DirectionsRenderer);
        expect(directionsrenderer.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(directionsrenderer.__data.panel).to.be.equal(self.$target.get(0));
        done();
      });
  });

  it('would handle panel as HTML node', function (done) {
    var self = this;
    var options = {panel: self.$target.get(0)};
    this.handler
      .directionsrenderer(options)
      .then(function (directionsrenderer) {
        expect(directionsrenderer).to.be.an.instanceof(google.maps.DirectionsRenderer);
        expect(directionsrenderer.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(directionsrenderer.__data.panel).to.be.equal(self.$target.get(0));
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .directionsrenderer({})
      .then(function (directionsrenderer) {
        previous = directionsrenderer;
        expect(directionsrenderer).to.be.an.instanceof(google.maps.DirectionsRenderer);
        expect(directionsrenderer.__data.map).to.be.an.instanceof(google.maps.Map);
      })
      .directionsrenderer({})
      .then(function (directionsrenderer) {
        expect(directionsrenderer).to.be.an.instanceof(google.maps.DirectionsRenderer);
        expect(directionsrenderer.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(directionsrenderer).not.to.be.equal(previous);
        done();
      })
  });

});