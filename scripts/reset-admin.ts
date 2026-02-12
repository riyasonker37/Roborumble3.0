import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env.local");
    process.exit(1);
}

// Define the schema here to avoid import issues with model registration
const AuthUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" },
}, { timestamps: true, strict: false });

const AuthUser = mongoose.models.AuthUser || mongoose.model("AuthUser", AuthUserSchema);

async function resetPassword() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to MongoDB");

        const email = "kumaraakshant2005@gmail.com";
        const newPassword = "admin123";
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await AuthUser.findOneAndUpdate(
            { email },
            { password: hashedPassword, role: "ADMIN" },
            { new: true }
        );

        if (result) {
            console.log(`Successfully reset password for ${email}`);
            console.log(`Role: ${result.role}`);
        } else {
            console.log(`User ${email} not found. Creating a new admin user...`);
            // If user doesn't exist, create one (minimal fields)
            await AuthUser.create({
                name: "Admin",
                email,
                password: hashedPassword,
                role: "ADMIN",
                college: "N/A"
            });
            console.log(`Created new admin user: ${email}`);
        }

    } catch (error) {
        console.error("Error resetting password:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

resetPassword();
