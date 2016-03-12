describe('directionsrenderer', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    this.$target = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element, this.$target);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {origin:[-33.8540399, 150.9893092], destination:[-33.9614565,151.2288193], travelMode: google.maps.DirectionsTravelMode.DRIVING, a: 123};
    this.handler
      .directionsrenderer(options)
      .then(function (directionsrenderer) {
        expect(directionsrenderer).to.be.an.instanceof(google.maps.DirectionsRenderer);
        expect(directionsrenderer.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(directionsrenderer.a).to.be.equal(123);
        expect(options).to.deep.equal({origin:[-33.8540399, 150.9893092], destination:[-33.9614565,151.2288193], travelMode: google.maps.DirectionsTravelMode.DRIVING, a: 123});
        expect(this.get(0)).to.be.equal(directionsrenderer.getMap());
        expect(this.get(1)).to.be.equal(directionsrenderer);
        done();
      });
  });

  it('would not create anything if options is not defined', function (done) {
    this.handler
      .directionsrenderer()
      .then(function (directionsrenderer) {
        expect(directionsrenderer).to.be.undefined;
        expect(this.get().length).to.be.equal(2);
        expect(this.get(1)).to.be.undefined;
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
        expect(directionsrenderer.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(directionsrenderer.getPanel()).to.be.equal(self.$target.get(0));
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
        expect(directionsrenderer.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(directionsrenderer.getPanel()).to.be.equal(self.$target.get(0));
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
        expect(directionsrenderer.getMap()).to.be.an.instanceof(google.maps.Map);
      })
      .directionsrenderer({})
      .then(function (directionsrenderer) {
        expect(directionsrenderer).to.be.an.instanceof(google.maps.DirectionsRenderer);
        expect(directionsrenderer.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(directionsrenderer).not.to.be.equal(previous);
        done();
      });
  });

});