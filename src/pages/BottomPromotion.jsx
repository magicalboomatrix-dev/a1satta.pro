import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function BottomAdsSection() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchAds() {
      try {
        const res = await api.get("/ads", {
          params: { position: "bottom" },
        });

        if (Array.isArray(res.data) && isMounted) {
          // backend already sorted, just filter active
          setAds(res.data.filter(ad => ad.isActive !== false));
        }
      } catch (err) {
        console.error("Error fetching bottom ads:", err);
      }
    }

    fetchAds();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!ads.length) return null;

  return (
    <section
      className="ads-container"
      style={{ marginTop: 0, marginBottom: 5 }}
    >
      {ads.map((ad) => (
        <div key={ad._id} className="column-ad">
          <div
            className="card-body"
            style={{
              boxSizing: "border-box",
              flex: "1 1 auto",
              padding: "1rem 0.5rem",
              border: "2px dashed red",
              background: "linear-gradient(#ffd800, #FFFFFF)",
              borderRadius: 20,
              fontWeight: "bold",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                width: "100%",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: ad.content }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}



