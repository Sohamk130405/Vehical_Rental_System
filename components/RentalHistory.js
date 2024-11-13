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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const RentalHistory = () => {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRentalHistory = async () => {
      try {
        const response = await fetch("/api/rental"); // Adjust endpoint as needed
        if (response.ok) {
          const data = await response.json();
          setRentalHistory(data.rentals);
        } else {
          console.error("Failed to fetch rental history");
        }
      } catch (error) {
        console.error("Error fetching rental history:", error);
      }
    };
    fetchRentalHistory();
  }, []);

  const openDialog = (rental) => {
    setSelectedRental(rental);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedRental(null);
    setIsDialogOpen(false);
  };

  const handleCloseRental = async () => {
    if (!selectedRental) return;
    const amount = (
      differenceInHours(new Date(), new Date(selectedRental.created_at)) *
      selectedRental.hourly_rate
    ).toFixed(2);
    try {
      const response = await fetch(`/api/rental/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rental_id: selectedRental.rental_id,
          totalAmount: amount,
          vehicle_id: selectedRental.vehicle_id,
        }),
      });

      if (response.ok) {
        setRentalHistory((prevHistory) =>
          prevHistory.map((rental) =>
            rental.id === selectedRental.id
              ? { ...rental, status: "completed" }
              : rental
          )
        );
        closeDialog();
      } else {
        console.error("Failed to close rental");
      }
    } catch (error) {
      console.error("Error closing rental:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental History</CardTitle>
        <CardDescription>
          View all rentals processed in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rental Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentalHistory.map((rental) => (
              <TableRow
                key={rental.rental_id}
                onClick={() => openDialog(rental)}
              >
                <TableCell>{rental.name}</TableCell>
                <TableCell>{rental.brand + " " + rental.model}</TableCell>
                <TableCell>{rental.status}</TableCell>
                <TableCell>
                  {format(new Date(rental.rental_date), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog for showing rental details */}
      {selectedRental && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rental Details</DialogTitle>
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
                <strong>Phone:</strong> {selectedRental.phone_number}
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
              {/* Calculate rental duration and cost */}
              <p>
                <strong>Total Cost:</strong>
                {` ₹${(
                  differenceInHours(
                    new Date(),
                    new Date(selectedRental.created_at)
                  ) * selectedRental.hourly_rate
                ).toFixed(2)}`}
              </p>
              {/* Payment Status */}
              <p>
                <strong>Payment Status:</strong>{" "}
                {selectedRental.payment_amount ? "Done" : "Pending"}
              </p>
              {selectedRental.payment_amount && (
                <>
                  <p>
                    <strong>Payment Amount:</strong> ₹
                    {selectedRental.payment_amount}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {selectedRental.payment_method}
                  </p>
                </>
              )}
            </div>
            <Button
              onClick={handleCloseRental}
              disabled={
                selectedRental.status === "completed" ||
                selectedRental.payment_status === "paid"
              }
            >
              {selectedRental.status === "completed"
                ? "Rental Completed"
                : selectedRental.payment_status === "paid"
                ? "Payment Completed"
                : "Close Rental"}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default RentalHistory;
