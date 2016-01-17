describe('resume', function () {

  beforeEach(function () {
    var self = this;
    self.$element = jQuery('<div></div>');
    self.handler = this.$element.gmap3();
    self.events = {};
    self.build = function (name) {
      return function () {
        self.events[name] = (self.events[name] || 0) + 1;
      };
    }
  });

  it('should return no data at first', function (done) {
    this.handler
      .resume(function () {
        expect(arguments.length).to.be.equal(0);
        done();
      });
  });

  it('should return the map', function (done) {
    var map;

    this.handler
      .map()
      .then(function (m) {
        expect(m).to.be.an.instanceof(google.maps.Map);
        map = m;
      })
      .resume(function (m) {
        expect(arguments.length).to.be.equal(1);
        expect(m).to.be.equal(map);
        done();
      });
  });

  it('should return the differents object in the good order', function (done) {
    var map, marker1, markers, circle1, marker2, rectangles;

    this.handler
      .map()
      .then(function (obj) {
        expect(obj).to.be.an.instanceof(google.maps.Map);
        map = obj;
      })
      .marker()
      .then(function (obj) {
        expect(obj).to.be.an.instanceof(google.maps.Marker);
        marker1 = obj;
      })
      .marker([
        {position: {lat: 1, lng: 2}},
        {position: [3, 4]},
        {position: new google.maps.LatLng(5, 6)}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        items.forEach(function (obj) {
          expect(obj).to.be.an.instanceof(google.maps.Marker);
        });
        markers = items;
      })
      .circle({a: 123})
      .then(function (obj) {
        expect(obj).to.be.an.instanceof(google.maps.Circle);
        circle1 = obj;
      })
      .marker()
      .then(function (obj) {
        expect(obj).to.be.an.instanceof(google.maps.Marker);
        marker2 = obj;
      })
      .rectangle([
        {bounds: {north: 1, east: 2, south: 3, west: 4}},
        {bounds: [5, 6, 7, 8]}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        items.forEach(function (obj) {
          expect(obj).to.be.an.instanceof(google.maps.Rectangle);
        });
        rectangles = items;
      })
      .resume(function () {
        expect(arguments.length).to.be.equal(6);
        expect(arguments[0]).to.be.equal(map);
        expect(arguments[1]).to.be.equal(marker1);
        expect(arguments[2]).to.be.an('array');
        expect(arguments[2]).not.to.be.equal(markers); // array should be another one to not accept modifications on it
        expect(arguments[2].length).to.be.equal(markers.length); // array should be another one to not accept modifications on it
        arguments[2].forEach(function (marker, index) {
          expect(marker).to.be.equal(markers[index]);
        });
        expect(arguments[3]).to.be.equal(circle1);
        expect(arguments[4]).to.be.equal(marker2);
        expect(arguments[5]).not.to.be.equal(rectangles); // same as markers
        expect(arguments[5].length).to.be.equal(rectangles.length);
        arguments[5].forEach(function (rectangle, index) {
          expect(rectangle).to.be.equal(rectangles[index]);
        });
        done();
      });
  });

  it('would return a silent created map', function (done) {
    var marker;
    this.handler
      .marker()
      .then(function (obj) {
        expect(obj).to.be.an.instanceof(google.maps.Marker);
        marker = obj;
      })
      .resume(function () {
        expect(arguments.length).to.be.equal(2);
        expect(arguments[0]).to.be.an.instanceof(google.maps.Map);
        expect(arguments[1]).to.be.equal(marker);
        done();
      });
  });

});