describe('circle', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    this.handler
      .circle(options)
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(circle.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});
        done();
      });
  });

  it('would resolve the address', function (done) {
    this.handler
      .circle({address: '100,200'})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(circle.__data.center).to.be.an.instanceof(google.maps.LatLng);
        expect(circle.__data.center.lat()).to.be.equal(100);
        expect(circle.__data.center.lng()).to.be.equal(200);
        done();
      });
  });

  it('would convert the center as array', function (done) {
    this.handler
      .circle({center: [100,200]})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(circle.__data.center).to.be.an.instanceof(google.maps.LatLng);
        expect(circle.__data.center.lat()).to.be.equal(100);
        expect(circle.__data.center.lng()).to.be.equal(200);
        done();
      });
  });

  it('would not modify center as literal object', function (done) {
    var center = {lat: 100, lng: 200};
    this.handler
      .circle({center: center})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(circle.__data.center).not.to.equal(center); // should have clone the options object to not modify it
        expect(circle.__data.center).to.deep.equal({lat: 100, lng: 200});
        done();
      });
  });

  it('would not modify the center as google.maps.LatLng object', function (done) {
    var center = new google.maps.LatLng(100, 200);
    this.handler
      .circle({center: center})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(circle.__data.center).to.equal(center);
        expect(circle.__data.center.lat()).to.be.equal(100);
        expect(circle.__data.center.lng()).to.be.equal(200);
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .circle()
      .then(function (circle) {
        previous = circle;
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.__data.map).to.be.an.instanceof(google.maps.Map);
      })
      .circle()
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(circle).not.to.be.equal(previous);
        done();
      })
  });

  it('would handle multiples items with multiple address resolutions', function (done) {
    var circles = [];
    this.handler
      .circle([
        {center: {lat: 1, lng: 2}},
        {center: [3, 4]},
        {center: new google.maps.LatLng(5, 6)}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        Array.prototype.push.apply(circles, items);
      })
      .circle({center: [7, 8]})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.__data.map).to.be.an.instanceof(google.maps.Map);
        circles.push(circle)
      })
      .circle([
        {center: {lat: 9, lng: 10}},
        {center: [11, 12]},
        {center: new google.maps.LatLng(13, 14)}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        Array.prototype.push.apply(circles, items);
      })
      .circle({center: new google.maps.LatLng(15, 16)})
      .then(function (circle) {
        expect(circle).to.be.an.instanceof(google.maps.Circle);
        expect(circle.__data.map).to.be.an.instanceof(google.maps.Map);
        circles.push(circle)
      })
      .then(function () {
        expect(circles.length).to.be.equal(8);
        circles.forEach(function (circle, index) {
          var lat = 2 * index + 1;
          var lng = 2 * index + 2;
          expect(circle).to.be.an.instanceof(google.maps.Circle);
          expect(circle.__data.map).to.be.an.instanceof(google.maps.Map);
          // may be either a google.maps.LatLng or a simple {lat, lng} object
          if (circle.__data.center instanceof google.maps.LatLng) {
            expect(circle.__data.center.lat()).to.be.equal(lat);
            expect(circle.__data.center.lng()).to.be.equal(lng);
          } else {
            expect(circle.__data.center.lat).to.be.equal(lat);
            expect(circle.__data.center.lng).to.be.equal(lng);
          }
        });
        done();
      })
  });

});