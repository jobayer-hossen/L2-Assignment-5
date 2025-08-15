import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { createRideZodSchema, rideFeedbackZodSchema } from "./ride.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { rideControllers } from "./ride.controller";


const router = Router();

router.post(
  "/request-ride",
  checkAuth(Role.RIDER),
  validateRequest(createRideZodSchema),
  rideControllers.requestForRide
);

router.get(
  "/all-ride-admin-driver",
  checkAuth(Role.DRIVER, Role.ADMIN, Role.SUPER_ADMIN),
  rideControllers.getAllRidesForAdminAndDriver
);

router.get("/all-ride-riders", checkAuth(Role.RIDER), rideControllers.getAllRidesForRider);



router.get("/my-ride/:id",
  checkAuth(...Object.values(Role)),
  rideControllers.getSingleRideForRider
)

// router.patch(
//   "/:id/status",
//   checkAuth(...Object.values(Role)),
//   validRequest(updateRideStatusZodSchema),
//   RideControllers.updateRideStatus
// );


router.post(
  "/feedback/:rideId",
  checkAuth(...Object.values(Role)),
  validateRequest(rideFeedbackZodSchema),
  rideControllers.giveFeedbackAndRating
);

export const RideRoutes = router;