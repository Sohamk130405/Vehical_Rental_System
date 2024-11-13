import { NextResponse } from "next/server";
import { db, executeQuery } from "@/lib/db";

export const GET = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const results = await executeQuery(`SELECT * FROM rental_payment_details`);

    return NextResponse.json({ rentals: results }, { status: 200 });
  } catch (error) {
    console.error("Error fetching rentals and payment details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};

export const POST = async (req, res) => {
  const { vehicle_id, customer_id } = await req.json();

  if (!(vehicle_id && customer_id)) {
    return NextResponse.json({ error: "Id's are missing." }, { status: 404 });
  }

  try {
    const connection = await db.getConnection();
    try {
      // Insert vehicle data into the vehicles table
      await connection.beginTransaction();
      const rentalDate = new Date().toISOString().split("T")[0]; // Gets 'YYYY-MM-DD'
      const result = await executeQuery(
        "INSERT INTO rentals (customer_id, vehicle_id, rental_date) VALUES (?, ?, ?)",
        [customer_id, vehicle_id, rentalDate]
      );
      await executeQuery(
        `UPDATE vehicles SET status = ? WHERE vehicle_id = ?`,
        ["rented", vehicle_id]
      );
      await connection.commit();

      return NextResponse.json(
        {
          id: result.insertId,
          message: "Vehicle Rented Successfully",
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
      { error: "Error renting vehicle" },
      { status: 500 }
    );
  }
};

export const PUT = async (req, res) => {
  const { rental_id, totalAmount, vehicle_id } = await req.json();
  if (!(rental_id && totalAmount && vehicle_id)) {
    return NextResponse.json(
      { error: "Id's or amount is missing." },
      { status: 404 }
    );
  }
  const connection = await db.getConnection();
  try {
    // Insert vehicle data into the vehicles table
    await connection.beginTransaction();

    await executeQuery(`CALL CompleteRental(?,?)`, [rental_id, vehicle_id]);

    await connection.commit();

    return NextResponse.json(
      {
        message: "Rental Completed Successfully",
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
};
