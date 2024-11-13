import { db, executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  const { rental_id, amount, method } = await req.json();

  if (!rental_id && amount && method) {
    return NextResponse.json(
      { error: "Required fileds are missing" },
      { status: 400 }
    );
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await executeQuery(`CALL InsertPayment(?,?,?)`, [
      rental_id,
      amount,
      method,
    ]);

    await connection.commit();

    return NextResponse.json(
      {
        message: "Payment successful",
        ok: true,
      },
      { status: 201 }
    );
  } catch (error) {
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};
