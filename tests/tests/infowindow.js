describe('infowindow', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {position: [-25.363, 131.044], content: 'YES', a: 123};
    this.handler
      .infowindow(options)
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.getMap()).to.be.undefined;
        expect(infowindow.a).to.be.equal(123);
        expect(options).to.deep.equal({position: [-25.363, 131.044], content: 'YES', a: 123});
        expect(this.get(1)).to.be.equal(infowindow);
        done();
      });
  });

  it('would resolve the address', function (done) {
    this.handler
      .infowindow({address: '5 Rue Bellevue, 83910 Pourrières'})
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.getMap()).to.be.undefined;
        expect(infowindow.getPosition().lat()).to.be.closeTo(43.5, 0.1);
        expect(infowindow.getPosition().lng()).to.be.closeTo(5.7, 0.1);
        done();
      });
  });

  it('would convert the position as array', function (done) {
    this.handler
      .infowindow({position: [43.5, 5.7]})
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.getMap()).to.be.undefined;
        expect(infowindow.getPosition().lat()).to.be.closeTo(43.5, 0.1);
        expect(infowindow.getPosition().lng()).to.be.closeTo(5.7, 0.1);
        done();
      });
  });

  it('would not modify position as literal object', function (done) {
    var position = {lat: 43.5, lng: 5.7};
    this.handler
      .infowindow({position: position})
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.getMap()).to.be.undefined;
        expect(infowindow.getPosition().lat()).to.be.closeTo(43.5, 0.1);
        expect(infowindow.getPosition().lng()).to.be.closeTo(5.7, 0.1);
        done();
      });
  });

  it('would not modify the position as google.maps.LatLng object', function (done) {
    var position = new google.maps.LatLng(43.5, 5.7);
    this.handler
      .infowindow({position: position})
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.getMap()).to.be.undefined;
        expect(infowindow.getPosition()).to.equal(position);
        expect(infowindow.getPosition().lat()).to.be.closeTo(43.5, 0.1);
        expect(infowindow.getPosition().lng()).to.be.closeTo(5.7, 0.1);
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .infowindow()
      .then(function (infowindow) {
        previous = infowindow;
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.getMap()).to.be.undefined;
      })
      .infowindow()
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.getMap()).to.be.undefined;
        expect(infowindow).not.to.be.equal(previous);
        done();
      });
  });

});