function elevationService() {
  if (!services.es) {
    services.es = new gm.ElevationService();
  }
  return services.es;
}