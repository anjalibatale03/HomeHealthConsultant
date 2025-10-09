import React, { useEffect, useRef, useState } from "react";
import homeIcon from "../../../../assets/home_02.png";
import docIcon from "../../../../assets/doc_02.png";

const Map = ({ lat, lng, profId }) => {
  const [refId, setRefId] = useState(null); // user id from localStorage
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const platformRef = useRef(null);
  const currentMarkerRef = useRef(null); // fixed marker from props
  const liveMarkerRef = useRef(null); // live updating marker from socket
  const socketRef = useRef(null); // socket reference

  const pointQueueRef = useRef([]); // queue for incoming lat/lng
  const animatingRef = useRef(false); // flag to track animation

  console.log("profId", profId);

  useEffect(() => {
    const ref_id = localStorage.getItem("clgrefId");
    setRefId(ref_id);
  }, []);

  // 👉 Helper: fit map to show both markers smoothly
  const fitMapToMarkers = () => {
    if (!mapInstanceRef.current) return;
    if (!currentMarkerRef.current || !liveMarkerRef.current) return;

    const currentPos = currentMarkerRef.current.getGeometry();
    const livePos = liveMarkerRef.current.getGeometry();

    let north = Math.max(currentPos.lat, livePos.lat);
    let south = Math.min(currentPos.lat, livePos.lat);
    let east = Math.max(currentPos.lng, livePos.lng);
    let west = Math.min(currentPos.lng, livePos.lng);

    // 🧭 Expand bounding box by a small margin (in degrees)
    const latMargin = (north - south) * 0.3 || 0.01; // add 30% or min margin
    const lngMargin = (east - west) * 0.3 || 0.01;

    north += latMargin;
    south -= latMargin;
    east += lngMargin;
    west -= lngMargin;

    const expandedBox = new window.H.geo.Rect(north, west, south, east);

    mapInstanceRef.current.getViewModel().setLookAtData(
      {
        bounds: expandedBox,
        // keep small padding for UI space
        padding: 100,
      },
      true // animate transition
    );
  };

  // Load Here Maps
  const loadHereMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.H) return resolve();

      const script = document.createElement("script");
      script.src = "https://js.api.here.com/v3/3.1/mapsjs-core.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const script2 = document.createElement("script");
        script2.src = "https://js.api.here.com/v3/3.1/mapsjs-service.js";
        script2.async = true;
        script2.defer = true;
        script2.onload = () => {
          const script3 = document.createElement("script");
          script3.src = "https://js.api.here.com/v3/3.1/mapsjs-ui.js";
          script3.async = true;
          script3.defer = true;
          script3.onload = () => {
            const script4 = document.createElement("script");
            script4.src = "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js";
            script4.async = true;
            script4.defer = true;
            script4.onload = resolve;
            script4.onerror = reject;
            document.body.appendChild(script4);
          };
          document.body.appendChild(script3);
        };
        document.body.appendChild(script2);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadHereMaps().then(() => {
      if (!window.H) return;
      if (mapInstanceRef.current) return;

      const platform = new window.H.service.Platform({
        apikey: "FscCo6SQsrummInzClxlkdETkvx5T1r8VVI25XMGnyY",
      });
      platformRef.current = platform;

      const defaultLayers = platform.createDefaultLayers();
      const map = new window.H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        { center: { lat: 18.54203586384748, lng: 73.87729808634725 }, zoom: 10 }
      );

      new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
      // window.H.ui.UI.createDefault(map, defaultLayers);

      mapInstanceRef.current = map;

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.dispose();
          mapInstanceRef.current = null;
        }
      };
    });
  }, []);

  // 👇 Create/Update fixed marker whenever lat/lng changes
  useEffect(() => {
    if (lat && lng && mapInstanceRef.current) {
      console.log("Render map for:", { lat, lng, profId });

      if (currentMarkerRef.current) {
        mapInstanceRef.current.removeObject(currentMarkerRef.current);
      }

      // const icon = new window.H.map.Icon("assets/home_02.png", {
      //   size: { w: 32, h: 32 },
      // });

      const icon = new window.H.map.Icon(homeIcon, {
        size: { w: 32, h: 32 },
      });

      const marker = new window.H.map.Marker({ lat, lng }, { icon });
      mapInstanceRef.current.addObject(marker);
      currentMarkerRef.current = marker;

      // 👇 Center/fit logic
      if (liveMarkerRef.current) {
        fitMapToMarkers(); // show both markers
      } else {
        mapInstanceRef.current.setCenter({ lat, lng });
      }
    }
  }, [lat, lng, profId]);

  // 👉 Animate live marker smoothly
  const animateMarker = (from, to, duration = 10000) => {
    if (!mapInstanceRef.current) return;
    animatingRef.current = true;

    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const lat = from.lat + (to.lat - from.lat) * progress;
      const lng = from.lng + (to.lng - from.lng) * progress;

      if (liveMarkerRef.current) {
        liveMarkerRef.current.setGeometry({ lat, lng });
      } else {
        // const icon = new window.H.map.Icon("assets/doc_02.png", {
        //   size: { w: 32, h: 32 },
        // });

        const icon = new window.H.map.Icon(docIcon, {
          size: { w: 32, h: 32 },
        });

        liveMarkerRef.current = new window.H.map.Marker({ lat, lng }, { icon });
        mapInstanceRef.current.addObject(liveMarkerRef.current);

        // 👇 First time live marker appears, fit map to show both
        if (currentMarkerRef.current) {
          fitMapToMarkers();
        }
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        animatingRef.current = false;
        if (pointQueueRef.current.length > 1) {
          const nextFrom = pointQueueRef.current.shift();
          const nextTo = pointQueueRef.current[0];
          animateMarker(nextFrom, nextTo, duration);
        }
      }
    };

    requestAnimationFrame(step);
  };

  // 👉 Queue updates for live marker
  const updateLiveMarker = (latitude, longitude) => {
    const newPoint = { lat: latitude, lng: longitude };
    pointQueueRef.current.push(newPoint);

    if (pointQueueRef.current.length >= 2 && !animatingRef.current) {
      const from = pointQueueRef.current.shift();
      const to = pointQueueRef.current[0];
      animateMarker(from, to);
    }
  };

  // 👉 Setup WebSocket connection
  useEffect(() => {
    if (!profId || !refId) return;

    if (socketRef.current) socketRef.current.close();

    const socketUrl = `ws://192.168.1.109:2689/ws/location/?user_id=${refId}&group_id=${profId}`;
    const ws = new WebSocket(socketUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected:", socketUrl);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.latitude && data.longitude) {
          console.log("📍 Live update:", data);
          updateLiveMarker(data.latitude, data.longitude);
        }
      } catch (error) {
        console.error("❌ Error parsing socket message:", error);
      }
    };

    ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
    ws.onclose = () => console.log("🔌 WebSocket Disconnected");

    return () => ws.close();
  }, [profId, refId]);

  return <div ref={mapRef} style={{ width: "100%", height: "300px" }} />;
};

export default Map;
