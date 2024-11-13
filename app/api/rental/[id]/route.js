import { db, executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  const { id } = await res.params;
  const connection = await db.getConnection();
  try {
    const results = await executeQuery(
      `SELECT r.*, v.brand, v.model, v.hourly_rate, c.name, c.phone_number,
              p.amount AS payment_amount, p.payment_date, p.payment_method, p.status AS payment_status
       FROM users c
       JOIN rentals r ON r.customer_id = c.user_id
       JOIN vehicles v ON v.vehicle_id = r.vehicle_id
       LEFT JOIN payments p ON p.rental_id = r.rental_id
       WHERE c.user_id = ?`,
      [id]
    );

    return NextResponse.json({ rentals: results }, { status: 200 });
  } catch (error) {
    console.error("Error fetching rentals and payment details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};
