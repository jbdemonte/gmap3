describe('get', function () {

  beforeEach(function (done) {
    var self = this;
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37, -122], zoom: 13});
    done();
  });

  it('chain the marker on the map', function (done) {
    this.handler
      .marker({
        position: [37, -122]
      })
      .marker([
        {position: [38, -122]},
        {position: [39, -122]},
        {position: [40, -122]}
      ])
      .marker({
        position: [41, -122]
      })
      .then(function () {
        var map, marker, markers;
        map = this.get(0);
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(map).to.eql(this.get(-4));

        marker = this.get(1);
        expect(marker.getPosition().lat()).to.eql(37);
        expect(marker).to.eql(this.get(-3));

        markers = this.get(2);
        expect(markers).to.be.an('array');
        expect(markers[0].getPosition().lat()).to.eql(38);
        expect(markers[1].getPosition().lat()).to.eql(39);
        expect(markers[2].getPosition().lat()).to.eql(40);
        expect(markers).to.eql(this.get(-2));

        marker = this.get(3);
        expect(marker.getPosition().lat()).to.eql(41);
        expect(marker).to.eql(this.get(-1));

        done();
      });
  });

});