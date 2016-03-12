describe('circle', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {center: [37.772323, -122.214897], radius : 750, a: 123};
    this.handler
      .circle(options)
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(circle.a).to.be.equal(123);
        expect(options).to.deep.equal({center: [37.772323, -122.214897], radius : 750, a: 123});
        expect(this.get(0)).to.be.equal(circle.getMap());
        expect(this.get(1)).to.be.equal(circle);
        done();
      });
  });

  it('would resolve the address', function (done) {
    this.handler
      .circle({address: 'rue Bellevue, Pourrieres, France'})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(circle.getCenter()).to.be.an.instanceof(google.maps.LatLng);
        expect(circle.getCenter().lat()).to.be.closeTo(43.5038769, 0.01);
        expect(circle.getCenter().lng()).to.be.closeTo(5.7313513, 0.01);
        done();
      });
  });
  

  it('would convert the center as array', function (done) {
    this.handler
      .circle({center: [37.772323, -122.214897], radius : 750})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(circle.getCenter()).to.be.an.instanceof(google.maps.LatLng);
        expect(circle.getCenter().lat()).to.be.closeTo(37.772323, 0.001);
        expect(circle.getCenter().lng()).to.be.closeTo(-122.214897, 0.001);
        expect(circle.getRadius()).to.be.equal(750);
        done();
      });
  });

  it('would not modify center as literal object', function (done) {
    var center = {lat: 37.772323, lng: -122.214897};
    this.handler
      .circle({center: center, radius : 750})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(circle.getCenter()).to.be.an.instanceof(google.maps.LatLng);
        expect(circle.getCenter().lat()).to.be.closeTo(37.772323, 0.001);
        expect(circle.getCenter().lng()).to.be.closeTo(-122.214897, 0.001);
        expect(circle.getRadius()).to.be.equal(750);
        expect(center).to.deep.equal({lat: 37.772323, lng: -122.214897});
        done();
      });
  });

  it('would not modify the center as google.maps.LatLng object', function (done) {
    var center = new google.maps.LatLng(37.772323, -122.214897);
    this.handler
      .circle({center: center, radius : 750})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(circle.getCenter()).to.be.an.instanceof(google.maps.LatLng);
        expect(circle.getCenter().lat()).to.be.closeTo(37.772323, 0.001);
        expect(circle.getCenter().lng()).to.be.closeTo(-122.214897, 0.001);
        expect(circle.getRadius()).to.be.equal(750);
        expect(circle.getCenter()).to.equal(center);
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .circle({center: [37.772323, -122.214897], radius : 750})
      .then(function (circle) {
        previous = circle;
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.getMap()).to.be.an.instanceof(google.maps.Map);
      })
      .circle({center: [37.772323, -122.214897], radius : 750})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.getMap()).to.be.an.instanceof(google.maps.Map);
        expect(circle).not.to.be.equal(previous);
        done();
      });
  });

});