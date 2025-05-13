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

interface Filter {
  routes: string[];
  trips: string[];
}

interface Route {
  id: string;
}

interface Trip {
  id: string;
}

interface Page {
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

  const [routes, setRoutes] = useState<Route[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);

  const [filter, setFilter] = useState<Filter>({
    routes: [],
    trips: [],
  });

  const [page, setPage] = useState<Page>({
    limit: 5,
    offset: 0,
  });

  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [tripLoading, setTripLoading] = useState(false);

  function getTotalPage() {
    return Math.ceil(
      parseInt(vehicleResponse.links?.last?.split("page[offset]=")[1]) /
        page.limit +
        1
    );
  }

  useEffect(() => {
    async function fetchRoutes() {
      try {
        setRouteLoading(true);
        const { data } = await api.get("/routes?page[limit]=20");
        setRoutes(data.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setRouteLoading(false);
      }
    }
    fetchRoutes();
  }, []);

  useEffect(() => {
    async function fetchTrips() {
      if (!filter.routes.length) return;
      try {
        setTripLoading(true);
        const { data } = await api.get(
          `/trips?filter[route]=${filter.routes}&page[limit]=20`
        );
        setTrips(data.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setTripLoading(false);
      }
    }
    fetchTrips();
  }, [filter.routes]);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        setVehicleLoading(true);
        const { data } = await api.get(
          `/vehicles?filter[route]=${filter.routes}&fields[trip]=${filter.trips}&page[limit]=${page.limit}&page[offset]=${page.offset}`
        );
        setVehicleResponse(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setVehicleLoading(false);
      }
    }
    fetchVehicles();
  }, [page]);

  function handlePrevPage() {
    if (vehicleResponse.links?.prev) {
      setPage((prevPage) => ({
        ...prevPage,
        offset: prevPage.offset - prevPage.limit,
      }));
    }
  }

  function handleNextPage() {
    if (vehicleResponse.links?.next) {
      setPage((prevPage) => ({
        ...prevPage,
        offset: prevPage.offset + prevPage.limit,
      }));
    }
  }

  return (
    <div className="w-screen p-10">
      <h1 className="text-4xl font-bold mb-4">Vehicle List</h1>
      <div>
        <label>Filter by Route: </label>
        <br />
        <select
          multiple={true}
          defaultValue={[]}
          className="select h-auto"
          onChange={(e) => {
            setFilter({
              trips: [],
              routes: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            });
            setPage((prev) => ({
              ...prev,
              offset: 0,
            }));
          }}
        >
          {routeLoading ? (
            <option>Loading routes...</option>
          ) : (
            routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.id}
              </option>
            ))
          )}
        </select>
      </div>

      {filter.routes.length !== 0 && (
        <div className="mt-4">
          <label>Filter by Trip: </label>
          <br />
          <select
            multiple={true}
            defaultValue={[]}
            className="select h-auto"
            onChange={(e) => {
              setFilter((prev) => ({
                ...prev,
                trips: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              }));
              setPage((prev) => ({
                ...prev,
                offset: 0,
              }));
            }}
          >
            {tripLoading ? (
              <option>Loading trips...</option>
            ) : (
              trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.id}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      <div className="flex flex-wrap w-full gap-4 my-5">
        {vehicleLoading ? (
          <div className="w-full flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : vehicleResponse.data.length ? (
          vehicleResponse.data.map((vehicle, i) => (
            <VehicleCard key={`${vehicle.id}-${i}`} vehicle={vehicle} />
          ))
        ) : (
          <p className="text-center w-full">No data available</p>
        )}
      </div>

      {vehicleResponse.data.length ? (
        <div>
          <label>Data per page: </label>
          <select
            value={page.limit}
            className="select w-auto"
            onChange={(e) =>
              setPage({ limit: Number(e.target.value), offset: 0 })
            }
          >
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>
          <p>
            Showing {page.offset + 1} to {page.offset + page.limit} of{" "}
            {page.limit * getTotalPage()} data
          </p>
          <div className="join">
            <button
              className="join-item btn"
              onClick={handlePrevPage}
              disabled={!vehicleResponse.links?.prev}
            >
              «
            </button>
            <button className="join-item btn">
              Page {Math.floor(page.offset / page.limit) + 1}
            </button>
            <button
              className="join-item btn"
              onClick={handleNextPage}
              disabled={!vehicleResponse.links?.next}
            >
              »
            </button>
          </div>
          {vehicleResponse.links?.last && <p>Total Page: {getTotalPage()}</p>}
        </div>
      ) : null}
    </div>
  );
}
