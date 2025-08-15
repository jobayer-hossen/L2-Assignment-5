import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { rideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";

// requestr for ride
const requestForRide = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const result = await rideService.requestForRide(req.body, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Ride requested successfully",
        data: result,
    });
});

// const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const decodedToken = req.user as JwtPayload;

//   const updatedRideRequest = await rideService.updateRideStatus(
//     id,
//     req.body,
//     decodedToken
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Ride Updated Successfully",
//     data: updatedRideRequest,
//   });
// });

const getAllRidesForRider = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const query = req.query as Record<string, string>;
    const rides = await rideService.getAllRidesForRider(query, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Ride Retrieve Successfully",
        data: rides,
    });
});

const getAllRidesForAdminAndDriver = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const query = req.query as Record<string, string>;
    const rides = await rideService.getAllRidesForAdminAndDriver(query, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Ride Retrieve Successfully",
        data: rides,
    });
});

const getSingleRideForRider = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id
  const riderInfo = req.user as JwtPayload
  const riderId = riderInfo.userId
  const result = await rideService.getSingleRideForRider(rideId, riderId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Ride Information Retrieved!",
    data: result.data
  });

});


const giveFeedbackAndRating = catchAsync(async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const { feedback, rating } = req.body;
  const user = req.user as JwtPayload
  const userId = user.userId

  const result = await rideService.giveFeedbackAndRating(rideId, userId, feedback, rating);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feedback submitted successfully",
    data: result,
  });
});

export const rideControllers = {
    requestForRide,
    //   updateRideStatus,
    getAllRidesForRider,
    getAllRidesForAdminAndDriver,
    getSingleRideForRider,
    giveFeedbackAndRating
};