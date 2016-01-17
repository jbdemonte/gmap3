describe('polyline', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3();
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    this.handler
      .polyline(options)
      .then(function (polyline) {
        expect(polyline).to.be.an.instanceof(google.maps.Polyline);
        expect(polyline.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(polyline.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});
        done();
      });
  });

  it('would convert the position as array', function (done) {
    var latLng = new google.maps.LatLng(5, 6);
    this.handler
      .polyline({
        path: [
          [1,2],
          {lat: 3, lng: 4},
          latLng,
          [7, 8]
        ]
      })
      .then(function (polyline) {
        expect(polyline).to.be.an.instanceof(google.maps.Polyline);
        expect(polyline.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(polyline.__data.path).to.be.an('array');
        expect(polyline.__data.path.length).to.be.equal(4);
        polyline.__data.path.forEach(function (item, index) {
          if (item instanceof google.maps.LatLng) {
            expect(item.lat()).to.be.equal(1 + 2 * index);
            expect(item.lng()).to.be.equal(2 + 2 * index);
          } else {
            expect(item.lat).to.be.equal(1 + 2 * index);
            expect(item.lng).to.be.equal(2 + 2 * index);
          }
        });
        done();
      });
  });

  it('would return distinct instances', function (done) {
    var previous;
    this.handler
      .polyline()
      .then(function (polyline) {
        previous = polyline;
        expect(polyline).to.be.an.instanceof(google.maps.Polyline);
        expect(polyline.__data.map).to.be.an.instanceof(google.maps.Map);
      })
      .polyline()
      .then(function (polyline) {
        expect(polyline).to.be.an.instanceof(google.maps.Polyline);
        expect(polyline.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(polyline).not.to.be.equal(previous);
        done();
      })
  });

  it('would handle multiples items with multiple address resolutions', function (done) {
    var polylines = [];
    this.handler
      .polyline([
        {path: [{lat: 1, lng: 2}, [3, 4]]},
        {path: [[5, 6], {lat: 7, lng: 8}, [9, 10]]}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        Array.prototype.push.apply(polylines, items);
      })
      .polyline({path: [[11, 12], [13, 14]]})
      .then(function (polyline) {
        expect(polyline).to.be.an.instanceof(google.maps.Polyline);
        expect(polyline.__data.map).to.be.an.instanceof(google.maps.Map);
        polylines.push(polyline)
      })
      .then(function () {
        expect(polylines.length).to.be.equal(3);

        var counts = [2, 3, 2];

        polylines.forEach(function (polyline, index) {
          expect(polyline.__data.path.length).to.be.equal(counts[index]);
          var offset = 0;
          counts.slice(0, index).forEach(function (cnt) {
            offset += cnt;
          });
          offset = 2 * offset;


          polyline.__data.path.forEach(function (item, index) {
            if (item instanceof google.maps.LatLng) {
              expect(item.lat()).to.be.equal(offset + 1 + 2 * index);
              expect(item.lng()).to.be.equal(offset + 2 + 2 * index);
            } else {
              expect(item.lat).to.be.equal(offset + 1 + 2 * index);
              expect(item.lng).to.be.equal(offset + 2 + 2 * index);
            }
          });
        });

        done();
      })
  });

});