import { useEffect, useState } from "react";
import { CAM_API } from "../constants/config";
import { api } from "../utils/api";

export function useCameraApi(activePage) {
  const [camConnected, setCamConnected] = useState(false);
  const [camStatus, setCamStatus] = useState(null);
  const [camEvents, setCamEvents] = useState([]);

  const [regName, setRegName] = useState("");
  const [regStatus, setRegStatus] = useState(null);
  const [regBusy, setRegBusy] = useState(false);
  const [regError, setRegError] = useState("");

  const regActive = !!regStatus?.active;
  const regCaptured = regStatus?.captured ?? 0;
  const regTarget = regStatus?.target ?? 5;
  const regReadyToFinish = regActive && regCaptured >= regTarget;

  async function refreshCameraStatus() {
    try {
      const s = await api(CAM_API, "/api/camera/status");
      setCamStatus(s);
      setCamConnected(true);
    } catch {
      setCamConnected(false);
    }
  }

  async function refreshCameraEvents() {
    try {
      const e = await api(CAM_API, "/api/camera/events?limit=20");
      setCamEvents(e);
      setCamConnected(true);
    } catch {
      setCamConnected(false);
    }
  }

  async function refreshRegStatus() {
    try {
      const s = await api(CAM_API, "/api/register/status");
      setRegStatus(s);
      setCamConnected(true);
    } catch {
      // ignore
    }
  }

  async function regStart() {
    try {
      setRegBusy(true);
      setRegError("");
      const name = regName.trim();
      if (!name) throw new Error("Name is required.");

      const q = new URLSearchParams({ name });
      const r = await api(CAM_API, `/api/register/start?${q.toString()}`, "POST");
      setRegStatus(r.status || r);
    } catch (e) {
      setRegError(String(e?.message || e));
    } finally {
      setRegBusy(false);
    }
  }

  async function regCapture() {
    try {
      setRegBusy(true);
      setRegError("");
      const r = await api(CAM_API, "/api/register/capture", "POST");
      setRegStatus(r.status || r);
    } catch (e) {
      setRegError(String(e?.message || e));
      await refreshRegStatus();
    } finally {
      setRegBusy(false);
    }
  }

  async function regFinish() {
    try {
      setRegBusy(true);
      setRegError("");
      await api(CAM_API, "/api/register/finish", "POST");
      await refreshRegStatus();
      setRegName("");
    } catch (e) {
      setRegError(String(e?.message || e));
    } finally {
      setRegBusy(false);
    }
  }

  useEffect(() => {
    if (activePage !== "entrance") return;

    refreshCameraStatus();
    refreshCameraEvents();
    refreshRegStatus();

    const s = setInterval(refreshCameraStatus, 1000);
    const e = setInterval(refreshCameraEvents, 2500);
    const r = setInterval(refreshRegStatus, 1500);

    return () => {
      clearInterval(s);
      clearInterval(e);
      clearInterval(r);
    };
  }, [activePage]);

  return {
    camConnected,
    setCamConnected,
    camStatus,
    camEvents,
    regName,
    setRegName,
    regStatus,
    regBusy,
    regError,
    regActive,
    regCaptured,
    regTarget,
    regReadyToFinish,
    refreshCameraStatus,
    refreshCameraEvents,
    refreshRegStatus,
    regStart,
    regCapture,
    regFinish,
  };
}