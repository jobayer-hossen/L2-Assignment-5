import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IRide, IRideStatus } from "./ride.interface";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { IsActive, Role } from "../user/user.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
// import {
//     handleAdminRideStatus,
//     handleDriverRideStatus,
//     handleRiderRideStatus,
// } from "../../helpers/rideHelpers";
import { Driver } from "../driver/driver.model";
import { IDriver } from "../driver/driver.interface";
import { Ride } from "./ride.model";


const requestForRide = async (payload: Partial<IRide>, decodedToken: JwtPayload) => {
    if (!payload.riderId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Rider id not found");
    }

    const rider = await User.findById(payload.riderId).select("-password");

    if (!rider) {
        throw new AppError(httpStatus.NOT_FOUND, "Rider not found");
    }
    if (rider.isDeleted || rider.isActive !== IsActive.ACTIVE) {
        throw new AppError(httpStatus.FORBIDDEN, "Rider is not active");
    }
    if (!payload.riderId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Rider id not found");
    }
    if (rider.isBlocked === "BLOCKED") {
        throw new AppError(httpStatus.BAD_REQUEST, "You are blocked. Contact admin.");
    }
    if (decodedToken.userId !== payload.riderId) {
        throw new AppError(httpStatus.FORBIDDEN, "Rider id not match");
    }
    if (!payload.pickupLocation?.lati || !payload.pickupLocation?.long || !payload.destination?.lati || !payload.destination?.long) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid pickup or destination coordinates");
    }
    if (payload.pickupLocation?.lati === payload.destination?.lati && payload.pickupLocation?.long === payload.destination?.long) {
        throw new AppError(httpStatus.BAD_REQUEST, "Pickup and Destination cannot be same");
    }

    const existingRide = await Ride.findOne({
        riderId: payload.riderId,
        rideStatus: {
            $in: [
                IRideStatus.REQUESTED,
                IRideStatus.ACCEPTED,
                IRideStatus.IN_TRANSIT,
            ],
        },
    });
    if (existingRide) {
        throw new AppError(httpStatus.CONFLICT, "You already have an ongoing ride request");
    }

    const requestPayload: Partial<IRide> = {
        ...payload,
        rideStatus: IRideStatus.REQUESTED,
        timestampsLog: {
            requestedAt: new Date(),
        },
    };

    const rideCreated = await Ride.create(requestPayload);

    await rider.save();
    return rideCreated;
};

// const updateRideStatus = async (
//     id: string,
//     payload: IUpdateRideStatusPayload,
//     decodedToken: JwtPayload
// ) => {
//     if (!id || !payload || !decodedToken) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             "Something Went Wrong, in your data"
//         );
//     }
//     const ride = await Ride.findById(id);
//     if (!ride) {
//         throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
//     }
//     if (ride.rideStatus === payload.status) {
//         throw new AppError(httpStatus.CONFLICT, "Please provide different status");
//     }

//     // Rider Section
//     if (decodedToken.role === Role.RIDER) {
//         await handleRiderRideStatus(ride, payload, decodedToken);
//         const updatedRide = await ride.save();
//         return updatedRide;
//     }
//     // Driver Section
//     if (decodedToken.role === Role.DRIVER) {
//         if (ride.rideStatus === IRideStatus.COMPLETED) {
//             throw new AppError(
//                 httpStatus.BAD_REQUEST,
//                 "This ride has been completed."
//             );
//         }

//         let driver: IDriver | null = null;

//         if (!ride.driverId) {
//             if (payload.status !== IRideStatus.ACCEPTED) {
//                 throw new AppError(
//                     httpStatus.BAD_REQUEST,
//                     "No driver assigned to this ride yet. Please provide first status as accepted."
//                 );
//             }
//             driver = await Driver.findOne({ userId: decodedToken.userId });
//             if (!driver) {
//                 throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
//             }
//         } else {
//             driver = await Driver.findOne({ userId: ride.driverId });
//             if (!driver) {
//                 throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
//             }
//         }

