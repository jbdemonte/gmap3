describe('styledmaptype', function () {

  beforeEach(function (done) {
    this.$element = jQuery('<div style="width:300px; height: 300px"></div>');
    jQuery('body').append(this.$element);
    this.handler = this.$element.gmap3({center: [37.772323, -122.214897], zoom: 13});
    this.handler.wait(500).then(function () {done();});
  });

  it('would not modify options and return an instance based on options', function (done) {
    var styles = [{
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        { hue: "#ff0022" },
        { saturation: 60 },
        { lightness: -20 }
      ]
    }];
    var options = {name: "Style 1"};
    this.handler
      .styledmaptype("style1", styles,options)
      .then(function (style) {
        expect(style).to.be.an.instanceof(google.maps.StyledMapType);
        expect(style.name).to.be.equal("Style 1");
        expect(styles).to.eql([{
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [
            { hue: "#ff0022" },
            { saturation: 60 },
            { lightness: -20 }
          ]
        }]);
        expect(options).to.eql({name: "Style 1"});
        done();
      });
  });

});