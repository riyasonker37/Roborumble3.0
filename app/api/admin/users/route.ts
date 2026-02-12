import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Profile from "@/app/models/Profile";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import AuthUser from "@/app/models/AuthUser";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token) {
            return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
        }

        // Verify Token
        const decoded = jwt.verify(
            token.value,
            process.env.JWT_SECRET || "default_secret"
        ) as { userId: string, role: string };

        if (!["ADMIN", "SUPERADMIN"].includes(decoded.role?.toUpperCase())) {
            return NextResponse.json({ error: "FORBIDDEN: ADMIN_ACCESS_ONLY" }, { status: 403 });
        }

        await connectDB();

        // Fetch all profiles
        const allProfiles = await Profile.find()
            .select(
                "clerkId email firstName lastName username phone college role registeredEvents paidEvents onboardingCompleted createdAt"
            )
            .sort({ createdAt: -1 });

        const safeUsers = allProfiles.map((p) => ({
            ...p.toObject(),
            id: p._id.toString(),
            _id: p._id.toString(),
            name: p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : (p.username || "Unknown"),
        }));

        return NextResponse.json({ users: safeUsers }, { status: 200 });
    } catch (error) {
        console.error("Admin Users Fetch Error:", error);
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token) {
            return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
        }

        // Verify Token
        const decoded = jwt.verify(
            token.value,
            process.env.JWT_SECRET || "default_secret"
        ) as { userId: string, role: string };

        if (!["ADMIN", "SUPERADMIN"].includes(decoded.role?.toUpperCase())) {
            return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
        }

        await connectDB();

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "MISSING_USER_ID" }, { status: 400 });
        }

        // Delete the profile
        const deletedProfile = await Profile.findByIdAndDelete(userId);
        
        if (!deletedProfile) {
            return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
        }

        return NextResponse.json({ message: "USER_DELETED_SUCCESSFULLY" });
    } catch (error) {
        console.error("Admin User Delete Error:", error);
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}