//         await handleDriverRideStatus(driver, ride, payload, decodedToken);

//         const updatedRide = await ride.save();
//         return updatedRide;
//     }

//     if (
//         decodedToken.role === Role.ADMIN ||
//         decodedToken.role === Role.SUPER_ADMIN
//     ) {
//         await handleAdminRideStatus(ride, payload, decodedToken);
//         const updatedRide = await ride.save();
//         return updatedRide;
//     }
// };



const getAllRidesForRider = async (query: Record<string, string>, decodedToken: JwtPayload) => {
    const queryBuilder = new QueryBuilder(
        Ride.find({ riderId: decodedToken.userId }),
        query
    );
    const allRides = await queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = await Promise.all([
        allRides.build(),
        queryBuilder.getMeta(),
    ]);
    return { meta: meta, data: data };
};

const getAllRidesForAdminAndDriver = async (query: Record<string, string>, decodedToken: JwtPayload) => {
    // Admin/Super Admin finder
    if (decodedToken.role === Role.ADMIN || Role.SUPER_ADMIN) {
        const queryBuilder = new QueryBuilder(Ride.find(), query);
        const rides = await queryBuilder.filter().sort().fields().paginate();
        const [data, meta] = await Promise.all([
            rides.build(),
            queryBuilder.getMeta(),
        ]);
        return { meta: meta, data: data };
    }

    // Driver section start
    const queryBuilder = new QueryBuilder(
        Ride.find({ driverId: decodedToken.userId }),
        query
    );
    const rides = await queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = await Promise.all([
        rides.build(),
        queryBuilder.getMeta(),
    ]);
    return { meta: meta, data: data };
    // Driver section end
};

const getSingleRideForRider = async (rideId: string, riderId: string) => {

    const singleRide = await Ride.findById(rideId)

    if (!singleRide) {
        throw new AppError(httpStatus.NOT_FOUND, "Ride Information Not Found")
    }


    if (String(singleRide.riderId) !== riderId) {
        throw new AppError(httpStatus.BAD_REQUEST, "This Ride Is Not Yours!")
    }

    return {
        data: singleRide
    }
}


// feedback

const giveFeedbackAndRating = async (rideId: string, userId: string, feedback: string, rating: number) => {
    try {
        const ride = await Ride.findById(rideId);
        if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");

        if (!ride.driverId) throw new AppError(httpStatus.BAD_REQUEST, "No driver assigned to this ride");

        if (ride.riderId.toString() !== userId) {
            throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized to rate this ride");
        }

        if (ride.rating) throw new AppError(httpStatus.BAD_REQUEST, "Feedback already submitted");

        if (ride.rideStatus !== IRideStatus.COMPLETED) {
            throw new AppError(httpStatus.BAD_REQUEST, "Feedback allowed only for completed rides");
        }

        if (rating < 1 || rating > 5) {
            throw new AppError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        }

        const rider = await User.findById(ride.riderId);
        if (!rider || rider.isBlocked === IsActive.BLOCKED) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is not allowed to submit feedback");
        }

        ride.feedback = feedback;
        ride.rating = rating;
        await ride.save();

        const ratedRides = await Ride.find({
            driverId: ride.driverId,
            rating: { $exists: true },
        });

        const totalRatings = ratedRides.length;
        const totalSum = ratedRides.reduce((sum, r) => sum + (r.rating || 0), 0);
        const averageRating = totalRatings === 0 ? 0 : parseFloat((totalSum / totalRatings).toFixed(1));

        await Driver.findByIdAndUpdate(ride.driverId, { rating: averageRating });

        return {
            rideId: ride._id,
            driverId: ride.driverId,
            averageRating,
        };
    } catch (error) {
        console.error("Error giving feedback:", error);
        throw error;
    }
};



export const rideService = {
    requestForRide,
    // updateRideStatus,
    getAllRidesForRider,
    getAllRidesForAdminAndDriver,
    getSingleRideForRider,
    giveFeedbackAndRating
};