import { useState } from "react";
import VehicleDetailsModal from "./VehicleDetailsModal";
import type { Vehicle } from "./HomePage";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="card card-border bg-base-100 shadow-sm w-[32%]">
      <div className="card-body">
        <h2 className="card-title">{vehicle.attributes.label}</h2>
        <p>Status: {vehicle.attributes.current_status}</p>
        <p>
          Latitude & Longitude: {vehicle.attributes.latitude},{" "}
          {vehicle.attributes.longitude}
        </p>
        <p>
          Last Updated:{" "}
          {new Date(vehicle.attributes.updated_at).toLocaleString()}
        </p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Details
          </button>
        </div>
      </div>
      {isModalOpen && (
        <VehicleDetailsModal
          vehicleId={vehicle.id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
