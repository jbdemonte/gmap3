describe('events', function () {

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

  it('would not trig error when calling events before creating object', function (done) {
    this.handler
      .on('click', function () {})
      .then(function () {
        done();
      });
  });

  it('would attach many events on map using both syntax in many call and keep the chaining working', function (done) {
    var self = this;
    var click1 = self.build('click1');
    var click2 = self.build('click2');
    var click3 = self.build('click3');
    var mouseover = self.build('mouseover');

    var click1Once = self.build('click1Once');
    var click2Once = self.build('click2Once');
    var click3Once = self.build('click3Once');
    var mouseoverOnce = self.build('mouseoverOnce');

    this.handler
      .map()
      .on('click', click1)
      .once('click', click1Once)
      .on('click', click2)
      .once('click', click2Once)
      .on({
        click: click3,
        mouseover: mouseover
      })
      .on({
        click: click3Once,
        mouseover: mouseoverOnce
      })
      .then(function (map) {
        expect(map).to.be.an.instanceof(google.maps.Map);
        google.maps.event.trigger(map, 'click');
        google.maps.event.trigger(map, 'click');
        google.maps.event.trigger(map, 'click');
        google.maps.event.trigger(map, 'mouseover');
        google.maps.event.trigger(map, 'mouseover');
        expect(self.events).to.deep.equal({
          click1: 3,
          click1Once: 1,
          click2: 3,
          click2Once: 1,
          click3: 3,
          click3Once: 3,
          mouseover: 2,
          mouseoverOnce: 2
        });
        done();
      });
  });

  it('would attach many events on many differents objects during the chaining', function (done) {
    var self = this;
    var map;
    var clickMap = self.build('clickMap');
    var clickMarker = self.build('clickMarker');
    var mouseoverMap = self.build('mouseoverMap');
    var mouseoverMarker = self.build('mouseoverMarker');

    this.handler
      .map()
      .on('click', clickMap)
      .on({
        mouseover: mouseoverMap
      })
      .then(function (m) {
        expect(m).to.be.an.instanceof(google.maps.Map);
        map = m;
      })
      .marker()
      .on('click', clickMarker)
      .on({
        mouseover: mouseoverMarker
      })
      .then(function (marker) {
        expect(marker).to.be.an.instanceof(google.maps.Marker);
        google.maps.event.trigger(map, 'click');
        google.maps.event.trigger(map, 'click');
        google.maps.event.trigger(map, 'click');
        google.maps.event.trigger(map, 'click');
        google.maps.event.trigger(map, 'mouseover');
        google.maps.event.trigger(map, 'mouseover');
        google.maps.event.trigger(map, 'mouseover');

        google.maps.event.trigger(marker, 'click');
        google.maps.event.trigger(marker, 'click');
        google.maps.event.trigger(marker, 'mouseover');

        expect(self.events).to.deep.equal({
          clickMap: 4,
          mouseoverMap: 3,
          clickMarker: 2,
          mouseoverMarker: 1
        });

        done();
      });
  });

  it('would attach event on multiple objects chained', function (done) {
    var call = [];

    function click(marker, event) {
      call.push({marker:marker, event:event})
    }

    this.handler
      .map()
      .marker([
        {m:1},
        {m:2},
        {m:3}
      ])
      .on('click', click)
      .then(function (markers) {
        expect(markers).to.be.an('array');
        expect(markers.length).to.be.equal(3);
        markers.forEach(function (marker, index) {
          expect(marker).to.be.an.instanceof(google.maps.Marker);
          google.maps.event.trigger(marker, 'click', {fakeX: index});
        });
        expect(call).to.deep.equal([
          {marker: markers[0], event: {fakeX: 0}},
          {marker: markers[1], event: {fakeX: 1}},
          {marker: markers[2], event: {fakeX: 2}}
        ]);
        done();
      });
  });

  it('would attach event on may objects of same type during the chaining', function (done) {
    var call = [];
    var marker1, marker2;

    function click(marker, event) {
      call.push({marker:marker, event:event})
    }

    this.handler
      .map()
      .marker()
      .on('click', click)
      .then(function (m) {
        marker1 = m;
        expect(m).to.be.an.instanceof(google.maps.Marker);
      })
      .marker()
      .on('click', click)
      .then(function (m) {
        marker2 = m;
        expect(m).to.be.an.instanceof(google.maps.Marker);
      })
      .marker()
      .on('click', click)
      .then(function (marker3) {
        google.maps.event.trigger(marker3, 'click', {fakeX: 3});
        google.maps.event.trigger(marker2, 'click', {fakeX: 2});
        google.maps.event.trigger(marker1, 'click', {fakeX: 1});
        expect(call).to.deep.equal([
          {marker: marker3, event: {fakeX: 3}},
          {marker: marker2, event: {fakeX: 2}},
          {marker: marker1, event: {fakeX: 1}}
        ]);
        done();
      });
  });

  it('would attach array of events', function (done) {
    var call = [];

    function click1(marker, event) {
      call.push({marker:marker, event:event, fn: 1})
    }

    function click2(marker, event) {
      call.push({marker:marker, event:event, fn: 2})
    }

    function click3(marker, event) {
      call.push({marker:marker, event:event, fn: 3})
    }

    function click4(marker, event) {
      call.push({marker:marker, event:event, fn: 4})
    }

    this.handler
      .map()
      .marker()
      .on('click', click1, click2)
      .on({
        click: [click3, click4]
      })
      .then(function (marker) {
        google.maps.event.trigger(marker, 'click', {fakeX: 123});
        expect(call).to.deep.equal([
          {marker: marker, event: {fakeX: 123}, fn: 1},
          {marker: marker, event: {fakeX: 123}, fn: 2},
          {marker: marker, event: {fakeX: 123}, fn: 3},
          {marker: marker, event: {fakeX: 123}, fn: 4}
        ]);
        done();
      });
  });

});