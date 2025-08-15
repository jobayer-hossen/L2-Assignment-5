import z from "zod";
import { IRideStatus } from "./ride.interface";

export const createRideZodSchema = z.object({
    riderId: z.string({ message: "Rider id is required and must be a string." }),
    vehicleType: z.string({
        message: "VehicleType is required and must be a string",
    }),

    pickupLocation: z.object({
        lati: z.number({
            message: "Pickup latitude is required and must be a number.",
        }),
        long: z.number({
            message: "Pickup longitude is required and must be a number.",
        }),
        address: z.string({ message: "Address must be a string." })
    }),

    destination: z.object({
        lati: z.number({
            message: "Destination Latitude is required and must be a number.",
        }),
        long: z.number({
            message: "Destination longitude is required and must be a number.",
        }),
        address: z.string({ message: "Address must be a string." })
    }),
});

// export const updateRideZodSchema = z.object({
//     riderId: z
//         .string({ message: "Rider id is required and must be a string." })
//         .optional(),
//     driverId: z.string({ message: "Driver id must be a string." }).optional(),
//     feedbackId: z.string({ message: "Feedback id must be a string." }).optional(),
//     paymentId: z.string({ message: "Payment id must be a string." }).optional(),

//     vehicleType: z
//         .string({
//             message: "vehicleType is required and must be a string",
//         })
//         .optional(),
//     pickup: z
//         .object({
//             lat: z.number({
//                 message: "Pickup latitude is required and must be a number.",
//             }),
//             lon: z.number({
//                 message: "Pickup longitude is required and must be a number.",
//             }),
//         })
//         .optional(),

//     destination: z
//         .object({
//             lat: z.number({
//                 message: "Destination Latitude is required and must be a number.",
//             }),
//             lon: z.number({
//                 message: "Destination longitude is required and must be a number.",
//             }),
//         })
//         .optional(),

//     distance: z
//         .number({
//             message: "distance must be a number.",
//         })
//         .optional(),

//     startTime: z
//         .preprocess((val) => {
//             if (typeof val === "string") return new Date(val);
//             if (val instanceof Date) return val;
//         }, z.date())
//         .optional(),

//     endTime: z
//         .preprocess((val) => {
//             if (typeof val === "string") return new Date(val);
//             if (val instanceof Date) return val;
//         }, z.date())
//         .optional(),

//     estimatedDuration: z
//         .number({
//             message: "estimatedDuration must be a number.",
//         })
//         .optional(),

//     status: z.enum(Object.values(IRideStatus) as [string]).optional(),

//     cancelledBy: z
//         .string({ message: "cancelledBy must be a objectId in string" })
//         .optional(),
//     cancellationReason: z
//         .string({
//             message: "cancellationReason must be a string.",
//         })
//         .optional(),
//     cancellationTime: z
//         .preprocess((val) => {
//             if (typeof val === "string") return new Date(val);
//             if (val instanceof Date) return val;
//         }, z.date())
//         .optional(),

//     fare: z
//         .object({
//             baseFare: z.number({
//                 message: "baseFare is required and must be a number.",
//             }),
//             distanceFare: z.number({
//                 message: "distanceFare is required and must be a number.",
//             }),
//             timeFare: z.number({
//                 message: "timeFare is required and must be a number.",
//             }),
//             platformFee: z.number({
//                 message: "platformFee is required and must be a number.",
//             }),
//             demandFare: z.number({
//                 message: "demandFare is required and must be a number.",
//             }),
//             discount: z.number({
//                 message: "discount is required and must be a number.",
//             }),
//             actualFare: z.number({
//                 message: "actualFare is required and must be a number.",
//             }),
//         })
//         .optional(),
// });

export const updateRideStatusZodSchema = z.object({
    rideStatus: z.enum(Object.values(IRideStatus) as [string]),
    cancelReason: z
        .string({
            message: "Cancel Reason is required and must be a string.",
        })
        .optional(),
});


export const rideFeedbackZodSchema = z.object({
  feedback: z.string(),
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});