import { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import profileImage from "../../../assets/3d-cartoon-doctor-character-face-mask_1048-12992-removebg-preview 1.png";
import cancelImage from "../../../assets/allocation cancelled.png";
import { useNavigate } from "react-router-dom";

const Broadcast = ({ zoneID, eventPlanID, eventID, size = 300 }) => {
    console.log(eventID, 'eventeventIDIDeventID');
    const navigate = useNavigate();

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem("token");
    const waveColors = ["#3b82f6", "#22c55e", "#f59e0b"];

    const letterSize = 24;
    const radius = size / 2;
    const letterRadius = letterSize / 2;

    const [positions, setPositions] = useState([]);
    const [names, setNames] = useState([]);
    const [spotlight, setSpotlight] = useState(null);
    const [noProfessionalMsg, setNoProfessionalMsg] = useState(false);
    const socketRef = useRef(null);

    const connectWebSocket = (eventID) => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        socketRef.current = new WebSocket(`ws://192.168.1.109:2689/ws/active_notification`);

        let disconnectTimeout = setTimeout(() => {
            console.warn("No professional name received in 30 sec, closing WebSocket ❌");
            socketRef.current?.close();
            setNoProfessionalMsg(true);
        }, 30000);

        socketRef.current.onopen = () => {
            console.log("WebSocket connected ✅");

            const message = { eve_id: eventID };
            socketRef.current.send(JSON.stringify(message));

            console.log(`Sent eve_id: ${eventID}`);
        };

        socketRef.current.onmessage = (msg) => {
            console.log("Message from WebSocket:", msg.data);

            try {
                const data = JSON.parse(msg.data);
                if (Array.isArray(data) && data.length > 0 && data[0].prof_name) {
                    clearTimeout(disconnectTimeout); // Cancel timeout
                    setSpotlight({ prof_fullname: data[0].prof_name });
                    setNoProfessionalMsg(false);
                }
            } catch (error) {
                console.error("Invalid WebSocket message:", error);
            }
        };

        socketRef.current.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket disconnected");
            clearTimeout(disconnectTimeout);
        };
    };

    useEffect(() => {
        if (zoneID && eventPlanID) {
            axios.post(
                `${port}/web/Broadcasting/`,
                {
                    zones: zoneID,
                    eve_poc_id: eventPlanID
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            )
                .then(res => {
                    console.log("Broadcast successful:", res.data);
                    if (res.data?.professionals) {
                        setNames(res.data.professionals.map(p => p.prof_fullname));
                        connectWebSocket(eventID);
                    }
                })
                .catch(err => {
                    console.error("Broadcast error:", err);
                });
        }
    }, [zoneID, eventPlanID]);

    useEffect(() => {
        if (names.length > 0) {
            const newPositions = names.map((name) => {
                let x, y;
                do {
                    x = Math.random() * (size - letterSize) + letterRadius;
                    y = Math.random() * (size - letterSize) + letterRadius;
                } while (
                    Math.sqrt((x - radius) ** 2 + (y - radius) ** 2) > radius - letterRadius
                );

                return {
                    name,
                    x: x - letterRadius,
                    y: y - letterRadius
                };
            });
            setPositions(newPositions);
        }
    }, [size, names]);

    if (noProfessionalMsg) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    textAlign: "center",
                    animation: "fadeIn 0.8s ease-in-out",
                }}
            >
                <Box
                    sx={{
                        borderRadius: "12px",
                        padding: "20px 30px",
                        maxWidth: "400px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    <img
                        src={cancelImage}
                        alt="Cancel Service"
                        style={{
                            width: "300px",
                            height: "250px",
                            marginBottom: "7px",
                            animation: "zoomBounce 0.9s ease-in-out"
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            color: "#b71c1c",
                            textAlign: "center",
                            animation: "slideUp 0.8s ease-in-out 0.2s forwards",
                            opacity: 0
                        }}
                    >
                        No professional accepted your service
                    </Typography>

                    <Box
                        component="button"
                        onClick={() => window.location.reload()}
                        sx={{
                            mt: 2,
                            backgroundColor: "#b71c1c",
                            color: "#fff",
                            padding: "8px 20px",
                            fontSize: "16px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "#941616"
                            }
                        }}
                    >
                        Cancel
                    </Box>
                </Box>

                <style>
                    {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes zoomBounce {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); }
                }
                @keyframes slideUp {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                `}
                </style>
            </Box>
        );
    }

    if (spotlight) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    textAlign: "center",
                    padding: 4,
                    animation: "fadeIn 1s ease-in-out"
                }}
            >
                <Box
                    component="img"
                    src={profileImage}
                    alt={spotlight.prof_fullname}
                    sx={{
                        width: 260,
                        height: 250,
                        borderRadius: "50%",
                        objectFit: "cover",
                        mb: 2,
                        animation: "bounceIn 1s ease",
                    }}
                />
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ animation: "slideUp 0.8s ease forwards", color: "#134a46", ml: 3 }}
                >
                    {spotlight.prof_fullname}
                </Typography>
                <Typography
                    variant="h6"
                    color="#000000"
                    mt={1}
                    sx={{
                        fontWeight: "bold",
                        ml: 3,
                        mb: 3
                    }}
                >
                    Allocated Successfully ...
                </Typography>

                <Box
                    component="button"
                    onClick={() => navigate("/ongoing")}
                    sx={{
                        backgroundColor: "#134a46",
                        color: "#fff",
                        padding: "8px 20px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: "#0f3935"
                        }
                    }}
                >
                    OK
                </Box>

                <style>
                    {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes bounceIn {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); }
                }
                @keyframes slideUp {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                `}
                </style>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: "relative",
                width: size,
                height: size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: "50%"
            }}
        >
            {/* Core red dot */}
            <Box
                sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    boxShadow: "0 0 10px red",
                    zIndex: 2,
                    animation: "pulse 1.5s infinite"
                }}
            />

            {[1, 2, 3].map((wave, index) => (
                <Box
                    key={index}
                    sx={{
                        position: "absolute",
                        borderRadius: "50%",
                        border: `10px solid ${waveColors[index]}`,
                        width: "99%",
                        height: "100%",
                        animation: `waveAnim 2s ${index * 0.5}s infinite ease-out`
                    }}
                />
            ))}

            {positions.map((pos, i) => (
                <Box
                    key={i}
                    sx={{
                        position: "absolute",
                        left: pos.x,
                        top: pos.y,
                        backgroundColor: "#333",
                        color: "#fff",
                        borderRadius: "16px",
                        padding: "2px 6px",
                        fontSize: "12px",
                        zIndex: 3,
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        userSelect: "none"
                    }}
                >
                    {pos.name}
                </Box>
            ))}

            <style>
                {`
                    @keyframes waveAnim {
                        0% { transform: scale(0.3); opacity: 1; }
                        100% { transform: scale(1); opacity: 0; }
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.2); opacity: 0.7; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `}
            </style>
        </Box>
    );
};

export default Broadcast;
