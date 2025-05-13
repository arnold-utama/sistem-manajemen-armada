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
    limit: 5,
    offset: 0,
  });

  function getTotalPage() {
    return Math.ceil(
      parseInt(vehicleResponse.links.last.split("page[offset]=")[1]) /
        page.limit +
        1
    );
  }

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
  }, [page]);

  function handlePrevPage() {
    if (vehicleResponse.links.prev) {
      setPage((prevPage) => ({
        ...prevPage,
        offset: prevPage.offset - prevPage.limit,
      }));
    }
  }

  function handleNextPage() {
    if (vehicleResponse.links.next) {
      setPage((prevPage) => ({
        ...prevPage,
        offset: prevPage.offset + prevPage.limit,
      }));
    }
  }

  return (
    <div className="w-screen p-10">
      <h1 className="text-4xl font-bold mb-4">Vehicle List</h1>
      <div className="flex flex-wrap w-full gap-4 mb-5">
        {vehicleResponse.data.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
      <label>Data per page: </label>
      <select
        value={page.limit}
        className="select w-auto"
        onChange={(e) => setPage({ limit: Number(e.target.value), offset: 0 })}
      >
        <option>5</option>
        <option>10</option>
        <option>15</option>
      </select>
      <p>
        Showing {page.offset + 1} to {page.offset + page.limit} of {page.limit * getTotalPage()} data
      </p>
      <div className="join">
        <button
          className="join-item btn"
          onClick={handlePrevPage}
          disabled={!vehicleResponse.links.prev}
        >
          «
        </button>
        <button className="join-item btn">
          Page {Math.floor(page.offset / page.limit) + 1}
        </button>
        <button
          className="join-item btn"
          onClick={handleNextPage}
          disabled={!vehicleResponse.links.next}
        >
          »
        </button>
      </div>
      {vehicleResponse.links.last && <p>Total Page: {getTotalPage()}</p>}
    </div>
  );
}
