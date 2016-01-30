describe('streetviewpanorama', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.$target = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var self = this;
    var options = {a: 123};
    this.handler
      .streetviewpanorama(this.$target, options)
      .then(function (streetviewpanorama) {
        expect(streetviewpanorama).to.be.an.instanceof(google.maps.StreetViewPanorama);
        expect(streetviewpanorama.__data.__mapDiv).to.be.equal(self.$target.get(0));
        expect(streetviewpanorama.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});
        expect(this.get(0).__data.__streetView).to.be.equal(streetviewpanorama);
        expect(this.get(1)).to.be.equal(streetviewpanorama);
        done();
      });
  });

  it('would resolve the address', function (done) {
    var self = this;
    this.handler
      .streetviewpanorama(this.$target, {address: '100,200'})
      .then(function (streetviewpanorama) {
        expect(streetviewpanorama).to.be.an.instanceof(google.maps.StreetViewPanorama);
        expect(streetviewpanorama.__data.__mapDiv).to.be.equal(self.$target.get(0));
        expect(streetviewpanorama.__data.position).to.be.an.instanceof(google.maps.LatLng);
        expect(streetviewpanorama.__data.position.lat()).to.be.equal(100);
        expect(streetviewpanorama.__data.position.lng()).to.be.equal(200);
        expect(this.get(0).__data.__streetView).to.be.equal(streetviewpanorama);
        expect(this.get(1)).to.be.equal(streetviewpanorama);
        done();
      });
  });

  it('would convert the position as array', function (done) {
    this.handler
      .streetviewpanorama(this.$target, {position: [100,200]})
      .then(function (streetviewpanorama) {
        expect(streetviewpanorama).to.be.an.instanceof(google.maps.StreetViewPanorama);
        expect(streetviewpanorama.__data.position).to.be.an.instanceof(google.maps.LatLng);
        expect(streetviewpanorama.__data.position.lat()).to.be.equal(100);
        expect(streetviewpanorama.__data.position.lng()).to.be.equal(200);
        done();
      });
  });

  it('would not modify position as literal object', function (done) {
    var position = {lat: 100, lng: 200};
    this.handler
      .streetviewpanorama(this.$target, {position: position})
      .then(function (streetviewpanorama) {
        expect(streetviewpanorama).to.be.an.instanceof(google.maps.StreetViewPanorama);
        expect(streetviewpanorama.__data.position).not.to.equal(position); // should have clone the options object to not modify it
        expect(streetviewpanorama.__data.position).to.deep.equal({lat: 100, lng: 200});
        done();
      });
  });

  it('would not modify the position as google.maps.LatLng object', function (done) {
    var position = new google.maps.LatLng(100, 200);
    this.handler
      .streetviewpanorama(this.$target, {position: position})
      .then(function (streetviewpanorama) {
        expect(streetviewpanorama).to.be.an.instanceof(google.maps.StreetViewPanorama);
        expect(streetviewpanorama.__data.position).to.equal(position);
        expect(streetviewpanorama.__data.position.lat()).to.be.equal(100);
        expect(streetviewpanorama.__data.position.lng()).to.be.equal(200);
        done();
      });
  });

});