describe('then', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('should wait and propagate instance', function (done) {
    var times = [];
    times.push(Date.now());

    this.handler
      .wait(500)
      .then(function (map) {
        times.push(Date.now());
        expect(map).to.be.an.instanceof(google.maps.Map);
        return 123;
      })
      .wait(1000)
      .then(function (last) {
        times.push(Date.now());
        expect(last).to.eql(123);
        expect(times[1]).to.be.closeTo(times[0] + 500, 200);
        expect(times[2]).to.be.closeTo(times[1] + 1000, 200);
        done();
      });
  });


});