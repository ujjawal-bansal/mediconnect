import { Router } from "express";
import { HospitalResource } from "../models/HospitalResource";

const router = Router();

const toRad = (value: number): number => (value * Math.PI) / 180;

const haversineDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

router.get("/nearby", async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ message: "lat and lng are required numbers" });
    }

    const resources = await HospitalResource.find();

    const withDistance = resources.map((r) => {
      const distanceKm = haversineDistanceKm(
        lat,
        lng,
        r.latitude,
        r.longitude,
      );
      return {
        id: r._id.toString(),
        name: r.name,
        type: r.type,
        address: r.address,
        latitude: r.latitude,
        longitude: r.longitude,
        phone: r.phone,
        openHours: r.openHours,
        distanceKm,
      };
    });

    withDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(withDistance);
  } catch (err) {
    next(err);
  }
});

export default router;

