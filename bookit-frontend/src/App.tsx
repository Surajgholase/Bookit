import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import DetailsPage from "./pages/Details";
import CheckoutPage from "./pages/Checkout";
import ResultPage from "./pages/Result";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/experience/:id" element={<DetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
