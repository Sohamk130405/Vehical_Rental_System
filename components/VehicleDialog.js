"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const VehicleDialog = ({ vehicle, onUpdate, onDelete }) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState(vehicle);
  const { toast } = useToast();
  const isAdmin = session?.user?.role === "admin";
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        const response = await fetch(`/api/vehicles/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...editedVehicle, vehicleId: vehicle.id }),
        });

        if (response.ok) {
          const updatedVehicle = await response.json();
          onUpdate(updatedVehicle);
          setIsEditing(false);
          toast({
            title: "Vehicle updated",
            description: "The vehicle details have been successfully updated.",
          });
        } else {
          throw new Error("Failed to update vehicle");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update vehicle. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/vehicles`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleId: vehicle.id }),
      });

      if (response.ok) {
        onDelete(vehicle.vehicle_id);
        toast({
          title: "Vehicle deleted",
          description: "The vehicle has been successfully deleted.",
        });
      } else {
        throw new Error("Failed to delete vehicle");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAlertOpen(false); // Close the alert dialog
    }
  };

  const handleRent = async () => {
    if (vehicle.status === "rented" || vehicle.status === "maintenance") return;
    try {
      const response = await fetch(`/api/rental`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: session.user.id, // Get the logged-in user's ID
          vehicle_id: vehicle.vehicle_id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Rental successful",
          description: "Thank you for renting the vehicle!",
        });

        onUpdate({ ...vehicle, status: "rented" });
      } else {
        throw new Error("Failed to complete rental");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete rental. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Vehicle" : vehicle.model}
          </DialogTitle>
          <DialogDescription>by {vehicle.brand}</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4">
          <Image
            src={vehicle.img}
            alt={vehicle.model}
            width={600}
            height={400}
            className="rounded-lg object-cover w-full"
          />
          <div>
            {isEditing ? (
              <>
                <Label htmlFor="name">Vehicle Model</Label>
                <Input
                  id="model"
                  name="model"
                  value={editedVehicle.model}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Label htmlFor="name">Vehicle Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={editedVehicle.brand}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedVehicle.description}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      name="type"
                      value={editedVehicle.type}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Rental Price Per Day</Label>
                    <Input
                      id="daily_rate"
                      name="daily_rate"
                      value={editedVehicle.daily_rate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Type</Label>
                    <p>{vehicle.type}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Rental Price</Label>
                  <p className="text-2xl font-bold">
                    ₹{vehicle.daily_rate}/day
                  </p>
                </div>
              </>
            )}
            {isAdmin && (
              <div className="flex justify-between mt-4">
                <Button onClick={handleEdit} variant="outline">
                  {isEditing ? "Save" : "Edit"}
                  <Pencil className="w-4 h-4 ml-2" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Delete
                      <Trash2 className="w-4 h-4 ml-2" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this vehicle? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            {!isAdmin && (
              <Button className="mt-4 w-full" onClick={handleRent}>
                {vehicle.status === "rented" ? "Rented" : "Rent Vehicle"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
