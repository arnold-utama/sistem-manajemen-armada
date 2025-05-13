import { useEffect, useState } from "react";
import { api } from "../helpers/axios";
import VehicleCard from "./VehicleCard";

interface VehicleResponse {
  data: Vehicle[];
  links: {
    first: string;
    last: string;
    next: string;
    prev: string;
  };
}

export interface Vehicle {
  attributes: {
    label: string;
    current_status: string;
    latitude: number;
    longitude: number;
    updated_at: string;
  };
  id: string;
}

interface page {
  limit: number;
  offset: number;
}

export default function HomePage() {
  const [vehicleResponse, setVehicleResponse] = useState<VehicleResponse>({
    data: [],
    links: {
      first: "",
      last: "",
      next: "",
      prev: "",
    },
  });

  const [page, setPage] = useState<page>({
    limit: 10,
    offset: 0,
  });

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const { data } = await api.get(
          `/vehicles?page[limit]=${page.limit}&page[offset]=${page.offset}`
        );
        setVehicleResponse(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }
    fetchVehicles();
  }, []);

  return (
    <div className="w-screen p-10">
      <h1 className="text-4xl font-bold mb-4">Vehicle List</h1>
      <div className="flex flex-wrap w-full gap-4">
        {vehicleResponse.data.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
