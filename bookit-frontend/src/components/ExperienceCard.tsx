import React from "react";
import { Link } from "react-router-dom";

interface Experience {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  location?: string;
}

interface Props {
  experience: Experience;
}

const ExperienceCard: React.FC<Props> = ({ experience }) => {
  return (
    <Link to={`/experience/${experience._id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-xl">
        <img
          src={experience.image_url}
          alt={experience.name}
          className="w-full h-48 object-cover"
        />

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-900">
              {experience.name}
            </h2>
            {experience.location && (
              <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                {experience.location}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4 flex-grow">
            {experience.description}
          </p>

          <div className="flex justify-between items-center mt-auto">
            <p className="text-lg font-semibold text-gray-800">
              <span className="text-sm font-normal text-gray-500">From </span>₹
              {experience.price}
            </p>
            <span className="px-4 py-1.5 bg-yellow-400 text-black text-sm font-semibold rounded-md group-hover:bg-yellow-500 transition-colors">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExperienceCard;
