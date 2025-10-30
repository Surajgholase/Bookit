import { useSearchParams, Link } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function ResultPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const refId = searchParams.get("refId");

  const isSuccess = status === "success";

  return (
    <div className="bg-white flex-grow flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        {isSuccess ? (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Booking Confirmed
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Ref ID:{" "}
              <span className="font-semibold text-gray-800">{refId}</span>
            </p>
          </>
        ) : (
          <>
            <FaExclamationCircle className="text-6xl text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Booking Failed
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              We couldn't complete your booking. Please try again.
            </p>
          </>
        )}

        <Link
          to="/"
          className="px-6 py-2 bg-gray-200 text-black text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ResultPage;
