"use client";

import * as React from "react";
import Image from "next/image";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import VehicleDialog from "@/components/VehicleDialog"; // Custom Dialog for vehicle actions
import { useSession } from "next-auth/react"; // Import useSession to get the session user
import { Loader2 } from "lucide-react"; // Import loader icon
import { toast } from "@/hooks/use-toast";

export default function ViewVehiclesPage() {
  const { data: session } = useSession(); // Get the session user
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("All");
  const [priceRange, setPriceRange] = React.useState([0, 100000]);
  const [vehicles, setVehicles] = React.useState([]);
  const [showMyVehicles, setShowMyVehicles] = React.useState(false); // State for filtering by user
  const [loading, setLoading] = React.useState(true); // Loading state

  const [newVehicleDialogOpen, setNewVehicleDialogOpen] = React.useState(false);
  const [newVehicle, setNewVehicle] = React.useState({
    model: "",
    brand: "",
    vehicle_type: "Car",
    daily_rate: 0,
    hourly_rate: 0,
    status: "available",
    year: 2020,
    license_plate: "",
    img: "",
  });
  const [imagePreview, setImagePreview] = React.useState(null); // State for image preview

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.model
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "All" || vehicle.vehicle_type === selectedType;
    const matchesPrice =
      vehicle.daily_rate >= priceRange[0] &&
      vehicle.daily_rate <= priceRange[1];
    const matchesUser = !showMyVehicles || vehicle.owner_id === session.user.id; // Check if it matches the user's ID

    return matchesSearch && matchesType && matchesPrice && matchesUser;
  });

  React.useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true); // Set loading to true
      try {
        const res = await fetch(`/api/vehicles/`);
        const data = await res.json();
        console.log(data.vehicles);
        setVehicles(data.vehicles);
      } catch (error) {
        toast({
          title: "Oh no! An error occurred.",
          description: "Something went wrong, try again later.",
        });
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchVehicles();
  }, []);

  const onUpdate = (updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((veh) =>
        veh.vehicle_id === updatedVehicle.vehicle_id ? updatedVehicle : veh
      )
    );
  };

  const onDelete = (deletedId) => {
    setVehicles((prev) => prev.filter((veh) => veh.vehicle_id !== deletedId));
  };

  const handleNewVehicleChange = (e) => {
    const { name, value, files } = e.target;

    setNewVehicle((prev) => {
      const updatedVehicle = { ...prev, [name]: value };

      if (name === "img" && files?.[0]) {
        const file = files[0]; // Ensure it's the first file
        setImagePreview(URL.createObjectURL(file)); // Create image preview URL
        updatedVehicle.img = file; // Store the file itself, not the URL
      }

      return updatedVehicle;
    });
  };

  const handleNewVehicleSubmit = async () => {
    const file = newVehicle.img; // It should now be a valid File object

    if (file) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1]; // Strip the base64 prefix
        const payload = { ...newVehicle, img: base64Image };

        try {
          const res = await fetch("/api/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const data = await res.json();
            setVehicles((prev) => [...prev, data.vehicle]);
            setNewVehicleDialogOpen(false); // Close dialog after successful submission
            toast({
              title: "Vehicle Added!",
              description: "Your vehicle has been added for rental.",
            });
          } else {
            const errorData = await res.json();
            toast({
              title: "Submission Failed",
              description:
                errorData.message || "Something went wrong, try again later.",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "There was an issue adding the vehicle.",
          });
        }
      };

      reader.readAsDataURL(file); // This is where the reader is triggered
    } else {
      alert("Please select an image file.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">View Vehicles</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Car">Car</SelectItem>
            <SelectItem value="Bike">Bike</SelectItem>
            <SelectItem value="Van">Van</SelectItem>
            <SelectItem value="Bus">Bus</SelectItem>
          </SelectContent>
        </Select>
        {session && session.user.role === "admin" && (
          <>
            <Button
              onClick={() => setShowMyVehicles((prev) => !prev)}
              variant="outline"
            >
              {showMyVehicles ? "Show All Vehicles" : "My Vehicles"}
            </Button>
            <Dialog
              open={newVehicleDialogOpen}
              onOpenChange={setNewVehicleDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vehicle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="mb-2 space-y-2">
                      <label htmlFor="model">Vehicle Model</label>
                      <Input
                        id="model"
                        name="model"
                        placeholder="Vehicle Model"
                        value={newVehicle.model}
                        onChange={handleNewVehicleChange}
                      />
                    </div>
                    <div className="mb-2 space-y-2">
                      <label htmlFor="brand">Brand</label>
                      <Input
                        id="brand"
                        name="brand"
                        placeholder="Brand"
                        value={newVehicle.brand}
                        onChange={handleNewVehicleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-2 space-y-2">
                    <label htmlFor="vehicle_type">Vehicle Type</label>
                    <Select
                      id="vehicle_type"
                      name="vehicle_type"
                      value={newVehicle.vehicle_type}
                      onValueChange={(value) =>
                        setNewVehicle({ ...newVehicle, vehicle_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="Bike">Bike</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Bus">Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between">
                    <div className="mb-2 space-y-2">
                      <label htmlFor="daily_rate">Hourly Rate</label>
                      <Input
                        id="hourly_rate"
                        name="hourly_rate"
                        type="number"
                        placeholder="hourly Rate"
                        value={newVehicle.hourly_rate}
                        onChange={handleNewVehicleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-2 space-y-2">
                    <label htmlFor="license_plate">License Plate</label>
                    <Input
                      id="license_plate"
                      name="license_plate"
                      placeholder="License Plate"
                      value={newVehicle.license_plate}
                      onChange={handleNewVehicleChange}
                    />
                  </div>
                  <div className="mb-2 space-y-2">
                    <label htmlFor="image">Vehicle Image</label>
                    <Input
                      id="img"
                      name="img"
                      type="file"
                      accept="image/*"
                      onChange={handleNewVehicleChange}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Image preview"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleNewVehicleSubmit} className="w-full">
                    Add Vehicle
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {loading ? (
        <Loader2 className="w-6 h-6 mx-auto text-muted-foreground" />
      ) : filteredVehicles.length === 0 ? (
        <p>No vehicles found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.vehicle_id}>
              <CardHeader>
                <Image
                  src={vehicle.img || "/placeholder.png"}
                  alt={vehicle.model}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover h-48 w-full"
                />
              </CardHeader>
              <CardContent className="p-4 flex justify-between">
                <div className="flex flex-col">
                  <p className="text-muted-foreground mb-2">{vehicle.brand}</p>
                  <CardTitle>{vehicle.model}</CardTitle>
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-bold">
                    ₹{vehicle.hourly_rate}/hr
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4">
                <VehicleDialog
                  vehicle={vehicle}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
