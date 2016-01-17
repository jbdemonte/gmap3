describe('infowindow', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3();
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    this.handler
      .infowindow(options)
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.__data.map).to.be.an('undefined');
        expect(infowindow.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});
        done();
      });
  });

  it('would resolve the address', function (done) {
    this.handler
      .infowindow({address: '100,200'})
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.__data.map).to.be.an('undefined');
        expect(infowindow.__data.position).to.be.an.instanceof(google.maps.LatLng);
        expect(infowindow.__data.position.lat()).to.be.equal(100);
        expect(infowindow.__data.position.lng()).to.be.equal(200);
        done();
      });
  });

  it('would convert the position as array', function (done) {
    this.handler
      .infowindow({position: [100,200]})
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.__data.map).to.be.an('undefined');
        expect(infowindow.__data.position).to.be.an.instanceof(google.maps.LatLng);
        expect(infowindow.__data.position.lat()).to.be.equal(100);
        expect(infowindow.__data.position.lng()).to.be.equal(200);
        done();
      });
  });

  it('would not modify position as literal object', function (done) {
    var position = {lat: 100, lng: 200};
    this.handler
      .infowindow({position: position})
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.__data.map).to.be.an('undefined');
        expect(infowindow.__data.position).not.to.equal(position); // should have clone the options object to not modify it
        expect(infowindow.__data.position).to.deep.equal({lat: 100, lng: 200});
        done();
      });
  });

  it('would not modify the position as google.maps.LatLng object', function (done) {
    var position = new google.maps.LatLng(100, 200);
    this.handler
      .infowindow({position: position})
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.__data.map).to.be.an('undefined');
        expect(infowindow.__data.position).to.equal(position);
        expect(infowindow.__data.position.lat()).to.be.equal(100);
        expect(infowindow.__data.position.lng()).to.be.equal(200);
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
        expect(infowindow.__data.map).to.be.an('undefined');
      })
      .infowindow()
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.__data.map).to.be.an('undefined');
        expect(infowindow).not.to.be.equal(previous);
        done();
      })
  });

  it('would handle multiples items with multiple address resolutions', function (done) {
    var infowindows = [];
    this.handler
      .infowindow([
        {position: {lat: 1, lng: 2}},
        {position: [3, 4]},
        {position: new google.maps.LatLng(5, 6)}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        Array.prototype.push.apply(infowindows, items);
      })
      .infowindow({position: [7, 8]})
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.__data.map).to.be.an('undefined');
        infowindows.push(infowindow)
      })
      .infowindow([
        {position: {lat: 9, lng: 10}},
        {position: [11, 12]},
        {position: new google.maps.LatLng(13, 14)}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        Array.prototype.push.apply(infowindows, items);
      })
      .infowindow({position: new google.maps.LatLng(15, 16)})
      .then(function (infowindow) {
        expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
        expect(infowindow.__data.map).to.be.an('undefined');
        infowindows.push(infowindow)
      })
      .then(function () {
        expect(infowindows.length).to.be.equal(8);
        infowindows.forEach(function (infowindow, index) {
          var lat = 2 * index + 1;
          var lng = 2 * index + 2;
          expect(infowindow).to.be.an.instanceof(google.maps.InfoWindow);
          expect(infowindow.__data.map).to.be.an('undefined');
          // may be either a google.maps.LatLng or a simple {lat, lng} object
          if (infowindow.__data.position instanceof google.maps.LatLng) {
            expect(infowindow.__data.position.lat()).to.be.equal(lat);
            expect(infowindow.__data.position.lng()).to.be.equal(lng);
          } else {
            expect(infowindow.__data.position.lat).to.be.equal(lat);
            expect(infowindow.__data.position.lng).to.be.equal(lng);
          }
        });
        done();
      })
  });

});