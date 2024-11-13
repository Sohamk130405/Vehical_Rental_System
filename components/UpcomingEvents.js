import React from "react";

const UpcomingEvents = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Upcoming Rental Events</h2>
      <div className="space-y-4">
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Summer Road Trip Event</h3>
          <p>Date: June 10-20, 2023</p>
          <p>
            Join us for a special summer road trip event with discounts on all
            rentals!
          </p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Adventure Weekend</h3>
          <p>Date: July 15-17, 2023</p>
          <p>
            Rent any vehicle and get a free adventure kit for your weekend
            getaway!
          </p>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
