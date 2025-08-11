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

const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const query = req.query as Record<string, string>;
    const rides = await rideService.getMe(query, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Ride Retrieve Successfully",
        data: rides,
    });
});
const getAllRides = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const query = req.query as Record<string, string>;
    const rides = await rideService.getAllRides(query, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Ride Retrieve Successfully",
        data: rides,
    });
});

export const RideControllers = {
    requestForRide,
    //   updateRideStatus,
    getMe,
    getAllRides,
};