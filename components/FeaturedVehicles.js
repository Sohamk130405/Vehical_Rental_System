import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";



const FeaturedVehicles = ({ filteredVehicles }) => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Featured Vehicles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader className="p-0">
              <Image
                src={vehicle.image}
                alt={vehicle.title}
                width={600}
                height={400}
                className="rounded-t-lg object-cover h-48 w-full"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle>{vehicle.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2">
                by {vehicle.brand}
              </p>
              <p className="text-sm text-muted-foreground">
                {vehicle.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
              <span className="font-semibold">${vehicle.price}/hour</span>
              <Button>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedVehicles;
