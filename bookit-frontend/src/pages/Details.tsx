import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface Experience {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  location: string;
}

interface Slot {
  _id: string;
  experience_id: string;
  start_time: string;
  total_capacity: number;
  booked_count: number;
}

interface DetailsData {
  experience: Experience;
  slots: Slot[];
}

const formatDateShort = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDateLong = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<DetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/experiences/${id}`
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const { uniqueDates, slotsByDate } = useMemo(() => {
    const dates: { [key: string]: Slot[] } = {};
    data?.slots.forEach((slot) => {
      const datePart = slot.start_time.split("T")[0];
      if (!dates[datePart]) {
        dates[datePart] = [];
      }
      dates[datePart].push(slot);
    });
    return {
      uniqueDates: Object.keys(dates).sort(),
      slotsByDate: dates,
    };
  }, [data]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: Slot) => {
    if (slot.booked_count >= slot.total_capacity) return;
    setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (!selectedSlot || !data) return;

    const params = new URLSearchParams();
    params.set("expId", data.experience._id);
    params.set("slotId", selectedSlot._id);
    params.set("expName", data.experience.name);
    params.set("price", data.experience.price.toString());
    params.set("date", formatDateLong(selectedSlot.start_time));
    params.set("time", formatTime(selectedSlot.start_time));

    navigate(`/checkout?${params.toString()}`);
  };

  if (loading) return <p className="text-center p-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 p-10">{error}</p>;
  if (!data) return <p className="text-center p-10">No data found.</p>;

  const { experience } = data;
  const taxes = 59; // From screenshot
  const subtotal = experience.price;
  const total = subtotal + taxes;

  return (
    <div className="bg-white min-h-full">
      <div className="container mx-auto max-w-6xl p-8">
        <Link
          to="/"
          className="text-sm font-medium text-gray-700 hover:text-black mb-6 inline-block">
          &larr; Details
        </Link>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow lg:w-2/3">
            <img
              src={experience.image_url}
              alt={experience.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg mb-6"
            />
            <h1 className="text-4xl font-bold mb-4">{experience.name}</h1>
            <p className="text-base text-gray-600 mb-6">
              {experience.description} Helmet and Life jackets along with an
              expert will accompany in kayaking.
            </p>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Choose date</h2>
              <div className="flex flex-wrap gap-3">
                {uniqueDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium
                      ${
                        selectedDate === date
                          ? "bg-yellow-400 border-yellow-400 text-black"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }
                    `}>
                    {formatDateShort(date)}
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Choose time</h2>
                <div className="flex flex-wrap gap-3">
                  {slotsByDate[selectedDate].map((slot) => {
                    const isSelected = selectedSlot?._id === slot._id;
                    const isSoldOut = slot.booked_count >= slot.total_capacity;
                    const remaining = slot.total_capacity - slot.booked_count;

                    return (
                      <button
                        key={slot._id}
                        onClick={() => handleSlotSelect(slot)}
                        disabled={isSoldOut}
                        className={`px-4 py-2 rounded-md border text-sm font-medium
                          ${
                            isSelected
                              ? "bg-yellow-400 border-yellow-400 text-black"
                              : isSoldOut
                              ? "bg-gray-100 border-gray-200 text-gray-400 line-through cursor-not-allowed"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }
                        `}>
                        {formatTime(slot.start_time)}
                        <span className="text-xs ml-2 opacity-75">
                          {isSoldOut ? "(Sold Out)" : `(${remaining} left)`}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  All times are in IST (GMT+5:30)
                </p>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-700">
                  Scenic routes, trained guides, and safety briefing. Minimum
                  age 10.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-gray-50 rounded-lg shadow-lg p-6 sticky top-8 border border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Starts at</span>
                  <span className="text-gray-900 font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantity</span>
                  <span className="text-gray-900 font-medium">1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900 font-medium">₹{taxes}</span>
                </div>
              </div>
              <hr className="my-4 border-gray-300" />
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-xl font-bold">₹{total}</span>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedSlot}
                className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow
                  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
                  hover:bg-yellow-500 transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
