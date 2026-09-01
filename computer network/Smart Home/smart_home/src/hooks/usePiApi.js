import { useEffect, useState } from "react";
import { PI_API } from "../constants/config";
import { api } from "../utils/api";

export function usePiApi() {
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState({
    window1: "closed",
    window2: "closed",
    light: false,
    fan: "off",
    door: "closed",
  });

  const [temp, setTemp] = useState(null);
  const [soil, setSoil] = useState(null);
  const [motion, setMotion] = useState(false);
  const [sensorStatus, setSensorStatus] = useState("starting");
  const [rainRaw, setRainRaw] = useState(null);
  const [rainStatus, setRainStatus] = useState(null);

  async function refreshState() {
    try {
      const s = await api(PI_API, "/api/state");
      setState((prev) => ({ ...prev, ...s }));
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }

  async function refreshTemp() {
    try {
      const t = await api(PI_API, "/api/temperature");
      setTemp(t.temperature_c ?? null);
      setSoil(t.rain_raw ?? null);
      setMotion(!!t.motion);
      setSensorStatus(t.sensor_status || "starting");
      setRainRaw(t.rain_raw ?? null);
      setRainStatus(t.rain_status ?? null);
    } catch (err) {
      console.error("refreshTemp failed:", err);
    }
  }

  async function act(path) {
    try {
      setBusy(true);
      await api(PI_API, path, "POST");
      await refreshState();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refreshState();
    refreshTemp();
    const a = setInterval(refreshState, 1500);
    const b = setInterval(refreshTemp, 2500);

    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  return {
    connected,
    busy,
    state,
    temp,
    soil,
    motion,
    sensorStatus,
    rainRaw,
    rainStatus,
    act,
  };
}