describe('then', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});

    var self = this;

    self.events = {};
    self.build = function (name) {
      return function () {
        self.events[name] = (self.events[name] || 0) + 1;
      };
    };
    this.handler.wait(500).then(function () {done();});
  });

  it('should return the map', function (done) {
    var map;

    this.handler
      .then(function (m) {
        expect(m).to.be.an.instanceof(google.maps.Map);
        map = m;
      })
      .then(function (m) {
        expect(arguments.length).to.be.equal(1);
        expect(m).to.be.equal(map);
        done();
      });
  });

  it('should return the differents object in the good order', function (done) {
    var map, marker1, markers, circle1, marker2, rectangles;

    this.handler
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
      .then(function () {
        var self = this;
        var args = this.get();

        expect(args.length).to.be.equal(6);
        expect(args[0]).to.be.equal(map);
        expect(args[1]).to.be.equal(marker1);
        expect(args[2]).to.be.an('array');
        expect(args[2]).not.to.be.equal(markers); // array should be another one to not accept modifications on it
        expect(args[2].length).to.be.equal(markers.length); // array should be another one to not accept modifications on it
        args[2].forEach(function (marker, index) {
          expect(marker).to.be.equal(markers[index]);
        });
        expect(args[3]).to.be.equal(circle1);
        expect(args[4]).to.be.equal(marker2);
        expect(args[5]).not.to.be.equal(rectangles); // same as markers
        expect(args[5].length).to.be.equal(rectangles.length);
        args[5].forEach(function (rectangle, index) {
          expect(rectangle).to.be.equal(rectangles[index]);
        });


        for(var i=0; i<6; i++) {
          if (i !== 2 && i !== 5) {
            expect(this.get(i)).to.be.equal(args[i]);
          } else {
            args[i].forEach(function (marker, index) {
              expect(marker).to.be.equal(self.get(i)[index]);
            });
          }
        }

        done();
      });
  });

});