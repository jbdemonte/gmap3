describe('chaining', function () {
  
  function rejected(reason) {
    var dfd = jQuery.Deferred();
    dfd.reject(reason);
    return dfd;
  }
  function resolved(reason) {
    var dfd = jQuery.Deferred();
    dfd.resolve(reason);
    return dfd;
  }

  beforeEach(function (done) {
    var self = this;
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    done();
  });

  it('chain the marker on the map', function (done) {
    this.handler
      .marker(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        return {
          position: map.getCenter(),
          icon: 'http://maps.google.com/mapfiles/marker_brown.png'
        };
      })
      .then(function (marker) {
        var map = this.get(0);
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.getPosition().lat()).to.be.closeTo(map.getCenter().lat(), 0.001);
        expect(marker.getPosition().lng()).to.be.closeTo(map.getCenter().lng(), 0.001);
        expect(marker.getIcon()).to.eql('http://maps.google.com/mapfiles/marker_brown.png');
        done();
      });
  });

  it('chain using the "then" result', function (done) {
    this.handler
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        // return nothing, should not modify the next function parameter
      })
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        // return something, should modify the next function parameter
        return map.getCenter();
      })
      .then(function (center) {
        expect(center).to.be.an.instanceof(google.maps.LatLng);
        // return nothing, should not modify the next function parameter
      })
      .marker(function (center) {
        expect(center).to.be.an.instanceof(google.maps.LatLng);
        return {
          position: center,
          icon: 'http://maps.google.com/mapfiles/marker_brown.png'
        };
      })
      .then(function (marker) {
        var map = this.get(0);
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.getPosition().lat()).to.be.closeTo(map.getCenter().lat(), 0.001);
        expect(marker.getPosition().lng()).to.be.closeTo(map.getCenter().lng(), 0.001);
        expect(marker.getIcon()).to.eql('http://maps.google.com/mapfiles/marker_brown.png');
        done();
      });
  });

  it('chain using the "then" deferred result', function (done) {
    var times = [];
    this.handler
      .then(function (map) {
        times.push(Date.now());
        var deferred = $.Deferred();
        expect(map).to.be.an.instanceof(google.maps.Map);
        setTimeout(function () {
          deferred.resolve(map.getCenter());
        }, 1000);
        // return nothing, should not modify the next function parameter
        return deferred;
      })
      .then(function (center) {
        times.push(Date.now());
        expect(times[1]).to.be.closeTo(times[0] + 1000, 200);
        expect(center).to.be.an.instanceof(google.maps.LatLng);
        // return nothing, should not modify the next function parameter
      })
      .marker(function (center) {
        times.push(Date.now());
        expect(times[2]).to.be.closeTo(times[1], 150);
        expect(center).to.be.an.instanceof(google.maps.LatLng);
        return {
          position: center,
          icon: 'http://maps.google.com/mapfiles/marker_brown.png'
        };
      })
      .then(function (marker) {
        var map = this.get(0);
        expect(map).to.be.an.instanceof(google.maps.Map);
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        expect(marker.getPosition().lat()).to.be.closeTo(map.getCenter().lat(), 0.001);
        expect(marker.getPosition().lng()).to.be.closeTo(map.getCenter().lng(), 0.001);
        expect(marker.getIcon()).to.eql('http://maps.google.com/mapfiles/marker_brown.png');
        done();
      });
  });

  it('should chain catch', function (done) {
    var results = [];
    this.handler
      .marker(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        return rejected(1);
      })
      .then(function () {
        done(new Error('catch expected'));
      })
      .catch(function (value) {
        results.push(value);
        return resolved(2);
      })
      .then(function (value) {
        results.push(value);
        return rejected(3);
      })
      .then(function () {
        done(new Error('catch expected'));
      })
      .catch(function (value) {
        results.push(value);
        return rejected(4);
      })
      .then(function () {
        done(new Error('catch expected'));
      })
      .catch(function (value) {
        results.push(value);
        return 5;
      })
      .then(function (value) {
        results.push(value);
        expect(results).to.eql([1,2,3,4,5]);
        done();
      });
  });

});