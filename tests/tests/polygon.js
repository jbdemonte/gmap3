describe('polygon', function () {

  beforeEach(function () {
    this.$element = jQuery('<div></div>');
    this.handler = this.$element.gmap3({});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var options = {a: 123};
    this.handler
      .polygon(options)
      .then(function (polygon) {
        expect(polygon).to.be.an.instanceof(google.maps.Polygon);
        expect(polygon.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(polygon.__data.a).to.be.equal(123);
        expect(options).to.deep.equal( {a: 123});
        expect(this.get(1)).to.be.equal(polygon);
        done();
      });
  });

  it('would convert the position as array', function (done) {
    var latLng = new google.maps.LatLng(5, 6);
    this.handler
      .polygon({
        paths: [
          [1,2],
          {lat: 3, lng: 4},
          latLng,
          [7, 8]
        ]
      })
      .then(function (polygon) {
        expect(polygon).to.be.an.instanceof(google.maps.Polygon);
        expect(polygon.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(polygon.__data.paths).to.be.an('array');
        expect(polygon.__data.paths.length).to.be.equal(4);
        polygon.__data.paths.forEach(function (item, index) {
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
      .polygon()
      .then(function (polygon) {
        previous = polygon;
        expect(polygon).to.be.an.instanceof(google.maps.Polygon);
        expect(polygon.__data.map).to.be.an.instanceof(google.maps.Map);
      })
      .polygon()
      .then(function (polygon) {
        expect(polygon).to.be.an.instanceof(google.maps.Polygon);
        expect(polygon.__data.map).to.be.an.instanceof(google.maps.Map);
        expect(polygon).not.to.be.equal(previous);
        done();
      })
  });

  it('would handle multiples items with multiple address resolutions', function (done) {
    var polygons = [];
    this.handler
      .polygon([
        {paths: [{lat: 1, lng: 2}, [3, 4]]},
        {paths: [[5, 6], {lat: 7, lng: 8}, [9, 10]]}
      ])
      .then(function (items) {
        expect(items).to.be.an('array');
        Array.prototype.push.apply(polygons, items);
      })
      .polygon({paths: [[11, 12], [13, 14]]})
      .then(function (polygon) {
        expect(polygon).to.be.an.instanceof(google.maps.Polygon);
        expect(polygon.__data.map).to.be.an.instanceof(google.maps.Map);
        polygons.push(polygon)
      })
      .then(function () {
        expect(polygons.length).to.be.equal(3);

        var counts = [2, 3, 2];

        polygons.forEach(function (polygon, index) {
          expect(polygon.__data.paths.length).to.be.equal(counts[index]);
          var offset = 0;
          counts.slice(0, index).forEach(function (cnt) {
            offset += cnt;
          });
          offset = 2 * offset;


          polygon.__data.paths.forEach(function (item, index) {
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