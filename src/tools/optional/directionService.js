function directionsService(){
  if (!services.ds) {
    services.ds = new gm.DirectionsService();
  }
  return services.ds;
}