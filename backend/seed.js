// Run with: node seed.js
// Creates a default admin account and job categories so the app isn't empty on first run.
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import slugify from "slugify";

dotenv.config();

const categories = [
  "Software Engineering",
  "Marketing & Sales",
  "Design & Creative",
  "Finance & Accounting",
  "Customer Support",
  "Human Resources",
  "Data Science & Analytics",
  "Operations & Management",
  "Education & Training",
  "Healthcare",
];

const seed = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ email: "admin@careerhubbd.com" });
  if (!existingAdmin) {
    await User.create({
      name: "Super Admin",
      email: "admin@careerhubbd.com",
      password: "Admin@12345",
      role: "admin",
      isVerified: true,
    });
    console.log("✔ Admin created -> admin@careerhubbd.com / Admin@12345");
  } else {
    console.log("Admin already exists, skipping.");
  }

  for (const name of categories) {
    const exists = await Category.findOne({ name });
    if (!exists) {
      await Category.create({ name, slug: slugify(name, { lower: true }) });
    }
  }
  console.log("✔ Categories seeded");

  console.log("Seeding complete. Please change the admin password after first login.");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
