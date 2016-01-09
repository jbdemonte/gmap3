describe('marker', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3();
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    this.handler
      .marker(options)
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});
        done();
      });
  });

  it('would return an instance based on options', function (done) {
    this.handler
      .marker({a: 123})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.__data.a).to.be.equal(123);
        done();
      });
  });

  it('would resolve the address', function (done) {
    this.handler
      .marker({address: '100,200'})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.__data.position).to.be.an.instanceof(google.maps.LatLng);
        expect(marker.__data.position.lat()).to.be.equal(100);
        expect(marker.__data.position.lng()).to.be.equal(200);
        done();
      });
  });

  it('would convert the position array', function (done) {
    this.handler
      .marker({position: [100,200]})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.__data.position).to.be.an.instanceof(google.maps.LatLng);
        expect(marker.__data.position.lat()).to.be.equal(100);
        expect(marker.__data.position.lng()).to.be.equal(200);
        done();
      });
  });

  it('would not modify the simple position object', function (done) {
    var position = {lat: 100, lng: 200};
    this.handler
      .marker({position: position})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.__data.position).not.to.equal(position); // should have clone the options object to not modify it
        expect(marker.__data.position).to.deep.equal({lat: 100, lng: 200});
        done();
      });
  });

  it('would not modify the simple position as google.maps.LatLng object', function (done) {
    var position = new google.maps.LatLng(100, 200);
    this.handler
      .marker({position: position})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.__data.position).to.equal(position);
        expect(marker.__data.position.lat()).to.be.equal(100);
        expect(marker.__data.position.lng()).to.be.equal(200);
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
      })
      .marker()
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker).not.to.be.equal(previous);
        done();
      })
  });

  it('would handle multiples items with multiple address resolutions', function (done) {
    var markers = [];
    this.handler
      .marker([
        {position: {lat: 1, lng: 2}},
        {position: [3, 4]},
        {position: new google.maps.LatLng(5, 6)}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        Array.prototype.push.apply(markers, items);
      })
      .marker({position: [7, 8]})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        markers.push(marker)
      })
      .marker([
        {position: {lat: 9, lng: 10}},
        {position: [11, 12]},
        {position: new google.maps.LatLng(13, 14)}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        Array.prototype.push.apply(markers, items);
      })
      .marker({position: new google.maps.LatLng(15, 16)})
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        markers.push(marker)
      })
      .then(function () {
        expect(markers.length).to.be.equal(8);
        markers.forEach(function (marker, index) {
          var lat = 2 * index + 1;
          var lng = 2 * index + 2;
          expect(marker).to.be.an.instanceof(google.maps.Marker);
          // may be either a google.maps.LatLng or a simple {lat, lng} object
          if (marker.__data.position instanceof google.maps.LatLng) {
            expect(marker.__data.position.lat()).to.be.equal(lat);
            expect(marker.__data.position.lng()).to.be.equal(lng);
          } else {
            expect(marker.__data.position.lat).to.be.equal(lat);
            expect(marker.__data.position.lng).to.be.equal(lng);
          }
        });
        done();
      })
  });

});