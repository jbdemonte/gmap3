function maxZoomService() {
  if (!services.mzs) {
    services.mzs = new gm.MaxZoomService();
  }
  return services.mzs;
}