describe('marker', function () {
  this.timeout(5000);

  beforeEach(function () {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [46.578498,2.457275], zoom: 3});
  });

  it('create cluster and manipulate marker', function (done) {

    var values = [
      {position: [48.8620722, 2.352047]},
      {position: [44.28952958093682, 6.152559438984804], icon: "http://maps.google.com/mapfiles/marker_green.png"},
      {position: [49.28952958093682, -1.1501188139848408]},
      {position: [44.28952958093682, -1.1501188139848408]}
    ];

    this.handler
      .cluster({
        size: 200,
        markers: values.map(function (item) {return $.extend(true, {}, item); }),
        cb: function () {}
      })
      .then(function (cluster) {
        var marker, markers, i;

        markers = cluster.markers();
        expect(markers.length).to.eql(4);

        for(i = 0; i < 4; i++) {
          expect(markers[i].getPosition().lat()).to.be.closeTo(values[i].position[0], 0.001);
          expect(markers[i].getPosition().lng()).to.be.closeTo(values[i].position[1], 0.001);
        }

        // remove one marker

        marker = markers[0];
        cluster.remove(marker);
        markers = cluster.markers();
        expect(markers.length).to.eql(3);

        for(i = 0; i < 3; i++) {
          expect(markers[i].getPosition().lat()).to.be.closeTo(values[i + 1].position[0], 0.001);
          expect(markers[i].getPosition().lng()).to.be.closeTo(values[i + 1].position[1], 0.001);
        }

        // add one marker

        cluster.add(marker);
        markers = cluster.markers();
        expect(markers.length).to.eql(4);

        for(i= 0; i < 3; i++) {
          expect(markers[i].getPosition().lat()).to.be.closeTo(values[i + 1].position[0], 0.001);
          expect(markers[i].getPosition().lng()).to.be.closeTo(values[i + 1].position[1], 0.001);
        }
        expect(markers[3].getPosition().lat()).to.be.closeTo(values[0].position[0], 0.001);
        expect(markers[3].getPosition().lng()).to.be.closeTo(values[0].position[1], 0.001);

        done();
      });
  });

  it('should groups markers', function (done) {

    this.handler
      .cluster({
        size: 200,
        markers: [
          {position: [48.8620722, 2.352047]},
          {position: [44.28952958093682, 6.152559438984804]},
          {position: [49.28952958093682, -1.1501188139848408]},
          {position: [44.28952958093682, -1.1501188139848408]}
        ],
        cb: function (markers) {
          expect(markers.length).to.eql(4);
          return {
            content: '<div>4</div>'
          };
        }
      })
      .then(function (cluster) {

        setTimeout(function () {
          var groups = cluster.groups();
          expect(groups.length).to.eql(1);

          var group = groups.shift();
          expect(group.overlay).to.be.an.instanceof(google.maps.OverlayView);
          expect(group.overlay.$).eql(group.$);
          expect(group.$.html()).eql('<div>4</div>');

          var markers = cluster.markers();
          expect(markers.length).to.eql(4);
          markers.map(function (marker) {
            expect(marker).to.be.an.instanceof(google.maps.Marker);
            expect(marker.getMap()).to.be.undefined;
          });
          expect(group.cluster === cluster).to.be.true;

          done();
        }, 500);
      });
  });

});