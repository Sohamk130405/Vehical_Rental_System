import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, getUserByEmail, executeQuery } from "@/lib/db";
export const POST = async (req) => {
  const {
    name,
    licenseNumber,
    email,
    password,
    confirmPassword,
    address,
    phone,
  } = await req.json();

  if (
    !(
      name &&
      licenseNumber &&
      email &&
      password &&
      confirmPassword &&
      address &&
      phone
    )
  ) {
    return NextResponse.json(
      { error: "Please provide all input fields" },
      { status: 422 }
    );
  }
  if (password !== confirmPassword)
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );

  const connection = await db.getConnection();

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert new user
    const results = executeQuery(
      "INSERT INTO users (name,license_number, email, password,address,phone_number) VALUES (?, ?, ?, ?, ?,?)",
      [name, licenseNumber, email, hashedPassword, address, phone]
    );
    await connection.commit();
    return NextResponse.json(
      { message: "User successfully registered" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    connection.release();
  }
};
