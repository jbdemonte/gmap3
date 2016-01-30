describe('fit', function () {

  beforeEach(function () {
    var self = this;
    self.$element = jQuery('<div></div>');
    self.handler = this.$element.gmap3({center: [1, 2]});
  });

  it('should return the differents object in the good order', function (done) {

    this.handler
      .marker({position: [3, 4]})
      .marker([
        {position: {lat: 5, lng: 6}},
        {position: [7, 8]},
        {position: new google.maps.LatLng(9, 10)}
      ])
      .circle({center: [11, 12]})
      .rectangle([
        {bounds: {north: 13, east: 14, south: 15, west: 16}},
        {bounds: [17, 18, 19, 20]}
      ])
      .polygon({
        paths: [
          [21, 22],
          {lat: 23, lng: 24},
          [25, 26]
        ]
      })
      .polyline({
        path: [
          [27,28],
          {lat: 29, lng: 30},
          [31, 32]
        ]
      })
      .infowindow({address: '33,34'})
      .circle({address: '35,36'})
      .fit()
      .then(function () {
        expect(this.get(0).__data.__fitBounds.__extended.length).to.be.equal(17);
        this.get(0).__data.__fitBounds.__extended.forEach(function (item, index) {
          var lat = 3 + 2 * index;
          var lng = 4 + 2 * index;
          if (item instanceof google.maps.LatLng) {
            expect(item.lat()).to.be.equal(lat);
            expect(item.lng()).to.be.equal(lng);
          } else {
            expect(item.lat).to.be.equal(lat);
            expect(item.lng).to.be.equal(lng);
          }
        });
        done();
      })
  });

});