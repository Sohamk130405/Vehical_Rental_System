"use client";

import * as React from "react";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "@/components/Footer";
import FeaturedVehicles from "@/components/FeaturedVehicles";
import Link from "next/link";

// Mock data for vehicles
const vehicles = [
  {
    id: 1,
    title: "Luxury Sedan",
    brand: "Mercedes-Benz",
    description: "A luxurious sedan perfect for business trips.",
    price: 120,
    type: "Sedan",
    image:
      "https://images.pexels.com/photos/376674/pexels-photo-376674.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 2,
    title: "Sporty Convertible",
    brand: "BMW",
    description: "A sporty convertible for the adventurous soul.",
    price: 200,
    type: "Convertible",
    image:
      "https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 3,
    title: "Family SUV",
    brand: "Toyota",
    description: "Spacious and comfortable bike for small trips.",
    price: 150,
    type: "Bike",
    image:
      "https://images.pexels.com/photos/12163946/pexels-photo-12163946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 4,
    title: "Electric Hatchback",
    brand: "Tesla",
    description: "Eco-friendly electric hatchback for city drives.",
    price: 180,
    type: "Electric",
    image:
      "https://images.pexels.com/photos/14674139/pexels-photo-14674139.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

// Mock data for rental packages
const rentalPackages = [
  {
    id: 1,
    title: "Weekend Getaway",
    description: "Rent for 2-3 days with a special discounted price.",
  },
  {
    id: 2,
    title: "Long-Term Rental",
    description: "Enjoy a month-long rental with affordable rates.",
  },
  {
    id: 3,
    title: "Daily Rental",
    description: "Pay per day for short-term needs.",
  },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("All");

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "All" || vehicle.type === selectedType)
  );

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden rounded-xl">
        <Image
          src="https://images.unsplash.com/photo-1674719645138-c3fd1aaf8307?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Featured Vehicle"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Our Vehicle Rental Service
          </h1>
          <p className="text-xl mb-8">Rent a vehicle for your next adventure</p>
          <Button size="lg" asChild>
            <Link href={"/rentals"}>Explore Rentals</Link>
          </Button>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="Convertible">Convertible</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <FeaturedVehicles filteredVehicles={filteredVehicles} />

      {/* Rental Packages Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Our Rental Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalPackages.map((packageItem) => (
            <div
              key={packageItem.id}
              className="p-6 border rounded-lg shadow-md hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2">
                {packageItem.title}
              </h3>
              <p className="text-sm text-gray-600">{packageItem.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
