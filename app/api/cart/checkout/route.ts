import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Cart from "@/app/models/Cart";
import Event from "@/app/models/Event";
import Profile from "@/app/models/Profile";
import Registration from "@/app/models/Registration";
import PaymentSubmission from "@/app/models/PaymentSubmission";

// UPI Configuration
const UPI_ID = "oscuragamer1-2@okaxis";
const UPI_NAME = "Robo Rumble";

// POST - Submit payment proof
export async function POST(req: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { transactionId, screenshotUrl } = await req.json();

        if (!transactionId || !screenshotUrl) {
            return NextResponse.json(
                { error: "Transaction ID and screenshot are required" },
                { status: 400 }
            );
        }

        await connectDB();

        // Get user's cart
        const cart = await Cart.findOne({ clerkId }).populate({
            path: "items.eventId",
            model: Event,
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Get user profile for email
        const profile = await Profile.findOne({ clerkId });
        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        // Check for duplicate transaction ID
        const existingSubmission = await PaymentSubmission.findOne({ transactionId });
        if (existingSubmission) {
            return NextResponse.json(
                { error: "This transaction ID has already been submitted" },
                { status: 400 }
            );
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce((total: number, item: any) => {
            return total + (item.eventId?.fees || 0);
        }, 0);

        // Prepare events data
        const events = cart.items.map((item: any) => ({
            eventId: item.eventId._id,
            selectedMembers: item.selectedMembers,
        }));

        // Create payment submission
        const submission = await PaymentSubmission.create({
            clerkId,
            cartId: cart._id,
            teamId: cart.teamId,
            transactionId: transactionId.trim(),
            screenshotUrl,
            totalAmount,
            events,
            status: "pending",
            leaderEmail: profile.email,
            leaderName: profile.username || profile.email,
        });

        // Create pending registrations for each event
        for (const item of cart.items) {
            const event = item.eventId as any;

            await Registration.findOneAndUpdate(
                {
                    eventId: event._id,
                    teamId: cart.teamId,
                },
                {
                    $setOnInsert: {
                        eventId: event._id,
                        teamId: cart.teamId,
                        selectedMembers: item.selectedMembers,
                        paymentStatus: "pending",
                        paymentSubmissionId: submission._id,
                        amountExpected: event.fees,
                    },
                },
                { upsert: true, new: true }
            );
        }

        // Clear the cart after successful submission
        await Cart.deleteOne({ clerkId });

        return NextResponse.json({
            message: "Payment submitted for verification",
            submissionId: submission._id,
        });
    } catch (error) {
        console.error("Checkout POST Error:", error);
        return NextResponse.json(
            { error: "Failed to submit payment" },
            { status: 500 }
        );
    }
}

// GET - Get checkout info (cart summary + QR code data)
export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const cart = await Cart.findOne({ clerkId }).populate({
            path: "items.eventId",
            model: Event,
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Calculate total
        const totalAmount = cart.items.reduce((total: number, item: any) => {
            return total + (item.eventId?.fees || 0);
        }, 0);

        const events = cart.items.map((item: any) => ({
            title: item.eventId?.title || "Unknown Event",
            fees: item.eventId?.fees || 0,
            memberCount: item.selectedMembers?.length || 1,
        }));

        // Generate UPI deep link for QR
        const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent("RoboRumble Event Registration")}`;

        return NextResponse.json({
            events,
            totalAmount,
            upiId: UPI_ID,
            upiName: UPI_NAME,
            upiLink,
            itemCount: cart.items.length,
        });
    } catch (error) {
        console.error("Checkout GET Error:", error);
        return NextResponse.json(
            { error: "Failed to get checkout info" },
            { status: 500 }
        );
    }
}
