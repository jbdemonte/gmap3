describe('streetviewpanorama', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    this.$target = jQuery('<div></div>');
    jQuery('body').append(this.$element, this.$target);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var self = this;
    var options = {a: 123};
    this.handler
      .streetviewpanorama(this.$target, options)
      .wait(250)
      .then(function (streetviewpanorama) {
        expect(streetviewpanorama).to.be.an.instanceof(google.maps.StreetViewPanorama);
        expect(self.$target.html().length).to.be.gt(0);
        expect(streetviewpanorama.a).to.be.equal(123);
        expect(options).to.deep.equal({a: 123});
        expect(this.get(0).getStreetView()).to.be.equal(streetviewpanorama);
        expect(this.get(1)).to.be.equal(streetviewpanorama);
        done();
      });
  });

  it('would resolve the address', function (done) {
    var self = this;
    this.handler
      .streetviewpanorama(this.$target, {address: '5 Rue Bellevue, 83910 Pourrières'})
      .wait(250)
      .then(function (streetviewpanorama) {
        expect(streetviewpanorama).to.be.an.instanceof(google.maps.StreetViewPanorama);
        expect(self.$target.html().length).to.be.gt(0);
        expect(this.get(0).getStreetView()).to.be.equal(streetviewpanorama);
        expect(streetviewpanorama.getPosition().lat()).to.be.closeTo(43.5, 0.1);
        expect(streetviewpanorama.getPosition().lng()).to.be.closeTo(5.7, 0.1);
        expect(this.get(0).getStreetView()).to.be.equal(streetviewpanorama);
        expect(this.get(1)).to.be.equal(streetviewpanorama);
        done();
      });
  });

  it('would convert the position as array', function (done) {
    var self = this;
    this.handler
      .streetviewpanorama(this.$target, {position: [40, -123]})
      .wait(250)
      .then(function (streetviewpanorama) {
        expect(streetviewpanorama).to.be.an.instanceof(google.maps.StreetViewPanorama);
        expect(self.$target.html().length).to.be.gt(0);
        expect(this.get(0).getStreetView()).to.be.equal(streetviewpanorama);
        expect(streetviewpanorama.getPosition().lat()).to.be.equal(40);
        expect(streetviewpanorama.getPosition().lng()).to.be.equal(-123);
        expect(this.get(0).getStreetView()).to.be.equal(streetviewpanorama);
        expect(this.get(1)).to.be.equal(streetviewpanorama);
        done();
      });
  });

  it('would not modify position as literal object', function (done) {
    var self = this;
    var position = {lat: 40, lng: -123};
    this.handler
      .streetviewpanorama(this.$target, {position: position})
      .wait(250)
      .then(function (streetviewpanorama) {
        expect(streetviewpanorama).to.be.an.instanceof(google.maps.StreetViewPanorama);
        expect(self.$target.html().length).to.be.gt(0);
        expect(this.get(0).getStreetView()).to.be.equal(streetviewpanorama);
        expect(streetviewpanorama.getPosition().lat()).to.be.equal(40);
        expect(streetviewpanorama.getPosition().lng()).to.be.equal(-123);
        expect(this.get(0).getStreetView()).to.be.equal(streetviewpanorama);
        expect(this.get(1)).to.be.equal(streetviewpanorama);
        expect(position).to.eql({lat: 40, lng: -123});
        done();
      });
  });

  it('would not modify the position as google.maps.LatLng object', function (done) {
    var self = this;
    var position = new google.maps.LatLng(40, -123);
    this.handler
      .streetviewpanorama(this.$target, {position: position})
      .wait(250)
      .then(function (streetviewpanorama) {
        expect(streetviewpanorama).to.be.an.instanceof(google.maps.StreetViewPanorama);
        expect(self.$target.html().length).to.be.gt(0);
        expect(this.get(0).getStreetView()).to.be.equal(streetviewpanorama);
        expect(streetviewpanorama.getPosition()).to.be.equal(position);
        expect(streetviewpanorama.getPosition().lat()).to.be.equal(40);
        expect(streetviewpanorama.getPosition().lng()).to.be.equal(-123);
        expect(this.get(0).getStreetView()).to.be.equal(streetviewpanorama);
        expect(this.get(1)).to.be.equal(streetviewpanorama);
        done();
      });
  });

});