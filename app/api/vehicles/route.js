import { NextResponse } from "next/server";
import { db, executeQuery } from "@/lib/db";
import path from "path";
import fs from "fs/promises"; // Use promises version for async/await support
import { ok } from "assert";

// Define the uploads directory
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
// Ensure uploads directory exists
fs.mkdir(UPLOAD_DIR, { recursive: true });

// To fetch all vehicles (not artworks)
export const GET = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const results = await executeQuery(`SELECT * FROM vehicles`);
    return NextResponse.json({ vehicles: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};

export const POST = async (req) => {
  const {
    model,
    brand,
    vehicle_type,
    daily_rate,
    hourly_rate,
    status,
    year,
    license_plate,
    img,
  } = await req.json();

  if (
    !(
      model &&
      brand &&
      vehicle_type &&
      daily_rate &&
      hourly_rate &&
      status &&
      year &&
      license_plate &&
      img
    )
  ) {
    return NextResponse.json(
      { error: "Please provide all input fields" },
      { status: 422 }
    );
  }

  // Decode base64 image and write to disk
  const imageBuffer = Buffer.from(img, "base64");
  const filePath = path.join(
    process.cwd(),
    "public/uploads",
    `${Date.now()}-${model}.jpg` // Use model in filename
  );

  try {
    // Write the image file to disk asynchronously
    await fs.writeFile(filePath, imageBuffer);

    const connection = await db.getConnection();

    try {
      // Insert vehicle data into the vehicles table
      await connection.beginTransaction();
      const result = await executeQuery(
        "INSERT INTO vehicles (model, brand, vehicle_type, daily_rate, hourly_rate, status, year, license_plate, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          model,
          brand,
          vehicle_type,
          daily_rate,
          hourly_rate,
          status,
          year,
          license_plate,
          `/uploads/${path.basename(filePath)}`,
        ]
      );
      await connection.commit();
      return NextResponse.json(
        {
          id: result.insertId,
          message: "Vehicle Added Successfully",
          ok: true,
        },
        { status: 200 }
      );
    } catch (error) {
      await connection.rollback();
      return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
      connection.release();
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error writing the image file" },
      { status: 500 }
    );
  }
};
