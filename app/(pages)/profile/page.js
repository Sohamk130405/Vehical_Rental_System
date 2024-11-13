"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { format, differenceInHours } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: session, status } = useSession(); // Get session data
  const [customer, setCustomer] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [method, setMethod] = useState("cash");
  useEffect(() => {
    const fetchRentalHistory = async () => {
      try {
        const response = await fetch("/api/rental/" + session.user.id); // Adjust endpoint to fetch rentals for the logged-in customer
        if (response.ok) {
          const data = await response.json();
          console.log(data.rentals);
          setRentalHistory(data.rentals);
        } else {
          console.error("Failed to fetch rental history");
        }
      } catch (error) {
        console.error("Error fetching rental history:", error);
      }
    };
    if (status === "authenticated" && session?.user) {
      setCustomer(session.user);
      console.log("sd");
      fetchRentalHistory();
    }
  }, [session, status]);

  const openDialog = (rental) => {
    setSelectedRental(rental);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedRental(null);
    setIsDialogOpen(false);
  };

  const handleMakePayment = async () => {
    if (!selectedRental) return;
    const amount = (
      differenceInHours(new Date(), new Date(selectedRental.created_at)) *
      selectedRental.hourly_rate
    ).toFixed(2);
    try {
      const response = await fetch(`/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rental_id: selectedRental.rental_id,
          amount: amount,
          method,
        }),
      });

      if (response.ok) {
        setRentalHistory((prevHistory) =>
          prevHistory.map((rental) =>
            rental.id === selectedRental.id
              ? { ...rental, payment_status: "paid" }
              : rental
          )
        );
        closeDialog();
        toast({
          title: "Payment Successfull",
          description: "Thanks for using our service",
        });
      } else {
        return toast({
          title: "Payment Failed",
          description: "Something went wrong. Try again later.",
        });
      }
    } catch (error) {
      return toast({
        title: "Payment Failed",
        description: "Something went wrong. Try again later.",
      });
    }
  };

  return (
    <div className="profile-page">
      {/* Profile Section */}
      {customer && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p>
                <strong>Name:</strong> {customer.name}
              </p>
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {customer.phone_number}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rental History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Booked Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Rental Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentalHistory.map((rental) => (
                <TableRow
                  key={rental.rental_id}
                  onClick={() => openDialog(rental)}
                >
                  <TableCell>{rental.brand + " " + rental.model}</TableCell>
                  <TableCell>
                    {format(new Date(rental.rental_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{rental.status}</TableCell>
                  <TableCell>
                    {rental.payment_status ? rental.payment_status : "pending"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for making payment */}
      {selectedRental && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rental Payment Details</DialogTitle>
            </DialogHeader>
            <div>
              <p>
                <strong>Customer:</strong> {selectedRental.name}
              </p>
              <p>
                <strong>Vehicle:</strong>{" "}
                {selectedRental.brand + " " + selectedRental.model}
              </p>
              <p>
                <strong>Rental Date:</strong>{" "}
                {format(
                  new Date(selectedRental.created_at),
                  "MMM d, yyyy, h:mm a"
                )}
              </p>
              <p>
                <strong>Status:</strong> {selectedRental.status}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                {selectedRental.payment_status
                  ? selectedRental.payment_status
                  : "pending"}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹
                {selectedRental.payment_status === "paid"
                  ? selectedRental.total_cost
                  : (
                      differenceInHours(
                        new Date(),
                        new Date(selectedRental.created_at)
                      ) * selectedRental.hourly_rate
                    ).toFixed(2)}
              </p>
            </div>

            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit card</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleMakePayment}
              disabled={selectedRental.payment_status === "paid"}
            >
              {selectedRental.payment_status === "paid"
                ? "Payment Completed"
                : "Make Payment"}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProfilePage;
