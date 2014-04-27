// Icons used into the markers options
var marka = new google.maps.MarkerImage(
  'css/images/marker-images/image.png',
  new google.maps.Size(59,50),
  new google.maps.Point(0,0),
  new google.maps.Point(30,50)
);
var marka2 = new google.maps.MarkerImage(
  'css/images/marker-images/bauhause.png',
  new google.maps.Size(59,50),
  new google.maps.Point(0,0),
  new google.maps.Point(30,50)
);

var marka3 = new google.maps.MarkerImage(
  'css/images/marker-images/praktiker.png',
  new google.maps.Size(59,50),
  new google.maps.Point(0,0),
  new google.maps.Point(30,50)
);


// markers definition list
var list = [
  { lat: 39.91029584638212, 
    lng: 32.776551246643066, 
    data: { 
      type: "magaza",
      magazaID:1, 
      magazaGrubuID:1, 
      adi: "Media Markt Ankara Çankaya", 
      adres: "Kentpark AVM Mustafa Kemal Mah. No:164 Eskişehir Yolu Çankaya 06520 Ankara", 
      bilgi: "Hergün 10:00 - 23:00 saatleri arasında hizmet vermektedir", 
      logo: "mediamarkt.png",
      brosurID:141, 
      brosur: "css/images/noBrochure.png" 
    }, 
    options: { 
      icon: marka
    } 
  },
  { lat: 39.964556463510355, 
    lng: 32.63265609741211, 
    data: { 
      type: "magaza", 
      magazaID:1,
      magazaGrubuID:1,
      adi: "Media Markt Ankara Eryaman", 
      adres: "Optimum Outlet ve Eğlence Merkezi Eryaman Ayaş Yolu No: 93/208 Etimesgut 06930 Ankara", 
      bilgi: "Hergün 10:00 - 23:00 saatleri arasında hizmet vermektedir", 
      logo: "mediamarkt.png", 
      brosurID:141, 
      brosurID:141,
      brosur: "css/images/noBrochure.png" 
    }, 
    options: { 
      icon: marka
    } 
  },
  { lat: 39.910460, 
    lng:  32.778241, 
    data: {
      type: "magaza",
      magazaID:1, 
      magazaGrubuID:1,
      adi: "Media Markt Ankara Etlik", 
      adres: "Forum Ankara Outlet Yozgat Bulvarı No:99 Ovacık Mevkii Etlik Keçiören 06110 Ankara ", 
      bilgi: "Hergün 10:00 - 23:00 saatleri arasında hizmet vermektedir", 
      logo: "mediamarkt.png",
      brosurID:141, 
      brosur: "css/images/noBrochure.png" 
    }, 
    options: { 
      icon: marka 
    } 
  },
  { lat: 39.910460, 
    lng: 32.778241, 
    data: {
      type: "magaza",
      magazaID:1,
      magazaGrubuID:1, 
      adi: "Bauhaus Cepa", 
      adres: "Cepa Alışveriş Merkezi Eskişehir Yolu 7. km 06520 Söğütözü / Ankara", 
      bilgi: "Hergün 10:00 - 23:00 saatleri arasında hizmet vermektedir", 
      logo: "bauhaus.png",
      brosurID:141, 
      brosur: "css/images/noBrochure.png" 
    }, 
    options: { 
      icon: marka2 
    } 
  },
  { lat: 40.019029, 
    lng: 32.821795, 
    data: {
      type: "magaza",
        magazaID:1,
        magazaGrubuID:1, 
        adi: "Bauhaus Etlik", 
        adres: "Forum Alışveriş Merkezi Yozgat Bulvarı NO:99 Ovacık Mevkii 06170 Etlik-Keçiören / Ankara", 
        bilgi: "Hergün 10:00 - 23:00 saatleri arasında hizmet vermektedir", 
        logo: "bauhaus.png",
        brosurID:141, 
        brosur: "css/images/noBrochure.png" 
      }, 
    options: { 
      icon: marka2 
    } 
  },
  { lat: 39.883586, 
    lng: 32.758961, 
    data: {
      type: "magaza", 
      magazaID:1, 
      magazaGrubuID:1,
      adi: "ANKARA BİLKENT PRAKTİKER", 
      adres: "Bilkent Center Eskişehir Yolu 8.km Bilkent / Ankara", 
      bilgi: "Hergün 10:00 - 22:00 saatleri arasında hizmet vermektedir", 
      logo: "praktiker.png",
      brosurID:141, 
      brosur: "css/images/noBrochure.png" 
    }, 
    options: { 
      icon: marka3 
    } 
  },
  { lat: 39.971727, 
    lng: 32.823372, 
    data: {
      type: "magaza",magazaID:1,
      magazaGrubuID:1, 
      adi: "ANKARA ETLİK PRAKTİKER", 
      adres: " Halil Sezai Erkut Caddesi, Afra Sokak, 1/A Etlik / Ankara", 
      bilgi: "Hergün 10:00 - 22:00 saatleri arasında hizmet vermektedir", 
      logo: "praktiker.png", 
      brosurID:141,
      brosur: "css/images/noBrochure.png" 
    }, 
    options: { 
      icon: marka3 
    } 
  }
];
