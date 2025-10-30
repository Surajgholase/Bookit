import { useState, useEffect } from "react";
import axios from "axios";
import ExperienceCard from "../components/ExperienceCard";

interface Experience {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  location?: string;
}

function HomePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/experiences");
        setExperiences(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch experiences. Is the backend running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="container p-8 mx-auto max-w-7xl">
        {loading && <p className="text-center">Loading experiences...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {experiences.map((exp) => (
              <ExperienceCard key={exp._id} experience={exp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
