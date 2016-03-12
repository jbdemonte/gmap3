describe('marker', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {position: [37, -122], a: 123};
    this.handler
      .marker(options)
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(marker.a).to.be.equal(123);
        expect(options).to.deep.equal({position: [37, -122], a: 123});
        expect(this.get(1)).to.be.equal(marker);
        expect(this.get(0)).to.be.equal(marker.getMap());
        done();
      });
  });

  it('would resolve the address', function (done) {
    this.handler
      .marker({address: '5 Rue Bellevue, 83910 Pourrières'})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(marker.getPosition().lat()).to.be.closeTo(43.5, 0.1);
        expect(marker.getPosition().lng()).to.be.closeTo(5.7, 0.1);
        done();
      });
  });

  it('would convert the position as array', function (done) {
    this.handler
      .marker({position: [10, 20]})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(marker.getPosition().lat()).to.be.equal(10);
        expect(marker.getPosition().lng()).to.be.equal(20);
        done();
      });
  });

  it('would not modify position as literal object', function (done) {
    var position = {lat: 10, lng: 20};
    this.handler
      .marker({position: position})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(marker.getPosition().lat()).to.be.equal(10);
        expect(marker.getPosition().lng()).to.be.equal(20);
        done();
      });
  });

  it('would not modify the position as google.maps.LatLng object', function (done) {
    var position = new google.maps.LatLng(10, 20);
    this.handler
      .marker({position: position})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(marker.getPosition()).to.equal(position);
        expect(marker.getPosition().lat()).to.be.equal(10);
        expect(marker.getPosition().lng()).to.be.equal(20);
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .marker()
      .then(function (marker) {
        previous = marker;
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.getMap()).to.be.an.instanceof(google.maps.Map);
      })
      .marker()
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(marker).not.to.be.equal(previous);
        done();
      });
  });

});