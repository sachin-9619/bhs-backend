import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const API_BASE = "https://bhs-backend-production.up.railway.app/api";

export default function RouteModal({ route, onClose, onSave }) {
  const [busName, setBusName] = useState("");
  const [busType, setBusType] = useState("ac");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState(40);
  const [price, setPrice] = useState(0);
  const [stops, setStops] = useState(""); // comma-separated

  useEffect(() => {
    if (route) {
      setBusName(route.bus_name || "");
      setBusType(route.bus_type || "ac");
      setDeparture(route.departure || "");
      setDestination(route.destination || "");
      setDepartureTime(route.departure_time || "");
      setArrivalTime(route.arrival_time || "");
      setAvailableSeats(route.available_seats || 40);
      setPrice(route.price || 0);
      setStops(route.routePoints ? route.routePoints.join(", ") : "");
    } else {
      resetForm();
    }
  }, [route]);

  const resetForm = () => {
    setBusName("");
    setBusType("ac");
    setDeparture("");
    setDestination("");
    setDepartureTime("");
    setArrivalTime("");
    setAvailableSeats(40);
    setPrice(0);
    setStops("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!busName || !departure || !destination || !departureTime || !arrivalTime) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      busName,
      busType,
      departure,
      destination,
      departureTime,
      arrivalTime,
      availableSeats,
      price,
      stops,
    };

    try {
      if (route) {
        // EDIT
        await axios.put(`${API_BASE}/routes/${route.id}`, payload);
      } else {
        // ADD
        await axios.post(`${API_BASE}/routes`, payload);
      }
      onSave();
    } catch (err) {
      console.error("Save route failed:", err);
      alert("Failed to save route. Check console.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-2xl">
        <button
          onClick={onClose}
          className="absolute text-gray-600 top-4 right-4 hover:text-gray-900"
        >
          <FaTimes />
        </button>

        <h2 className="mb-6 text-2xl font-bold">{route ? "Edit Route" : "Add Route"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Bus Name"
              value={busName}
              onChange={(e) => setBusName(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <select
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="ac">AC</option>
              <option value="non-ac">Non-AC</option>
            </select>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Departure City"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Destination City"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
          </div>

          <div className="flex gap-4">
            <input
              type="time"
              placeholder="Departure Time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              type="time"
              placeholder="Arrival Time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
          </div>

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Seats"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(Number(e.target.value))}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="flex-1 p-2 border rounded"
            />
          </div>

          <input
            type="text"
            placeholder="Stops (comma separated)"
            value={stops}
            onChange={(e) => setStops(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full py-2 mt-4 text-white transition bg-blue-500 rounded hover:bg-blue-600"
          >
            {route ? "Update Route" : "Add Route"}
          </button>
        </form>
      </div>
    </div>
  );
}
