describe('rectangle', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3();
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    this.handler
      .rectangle(options)
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});
        done();
      });
  });

  it('would return an instance based on options', function (done) {
    this.handler
      .rectangle({a: 123})
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.__data.a).to.be.equal(123);
        done();
      });
  });

  it('would convert the bound as array', function (done) {
    this.handler
      .rectangle({bounds: [1,2,3,4]})
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.__data.bounds).to.be.an.instanceof(google.maps.LatLngBounds);
        expect(rectangle.__data.bounds.ne().lat).to.be.equal(1);
        expect(rectangle.__data.bounds.ne().lng).to.be.equal(2);
        expect(rectangle.__data.bounds.sw().lat).to.be.equal(3);
        expect(rectangle.__data.bounds.sw().lng).to.be.equal(4);
        done();
      });
  });

  it('would modify bounds as literal object', function (done) {
    var bounds = {north: 1, east: 2, south: 3, west: 4};
    this.handler
      .rectangle({bounds: bounds})
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.__data.bounds).to.be.an.instanceof(google.maps.LatLngBounds);
        expect(rectangle.__data.bounds.ne().lat).to.be.equal(1);
        expect(rectangle.__data.bounds.ne().lng).to.be.equal(2);
        expect(rectangle.__data.bounds.sw().lat).to.be.equal(3);
        expect(rectangle.__data.bounds.sw().lng).to.be.equal(4);
        done();
      });
  });

  it('would not modify the bounds as google.maps.LatLngBounds object', function (done) {
    var bounds = new google.maps.LatLngBounds({south: 3, west: 4}, {north: 1, east: 2});
    this.handler
      .rectangle({bounds: bounds})
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle.__data.bounds).to.equal(bounds);
        expect(rectangle.__data.bounds.ne().north).to.be.equal(1);
        expect(rectangle.__data.bounds.ne().east).to.be.equal(2);
        expect(rectangle.__data.bounds.sw().south).to.be.equal(3);
        expect(rectangle.__data.bounds.sw().west).to.be.equal(4);
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .rectangle()
      .then(function (rectangle) {
        previous = rectangle;
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
      })
      .rectangle()
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        expect(rectangle).not.to.be.equal(previous);
        done();
      })
  });

  it('would handle multiples items', function (done) {
    var rectangles = [];
    this.handler
      .rectangle([
        {bounds: {north: 1, east: 2, south: 3, west: 4}},
        {bounds: [5, 6, 7, 8]},
        {bounds: new google.maps.LatLngBounds({south: 11, west: 12}, {north: 9, east: 10})}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        Array.prototype.push.apply(rectangles, items);
      })
      .rectangle({bounds: [13, 14, 15, 16]})
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        rectangles.push(rectangle)
      })
      .rectangle([
        {bounds: {north: 17, east: 18, south: 19, west: 20}},
        {bounds: [21, 22, 23, 24]},
        {bounds: new google.maps.LatLngBounds({south: 27, west: 28}, {north: 25, east: 26})}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        Array.prototype.push.apply(rectangles, items);
      })
      .rectangle({bounds: [29, 30, 31, 32]})
      .then(function (rectangle) {
        expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
        rectangles.push(rectangle)
      })
      .then(function () {
        expect(rectangles.length).to.be.equal(8);
        rectangles.forEach(function (rectangle, index) {
          var n = 4 * index + 1;
          var e = 4 * index + 2;
          var s = 4 * index + 3;
          var w = 4 * index + 4;
          var bounds = rectangle.__data.bounds;
          expect(rectangle).to.be.an.instanceof(google.maps.Rectangle);
          // may be either a google.maps.LatLng or a simple {lat, lng} object
          if (bounds.ne().north) {
            expect(bounds.ne().north).to.be.equal(n);
            expect(bounds.ne().east).to.be.equal(e);
            expect(bounds.sw().south).to.be.equal(s);
            expect(bounds.sw().west).to.be.equal(w);
          } else {
            expect(bounds.ne().lat).to.be.equal(n);
            expect(bounds.ne().lng).to.be.equal(e);
            expect(bounds.sw().lat).to.be.equal(s);
            expect(bounds.sw().lng).to.be.equal(w);
          }
        });
        done();
      })
  });

});