import { useEffect, useState } from "react";
import { api } from "../helpers/axios";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

interface VehicleDetailsModalProps {
  vehicleId: string;
  onClose: () => void;
}

interface VehicleDetail {
  attributes: {
    label: string;
    current_status: string;
    latitude: number;
    longitude: number;
    updated_at: string;
  };
  id: string;
  relationships: {
    route: {
      data: {
        id: string;
      };
    };
    trip: {
      data: {
        id: string;
      };
    };
  };
}

export default function VehicleDetailsModal({
  vehicleId,
  onClose,
}: VehicleDetailsModalProps) {
  const [vehicle, setVehicle] = useState<VehicleDetail>({
    attributes: {
      label: "",
      current_status: "",
      latitude: 0,
      longitude: 0,
      updated_at: "",
    },
    id: "",
    relationships: {
      route: {
        data: {
          id: "",
        },
      },
      trip: {
        data: {
          id: "",
        },
      },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicleDetails() {
      try {
        setLoading(true);
        const { data } = await api.get(`/vehicles/${vehicleId}`);
        setVehicle(data.data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
        onClose();
        if (error instanceof AxiosError) {
          if (error.status === 429) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Too Many Requests",
            });
          } else if (error.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Vehicle not found",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Internal server error",
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchVehicleDetails();
  }, []);

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="bg-white p-5 rounded shadow-lg flex flex-col items-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-5 rounded shadow-lg w-1/4">
        <h2 className="text-xl font-bold">Vehicle Details</h2>
        <MapContainer
          center={[vehicle.attributes.latitude, vehicle.attributes.longitude]}
          zoom={13}
          scrollWheelZoom={true}
          className="my-4"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[
              vehicle.attributes.latitude,
              vehicle.attributes.longitude,
            ]}
          >
          </Marker>
        </MapContainer>
        <p>
          <strong>Label:</strong> {vehicle.attributes.label}
        </p>
        <p>
          <strong>Status:</strong> {vehicle.attributes.current_status}
        </p>
        <p>
          <strong>Latitude:</strong> {vehicle.attributes.latitude}
        </p>
        <p>
          <strong>Longitude:</strong> {vehicle.attributes.longitude}
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {new Date(vehicle.attributes.updated_at).toLocaleString()}
        </p>
        <p>
          <strong>Route:</strong> {vehicle.relationships.route.data.id}
        </p>
        <p>
          <strong>Trip:</strong> {vehicle.relationships.trip.data.id}
        </p>
        <button className="btn btn-primary mt-4" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
