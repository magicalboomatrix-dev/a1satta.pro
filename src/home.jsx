import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FAQ from "./assets/components/faq";
import Readmore from "./assets/components/Readmore";
import Clock from "./pages/clock";
import api from "./utils/api";
import LiveGameResult from "./pages/LiveGameResult";
import GroupTable from "./pages/GroupTable";
import MonthlyGroupTable from "./pages/MonthlyGroupTable";
import CustomAds from "./pages/CustomAds";
import BottomAds from "./pages/BottomPromotion";

import Luckynumber from "./assets/components/Luckynumber";
import MiddleAdsSection from "./pages/MiddleAdsSection";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
	  const currentYear = new Date().getFullYear();
  const startYear = 2024;

  // Fetch games from backend
  useEffect(() => {
    let cancelled = false;
    const fetchGames = async () => {
      try {
        const res = await api.get("/games");
        if (cancelled) return;
        setGames(res.data);
        if (res.data.length > 0) setSelectedGame(res.data[0].name);
      } catch (err) {
        console.error("Failed to fetch games:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchGames();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCheck = () => {
  if (!selectedGame || !selectedYear) return;

  const gameSlug = selectedGame
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

navigate(`/chart-${selectedYear}/${gameSlug}-satta-king-result`);
};  

const UpcomingResults = ({ loadingInitial }) => {
  const [cards, setCards] = useState(
    new Array(3).fill(null).map(() => ({
      name: "",
      resultTime: "--",
      latestResult: null,
      minutesUntil: null,
      loading: true
    }))
  );

  const mountedRef = useRef(false);
  const intervalRef = useRef(null);
  const controllerRef = useRef(null);

  // Convert "18:30" -> "6:30 PM"
  const to12Hour = (timeStr) => {
    if (!timeStr || timeStr === "--") return "--";
    const [h, m] = timeStr.split(":");
    let hour = parseInt(h, 10);
    const minutes = parseInt(m, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const fetchOnce = async () => {
    try {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      const r = await api.get("/upcoming?limit=5", {
        signal: controllerRef.current.signal
      });

      const data = r.data;
      if (!mountedRef.current) return;

      if (Array.isArray(data.cards)) {
        const mapped = data.cards.map((c) => ({
          name: c.name || "—",
          resultTime: c.resultTime ? to12Hour(c.resultTime) : "--",
          latestResult: c.latestResult ?? null,
          minutesUntil: c.minutesUntil ?? null,
          loading: false
        }));

        while (mapped.length < 3)
          mapped.push({
            name: "--",
            resultTime: "--",
            latestResult: null,
            minutesUntil: null,
            loading: false
          });

        setCards(mapped.slice(0, 3));
      } else {
        setCards(
          new Array(3).fill(null).map(() => ({
            name: "--",
            resultTime: "--",
            latestResult: null,
            minutesUntil: null,
            loading: false
          }))
        );
      }
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.warn("Upcoming fetch failed", err);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchOnce();
    intervalRef.current = setInterval(fetchOnce, 30000);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  const Card = ({ card }) => {
    const showWaiting = !card.latestResult;

    return (
      <section className="circlebox2">
        <div>
          <div className="sattaname">
            <p style={{ margin: 0 }}>{card.name}</p>
          </div>

          <div className="sattaresult">
            <p style={{ margin: 0, padding: 0 }}>
              <span style={{ letterSpacing: 4 }}>
                {card.loading ? (
                  "--"
                ) : showWaiting ? (
                  <img
                    src="images/d.gif"
                    alt="wait icon"
                    height={50}
                    width={50}
                  />
                ) : (
                  card.latestResult
                )}
              </span>
            </p>

            <p
              style={{
                margin: 0,
                fontSize: 14,
                marginTop: 5,
                fontWeight: "bold"
              }}
            >
              <small style={{ color: "white" }}>{card.resultTime}</small>
            </p>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div>
      <Card card={cards[2]} />
      <Card card={cards[0]} />
      <Card card={cards[1]} />
    </div>
  );
};
  return (
    <div>
      <section className="circlebox">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="liveresult">
                <div id="clockbox">
                  <Clock />
                </div>
                <p className="hintext" style={{ padding: 0 }}>
                  हा भाई यही आती हे सबसे पहले खबर रूको और देखो
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- REPLACED GALI BLOCK ---------- */}
      <UpcomingResults games={games} loading={loading} />
      {/* ---------- end replaced block ---------- */}

      <LiveGameResult
        gameName="disawar"
        imgArrow="images/arrow.gif"
        imgWait="images/d.gif"
      />

      {/* <div
        style={{
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          margin: "0.5rem auto",
          backgroundColor: "rgb(255, 255, 255)",
          overflow: "hidden",
          border: 0,
          borderRadius: "0.25rem",
        }} className="lucky-number-section"
      >
        <div className="rows">
          <div
            className="card-body notification munda"
            style={{
              display: "block",
              minHeight: 1,
              padding: "1.25rem",
              border: "1px dashed red",
              background: "#FFC107",
              borderRadius: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <div><h2><b>आज की पकड़ जोड़ी</b></h2></div>
				<Luckynumber />		
            
            
          </div>
        </div>
      </div> */}
{/*       
      <div
        style={{
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          margin: "0.5rem auto",
          backgroundColor: "rgb(255, 255, 255)",
          overflow: "hidden",
          border: 0,
          borderRadius: "0.25rem",
        }}
      >
        <div className="rows">
          <div
            className="card-body notification munda "
            style={{
              flex: "1 1 auto",
              minHeight: 1,
              padding: "1.25rem",
              border: "1px dashed red",
              background: "#FFC107",
              borderRadius: 20,
              fontWeight: "bold",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            <h2><b>मुंडा 01 से 100 नम्बरो तक की राशि/फैमिली</b></h2>
            <Link className="btnlink header_btn blck" to="/01-100-ki-family">
                    Check <span class="arw">→</span>
                </Link>
            
            
          </div>
        </div>
      </div> */}
      <CustomAds />

      <GroupTable groupName="gr1" />

      <GroupTable groupName="gr2" />
      <MiddleAdsSection/>  

      
      <div
        style={{
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          margin: "0.5rem auto",
          backgroundColor: "rgb(255, 255, 255)",
          overflow: "hidden",
          border: 0,
          borderRadius: "0.25rem",
        }}

        className="card-body notification munda blv-section"
      >
        <div className="rows" style={{width: "100%",}}>
          <div
            className="card-body notification"
            style={{
              flex: "1 1 auto",
              minHeight: 1,
              padding: "1.25rem",
              border: "1px dashed red",
              background: "#FFC107",
              borderRadius: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {/* <h2>
              जिस व्यक्ति को तेज़ और विश्वसनीय परिणाम चाहिए, वे हमारे{" "}
              <Link to="https://whatsapp.com/channel/0029Vb6z44e17Ems4yyjTj0y">
                <strong> WhatsApp</strong>
              </Link>{" "} चैनल से जुड़ सकते हैं।
            </h2> */}
          </div>
        </div>
      </div>

      
      <section className="octoberresultchart">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h5>SATTA RECORD CHART {new Date().getFullYear()}</h5>
            </div>
          </div>
        </div>
      </section>

      <div className="Select_selectMainDiv__QD2cf">
        <select
          aria-label="satta game name"
          className="Select_selectTag__IzyVd"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          {games.map((game) => (
            <option key={game._id} value={game.name}>
              {game.name}
            </option>
          ))}
        </select>
        <select
          aria-label="year"
          className="Select_selectTag__IzyVd Select_secondTag__Q9uV_"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {Array.from(
            { length: currentYear - startYear + 1 },
            (_, i) => startYear + i
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button className="header_btn" type="button" onClick={handleCheck}>
          Check <span className="arw">→</span>
        </button>
      </div>
      <section className="octoberresultchart">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2>
                <b>
                  SATTA RESULT CHART{" "}
                  {new Date()
                    .toLocaleString("en-US", { month: "long" })
                    .toUpperCase()}{" "}
                  {new Date().getFullYear()}
                </b>
              </h2>
            </div>
          </div>
        </div>
      </section>
      <MonthlyGroupTable groupName="gr1" />
      <MonthlyGroupTable groupName="gr2" />

            <BottomAds />

		

      <FAQ />
    </div>
  );
};

export default Home;




