import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GeoRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect from root path, and only once per session
    if (location.pathname !== "/" || sessionStorage.getItem("geo-checked")) return;
    sessionStorage.setItem("geo-checked", "1");

    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        if (data?.country_code === "ES") {
          navigate("/es", { replace: true });
        }
      })
      .catch(() => {});
  }, [navigate, location.pathname]);

  return null;
};

export default GeoRedirect;
