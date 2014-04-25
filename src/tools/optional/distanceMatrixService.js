function distanceMatrixService() {
  if (!services.dms) {
    services.dms = new gm.DistanceMatrixService();
  }
  return services.dms;
}