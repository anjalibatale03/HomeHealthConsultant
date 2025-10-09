import React, { useState, useEffect, useRef } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import { IoSend } from "react-icons/io5";
import { MdDoneAll, MdDone, MdArrowDownward } from "react-icons/md";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Avatar } from "@mui/material";
import { Snackbar, Alert, Button } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { MdStop } from "react-icons/md";
import AddIcon from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from '@mui/icons-material/Videocam';

function HDChat({ selectedId, selectedProfessionalName, selectedProfClgId, profClgId, getProfessionalListForChat, setProfessionalListChat }) {
    console.log(selectedId, 'selectedId');
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const clgId = localStorage.getItem('clg_id');
    console.log(clgId, 'loginId');

    console.log(selectedProfClgId, 'selectedProfClgId');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (selectedId) {
            createGroup();
            fetchProfessionalDetails(selectedId);
        }
        return () => {
            clearInterval(intervalRef.current);
        };
    }, [selectedId]);

    const createGroup = async () => {
        if (!profClgId || !clgId || !accessToken) return;

        try {
            const response = await fetch(`${port}/web/chat/groups/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prof_grp: profClgId,
                    members: [profClgId, clgId],
                }),
            });

            if (response.status === 200 || response.status === 201) {
                setOpenSnackbar(true);

                setProfessionalListChat((prevList) =>
                    prevList.map((prof) =>
                        prof.prof_clg_id === profClgId
                            ? { ...prof, msg_count: prof.msg_count }
                            : prof
                    )
                );

                // getProfessionalListForChat((prevList) =>
                //     prevList.map((prof) =>
                //         prof.prof_clg_id === profClgId
                //             ? { ...prof, msg_count: prof.msg_count + 1 }
                //             : prof
                //     )
                // );

                // intervalRef.current = setInterval(() => {
                //     fetchProfessionalDetails(selectedId);
                // }, 1000);
            }
        } catch (error) {
            console.error("Group creation failed:", error);
        }
    };

    const [seenUserIds, setSeenUserIds] = useState([]);

    console.log(seenUserIds, 'seenUserIds');

    const fetchProfessionalDetails = async () => {
        try {
            const response = await fetch(`${port}/web/chat/messages/group/${profClgId}/${clgId}/`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            let data = await response.json();
            let userIds = [];

            if (Array.isArray(data) && data.length >= 2) {
                const last = data[data.length - 1];
                const secondLast = data[data.length - 2];

                if (last && last.user_lst_msg_seen_id !== undefined) {
                    console.log("✅ Seen Users List:", last.user_lst_msg_seen_id);
                    setSeenUserIds(last.user_lst_msg_seen_id)
                    data.pop(); // remove last
                }

                if (secondLast && secondLast.user_ids) {
                    userIds = secondLast.user_ids;
                    data.pop(); // remove second last
                }
            }

            const getLabel = (dateStr) => {
                const date = new Date(dateStr);
                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                const isSameDay = (d1, d2) =>
                    d1.getFullYear() === d2.getFullYear() &&
                    d1.getMonth() === d2.getMonth() &&
                    d1.getDate() === d2.getDate();

                if (isSameDay(date, today)) return "Today";
                if (isSameDay(date, yesterday)) return "Yesterday";
                return date.toDateString();
            };

            const messagesWithDates = [];
            let lastDate = null;

            data.forEach((msg) => {
                const label = getLabel(msg.last_modified_date);
                if (lastDate !== label) {
                    lastDate = label;
                    messagesWithDates.push({
                        type: 'date-label',
                        label: label,
                    });
                }

                const isSentByMe = msg.sender?.id?.toString() === clgId?.toString();

                messagesWithDates.push({
                    id: isSentByMe ? 0 : 1,
                    // message: msg.message,
                    status: msg.msg_status,
                    ch_msg_id: msg.ch_msg_id,
                    time: formatTime(msg.added_date),
                    senderName: msg.sender?.name || "Unknown",
                    showSenderName: userIds.length > 2,
                    type: 'chat-message',
                    message: msg.message,
                    msg_type: msg.msg_type,
                    msg_file: msg.msg_file,
                });
            });

            setMessages(messagesWithDates);

        } catch (error) {
            console.error("Fetching messages failed:", error);
        }
    };

    const formatTime = (dateString) => {
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        return new Date(dateString).toLocaleTimeString('en-US', options);
    };

    const modalRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setOpenModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const chatContainerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [showNames, setShowNames] = useState(false);

    const handleClick = () => {
        setShowNames(prev => !prev);
    };
    const getColorForSender = (name) => {
        const colors = ['#1976d2', '#d32f2f', '#388e3c', '#f57c00', '#7b1fa2', '#00796b', '#5d4037', '#455a64'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash % colors.length);
        return colors[index];
    };

    const handleSend = async () => {
        // TEXT MESSAGE ONLY
        if (!recording && input.trim() && !selectedImage) {
            const newMessage = {
                id: 0,
                message: input,
                msg_type: 1,
                time: formatTime(new Date())
            };
            setMessages((prev) => [...prev, newMessage]);
            const messageToSend = input;
            setInput("");
            try {
                await fetch(`${port}/web/chat/messages/send/`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        group: profClgId,
                        sender: clgId,
                        message: messageToSend,
                        msg_type: 1,
                    }),
                });

                // ✅ Update chat list
                setProfessionalListChat((prevList) => {
                    const updatedList = prevList.map((item) =>
                        item.prof_clg_id === profClgId
                            ? {
                                ...item,
                                msg_count: item.msg_count || 0,
                                last_message: input,
                                last_msg_time: new Date().toISOString(),
                            }
                            : item
                    );

                    const updatedItem = updatedList.find((item) => item.prof_clg_id === profClgId);
                    const others = updatedList.filter((item) => item.prof_clg_id !== profClgId);
                    return [updatedItem, ...others];
                });

            } catch (error) {
                console.error("Error sending text message:", error);
            }
        }

        // IMAGE MESSAGE (with or without text)
        else if (selectedImage) {
            const formData = new FormData();
            formData.append("group", profClgId);
            formData.append("sender", clgId);
            formData.append("msg_type", 4);
            formData.append("message", input || "");
            formData.append("msg_file", selectedImage);

            const previewMessage = {
                id: 0,
                msg_type: 4,
                msg_file: previewUrl,
                message: input || "",
                sending: true,
                time: formatTime(new Date())
            };
            setMessages((prev) => [...prev, previewMessage]);

            try {
                const response = await fetch(`${port}/web/chat/messages/send/`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: formData,
                });

                if (!response.ok) throw new Error("Failed to send image");

                const resData = await response.json();

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg === previewMessage
                            ? {
                                ...msg,
                                id: resData?.id || 0,
                                msg_file: resData?.msg_file || msg.msg_file,
                                sending: false,
                            }
                            : msg
                    )
                );

                setInput("");
                setSelectedImage(null);
                setPreviewUrl(null);
                setFileName("");

                // ✅ Update chat list
                setProfessionalListChat((prevList) => {
                    const updatedList = prevList.map((item) =>
                        item.prof_clg_id === profClgId
                            ? {
                                ...item,
                                msg_count: item.msg_count || 0,
                                last_message: "📷 Image",
                                last_msg_time: new Date().toISOString(),
                            }
                            : item
                    );

                    const updatedItem = updatedList.find((item) => item.prof_clg_id === profClgId);
                    const others = updatedList.filter((item) => item.prof_clg_id !== profClgId);
                    return [updatedItem, ...others];
                });

            } catch (error) {
                console.error("Error sending image message:", error);
            }
        }

        // VIDEO MESSAGE (with or without text)
        else if (selectedVideo && selectedVideo.type.startsWith("video/")) {
            console.log("Selected video file:", selectedVideo);
            const formData = new FormData();
            formData.append("group", profClgId);
            formData.append("sender", clgId);
            formData.append("msg_type", 3);
            formData.append("message", input || "");
            formData.append("msg_file", selectedVideo);

            const previewMessage = {
                id: 0,
                msg_type: 3,
                msg_file: previewUrl,
                message: "",
                sending: true,
                time: formatTime(new Date())
            };
            setMessages((prev) => [...prev, previewMessage]);

            try {
                const response = await fetch(`${port}/web/chat/messages/send/`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: formData,
                });

                if (!response.ok) throw new Error("Failed to send video");

                const resData = await response.json();

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg === previewMessage
                            ? {
                                ...msg,
                                id: resData?.id || 0,
                                msg_file: resData?.msg_file || msg.msg_file,
                                sending: false,
                            }
                            : msg
                    )
                );

                setInput("");
                setSelectedVideo(null);
                setPreviewUrl(null);
                setFileName("");

                setProfessionalListChat((prevList) => {
                    const updatedList = prevList.map((item) =>
                        item.prof_clg_id === profClgId
                            ? {
                                ...item,
                                msg_count: item.msg_count || 0,
                                last_message: "🎥 Video",
                                last_msg_time: new Date().toISOString(),
                            }
                            : item
                    );

                    const updatedItem = updatedList.find((item) => item.prof_clg_id === profClgId);
                    const others = updatedList.filter((item) => item.prof_clg_id !== profClgId);
                    return [updatedItem, ...others];
                });

            } catch (error) {
                console.error("Error sending video message:", error);
            }
        }

        else if (selectedPDF) {
            const formData = new FormData();
            formData.append("group", profClgId);
            formData.append("sender", clgId);
            formData.append("msg_type", 5); // 5 for document
            formData.append("message", input || "");
            formData.append("msg_file", selectedPDF);

            const previewMessage = {
                id: 0,
                msg_type: 5,
                msg_file: "",
                message: input || "",
                pdfName: fileName,
                sending: true,
                time: formatTime(new Date())
            };
            setMessages((prev) => [...prev, previewMessage]);

            try {
                const response = await fetch(`${port}/web/chat/messages/send/`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: formData,
                });

                if (!response.ok) throw new Error("Failed to send document");

                const resData = await response.json();

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg === previewMessage
                            ? {
                                ...msg,
                                id: resData?.id || 0,
                                msg_file: resData?.msg_file || "",
                                sending: false,
                            }
                            : msg
                    )
                );

                setInput("");
                setSelectedPDF(null);
                setPDFPreviewName("");
                setFileName("");

                // Update chat list
                setProfessionalListChat((prevList) => {
                    const updatedList = prevList.map((item) =>
                        item.prof_clg_id === profClgId
                            ? {
                                ...item,
                                msg_count: item.msg_count || 0,
                                last_message: "📄 Document",
                                last_msg_time: new Date().toISOString(),
                            }
                            : item
                    );

                    const updatedItem = updatedList.find((item) => item.prof_clg_id === profClgId);
                    const others = updatedList.filter((item) => item.prof_clg_id !== profClgId);
                    return [updatedItem, ...others];
                });

            } catch (error) {
                console.error("Error sending document message:", error);
            }
        }

        // AUDIO MESSAGE
        else if (recordedBlob) {
            const formData = new FormData();
            formData.append("group", profClgId);
            formData.append("sender", clgId);
            formData.append("msg_type", 2);
            formData.append("message", input || "");
            formData.append("msg_file", recordedBlob, "audio_message.webm");

            try {
                const response = await fetch(`${port}/web/chat/messages/send/`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: formData,
                });

                if (!response.ok) throw new Error("Failed to send audio");

                const resData = await response.json();

                setMessages((prev) => [
                    ...prev,
                    {
                        id: resData?.id || 0,
                        msg_type: 2,
                        msg_file: resData?.msg_file || "",
                    },
                ]);

                setRecordedBlob(null);
                setRecording(false);

                // ✅ Update chat list
                setProfessionalListChat((prevList) => {
                    const updatedList = prevList.map((item) =>
                        item.prof_clg_id === profClgId
                            ? {
                                ...item,
                                msg_count: item.msg_count || 0,
                                last_message: "🎤 Audio message",
                                last_msg_time: new Date().toISOString(),
                            }
                            : item
                    );

                    const updatedItem = updatedList.find((item) => item.prof_clg_id === profClgId);
                    const others = updatedList.filter((item) => item.prof_clg_id !== profClgId);
                    return [updatedItem, ...others];
                });

            } catch (error) {
                console.error("Error sending audio message:", error);
            }
        }
    };

    const addEmoji = (emoji) => {
        setInput((prev) => prev + emoji.native);
    };

    useEffect(() => {
        const container = chatContainerRef.current;
        const handleScroll = () => {
            const isBottom =
                container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
            setIsAtBottom(isBottom);
            if (isBottom) setUnreadCount(0);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isAtBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isAtBottom]);

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
    @keyframes typingBounce 
    {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }
  `;
        document.head.appendChild(style);
    }, []);

    ///// Recording
    const [recording, setRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);

    const stopRecord = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
        setRecording(true);
    };
    const [stream, setStream] = useState(null);

    const startRecording = async () => {
        try {
            const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(userStream);
            setRecording(true);

            const recorder = new MediaRecorder(userStream);
            let chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" });

                const file = new File([blob], "audio_message.webm", { type: "audio/webm" });

                setRecordedBlob(file);
                setAudioChunks([]);

                console.log("Recorded audio file:", file);
            };

            recorder.start();
            setAudioChunks(chunks);
            setMediaRecorder(recorder);
        } catch (err) {
            alert("Microphone access denied");
        }
    };

    //// File Upload
    const [openModal, setOpenModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const iconRef = useRef(null);
    const pdfInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleOpen = () => {
        setOpenModal(prev => !prev);
    };

    const handlePDFClick = () => {
        pdfInputRef.current.click();
    };

    const handleImageClick = () => {
        imageInputRef.current.click();
    };

    const handleVideoClick = () => {
        videoInputRef.current.click();
    };

    const [selectedPDF, setSelectedPDF] = useState(null);
    const [pdfPreviewName, setPDFPreviewName] = useState("");

    const handlePDFFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setPDFPreviewName(file.name);
            setFileName(file.name);
            setSelectedPDF(file);
            setPreviewUrl(null);
            setOpenModal(false);
        }
    };
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    const handlePaste = (event) => {
        if (event.clipboardData && event.clipboardData.items) {
            for (let i = 0; i < event.clipboardData.items.length; i++) {
                const item = event.clipboardData.items[i];
                if (item.type.indexOf("image") !== -1) {
                    const file = item.getAsFile();
                    if (file) {
                        const url = URL.createObjectURL(file);
                        setFileName(file.name || "clipboard-image.png");
                        setPreviewUrl(url);
                        setSelectedImage(file);
                        setSelectedVideo(null);
                        setSelectedPDF(null);
                        setPDFPreviewName("");
                    }
                    event.preventDefault();
                    break;
                }
            }
        }
    };

    const handleImageFileChange = (event) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setFileName(file.name);
            setPreviewUrl(url);
            setSelectedImage(file);
        } else {
            setFileName("");
            setPreviewUrl(null);
            setSelectedImage(null);
        }

        setOpenModal(false);
    };

    const handleVideoFileChange = (event) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith("video/")) {
            const url = URL.createObjectURL(file);
            setFileName(file.name);
            setPreviewUrl(url);
            setSelectedVideo(file);
        } else {
            setFileName("");
            setPreviewUrl(null);
            setSelectedVideo(null);
        }

        setOpenModal(false);
    };

    /// Drag and Drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                setFileName(file.name);
                setPreviewUrl(url);
                setSelectedImage(file);
                setSelectedVideo(null);
                setSelectedPDF(null);
                setPDFPreviewName("");
            } else if (file.type.startsWith("video/")) {
                const url = URL.createObjectURL(file);
                setFileName(file.name);
                setPreviewUrl(url);
                setSelectedVideo(file);
                setSelectedImage(null);
                setSelectedPDF(null);
                setPDFPreviewName("");
            } else if (file.type === "application/pdf") {
                setFileName(file.name);
                setSelectedPDF(file);
                setPreviewUrl(null);
                setSelectedImage(null);
                setSelectedVideo(null);
                setPDFPreviewName(file.name);
            } else {
                setFileName("");
                setPreviewUrl(null);
                setSelectedImage(null);
                setSelectedVideo(null);
                setSelectedPDF(null);
                setPDFPreviewName("");
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    iconMapping={{
                        success: <span style={{ color: 'rgb(208 213 208)', fontSize: 20 }}>✔</span>,
                    }}
                    severity="success"
                    sx={{
                        backgroundColor: "rgb(44 123 48)",
                        color: "rgb(208 213 208)",
                        fontWeight: 500,
                        alignItems: "center",
                    }}
                >
                    You Entered In Chat Room
                </Alert>
            </Snackbar>

            {openModal && (
                <Box
                    ref={modalRef}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'absolute',
                        left: '74%',
                        transform: 'translateX(-50%)',
                        bottom: '100px',
                        backgroundColor: '#fff',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                        borderRadius: '12px',
                        padding: 1,
                        zIndex: 999,
                        width: '180px',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            transition: '0.3s',
                            '&:hover': {
                                backgroundColor: '#fffde7',
                            },
                        }}
                        onClick={handlePDFClick}
                    >
                        <InsertDriveFileIcon
                            sx={{
                                // backgroundColor: '#ffeb3b',
                                color: 'green',
                                padding: '6px',
                                borderRadius: '50%',
                                fontSize: '32px',
                                marginRight: '8px',
                            }}
                        />
                        <input
                            ref={pdfInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handlePDFFileChange}
                            style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '14px' }}>Document</span>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: '0.3s',
                            '&:hover': {
                                backgroundColor: '#f3e5f5',
                            },
                        }}
                        onClick={handleImageClick}
                    >
                        <ImageIcon
                            sx={{
                                color: '#e91e63',
                                padding: '6px',
                                borderRadius: '50%',
                                fontSize: '32px',
                                marginRight: '8px',
                            }}
                        />
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '14px' }}>Image</span>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: '0.3s',
                            '&:hover': {
                                backgroundColor: '#f3e5f5',
                            },
                        }}
                        onClick={handleVideoClick}
                    >
                        <VideocamIcon
                            sx={{
                                color: '#1976d2',
                                padding: '6px',
                                borderRadius: '50%',
                                fontSize: '32px',
                                marginRight: '8px',
                            }}
                        />
                        <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleVideoFileChange}
                            style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '14px' }}>Videos</span>
                    </Box>
                </Box>
            )}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: 410,
                    height: "72vh",
                    margin: "0px 0px 0px 10px",
                    borderRadius: 10,
                    overflow: "hidden",
                    fontFamily: "Roboto, sans-serif",
                    position: "relative",
                    border: "1px solid #ccc",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                }}
            >
                <div
                    style={{
                        background: "linear-gradient(90deg, rgb(0 151 225 / 35%) 0%, rgb(0 113 211 / 35%) 100%)",
                        color: "rgb(17 17 18)",
                        padding: '13px',
                        fontSize: 16,
                        display: "flex",
                        gap: "12px",
                        alignItems: 'left',
                        textAlign: 'left',
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: "#fff",
                            color: "rgb(17 17 18)",
                            fontWeight: "bold",
                            fontSize: "16px",
                            width: 25,
                            height: 25,
                        }}
                    >
                        {(selectedProfessionalName || "U").charAt(0)}
                    </Avatar>
                    <div
                        style={{
                            alignItems: 'left',
                            textAlign: 'left',
                            marginLeft: 0
                        }}
                    >
                        {(selectedProfessionalName ? selectedProfessionalName.charAt(0).toUpperCase() + selectedProfessionalName.slice(1).toLowerCase() : "Unknown")}
                    </div>
                </div>

                <div
                    ref={chatContainerRef}
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: 10,
                        background: "#f4f4f4",
                        position: "relative",
                        scrollBehavior: "smooth",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                >
                    {messages.length === 0 ? (
                        <div
                            style={{
                                padding: "16px",
                                textAlign: "center",
                                borderRadius: "10px",
                                color: "#555",
                            }}
                        >
                            No messages yet. Start the chat!
                        </div>
                    ) :
                        (
                            <div>
                                {fileName ?
                                    (
                                        <>
                                            {fileName && (previewUrl || selectedPDF) && (
                                                <>
                                                    {/* Image Preview */}
                                                    {previewUrl && !selectedPDF && (
                                                        <Box
                                                            sx={{
                                                                display: "inline-block",
                                                                padding: "8px",
                                                                borderRadius: "12px",
                                                                backgroundColor: "#f5f5f5",
                                                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                                                maxWidth: "300px",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <img
                                                                src={previewUrl}
                                                                alt="Preview"
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    borderRadius: "10px",
                                                                    display: "block",
                                                                    marginBottom: "4px",
                                                                }}
                                                            />
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ fontSize: "12px", color: "#444", mb: 1 }}
                                                            >
                                                                {fileName}
                                                            </Typography>
                                                            <Box
                                                                onClick={() => {
                                                                    setFileName("");
                                                                    setPreviewUrl(null);
                                                                    fetchProfessionalDetails();
                                                                }}
                                                                sx={{
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    backgroundColor: "#fff",
                                                                    borderRadius: "16px",
                                                                    padding: "4px 12px",
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold",
                                                                    cursor: "pointer",
                                                                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                                                    color: "#000",
                                                                    "&:hover": {
                                                                        backgroundColor: "#f0f0f0",
                                                                    },
                                                                }}
                                                            >
                                                                Close ×
                                                            </Box>
                                                        </Box>
                                                    )}

                                                    {selectedPDF && (
                                                        <Box
                                                            sx={{
                                                                display: "inline-block",
                                                                padding: "8px",
                                                                borderRadius: "12px",
                                                                backgroundColor: "#f5f5f5",
                                                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                                                maxWidth: "350px",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <InsertDriveFileIcon sx={{ color: "green", fontSize: 48, mb: 1 }} />
                                                            <Typography variant="body2" sx={{ fontSize: "12px", color: "#444", mb: 1 }}>
                                                                {fileName}
                                                            </Typography>
                                                            <Box
                                                                onClick={() => {
                                                                    setFileName("");
                                                                    setSelectedPDF(null);
                                                                    setPDFPreviewName("");
                                                                    fetchProfessionalDetails();
                                                                }}
                                                                sx={{
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    backgroundColor: "#fff",
                                                                    borderRadius: "16px",
                                                                    padding: "4px 12px",
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold",
                                                                    cursor: "pointer",
                                                                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                                                    color: "#000",
                                                                    "&:hover": {
                                                                        backgroundColor: "#f0f0f0",
                                                                    },
                                                                }}
                                                            >
                                                                Close ×
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <ChatFeed
                                                messages={messages.map((msg, index) => {
                                                    if (msg.type === "date-label") {
                                                        return new Message({
                                                            id: `date-${index}`,
                                                            message: (
                                                                <div
                                                                    style={{
                                                                        textAlign: "center",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        marginLeft: "12em",
                                                                        padding: "4px 7px",
                                                                        borderRadius: 5,
                                                                        fontSize: 12,
                                                                        fontWeight: "bold",
                                                                        color: "rgb(160 105 5)",
                                                                        backgroundColor: "rgb(244 220 117)",
                                                                    }}
                                                                >
                                                                    {msg.label}
                                                                </div>
                                                            ),
                                                        });
                                                    }

                                                    return new Message({
                                                        id: msg.id,
                                                        message: (
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    alignItems: "flex-end",
                                                                    justifyContent: msg.id === 0 ? "flex-end" : "flex-start",
                                                                    gap: "5px",
                                                                    marginBottom: 5,
                                                                }}
                                                            >
                                                                {msg.id !== 0 && (
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor: getColorForSender(msg.senderName),
                                                                            color: "white",
                                                                            fontSize: 14,
                                                                            width: 32,
                                                                            height: 32,
                                                                            border: "1px solid #ccc",
                                                                        }}
                                                                    >
                                                                        {(msg.senderName || "U").charAt(0).toUpperCase()}
                                                                    </Avatar>
                                                                )}

                                                                <div
                                                                    style={{
                                                                        position: "relative",
                                                                        padding: "6px 10px",
                                                                        borderRadius: 7,
                                                                        backgroundColor: msg.id === 0 ? "rgb(180 204 255)" : "#fff",
                                                                        border: "1px solid #ccc",
                                                                        maxWidth: 300,
                                                                        wordBreak: "break-word",
                                                                        color: msg.id === 0 ? "black" : "#000",
                                                                    }}
                                                                >
                                                                    <div style={{ paddingRight: 35 }}>
                                                                        {msg.id === 1 && msg.showSenderName && (
                                                                            <div
                                                                                style={{
                                                                                    marginBottom: 4,
                                                                                    fontSize: "11.5px",
                                                                                    fontWeight: "bold",
                                                                                    color: getColorForSender(msg.senderName),
                                                                                    textAlign: "left",
                                                                                }}
                                                                            >
                                                                                {msg.senderName}
                                                                            </div>
                                                                        )}
                                                                        <div
                                                                            style={{
                                                                                textAlign: "left",
                                                                                fontSize: "13px",
                                                                                marginRight: msg.id === 0 ? 8 : 5,
                                                                            }}
                                                                        >
                                                                            {
                                                                                msg.msg_type === 1 && msg.message ? (
                                                                                    <>{msg.message}</>
                                                                                )
                                                                                    :
                                                                                    msg.msg_type === 2 && msg.msg_file ? (
                                                                                        <audio
                                                                                            controls
                                                                                            controlsList="nodownload noplaybackrate nofullscreen"
                                                                                            style={{ maxWidth: "200px", height: "25px" }}
                                                                                            preload="none"
                                                                                            onContextMenu={(e) => e.preventDefault()}
                                                                                            onPlay={(e) => {
                                                                                                const audioUrl = `${port}${msg.msg_file}`;
                                                                                                if (e.target.src !== audioUrl) {
                                                                                                    e.target.src = audioUrl;
                                                                                                    e.target.play();
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <source src={`${port}${msg.msg_file}`} type="audio/webm" />
                                                                                            Your browser does not support the audio element.
                                                                                        </audio>
                                                                                    )
                                                                                        :
                                                                                        msg.msg_type === 4 && msg.msg_file ? (
                                                                                            <div>
                                                                                                <div style={{ borderRadius: "12px", maxWidth: "270px" }}>
                                                                                                    <img
                                                                                                        src={
                                                                                                            msg.msg_file.startsWith("blob:")
                                                                                                                ? msg.msg_file
                                                                                                                : `${port}${msg.msg_file}`
                                                                                                        }
                                                                                                        alt="Sent"
                                                                                                        onClick={() => {
                                                                                                            setSelectedVideo(
                                                                                                                msg.msg_file.startsWith("blob:")
                                                                                                                    ? msg.msg_file
                                                                                                                    : `${port}${msg.msg_file}`
                                                                                                            );
                                                                                                            setZoomLevel(1);
                                                                                                        }}
                                                                                                        style={{
                                                                                                            // maxWidth: "270px",
                                                                                                            width: msg.id !== 0 ? "120px" : "220px",
                                                                                                            height: "150px",
                                                                                                            borderRadius: "8px",
                                                                                                            marginRight: "-0px",
                                                                                                            cursor: "pointer",
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                                {msg.message && (
                                                                                                    <div style={{ marginTop: 4 }}>{msg.message}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        )
                                                                                            :
                                                                                            msg.msg_type === 3 && msg.msg_file ? (
                                                                                                <div>
                                                                                                    <video
                                                                                                        width={msg.id !== 0 ? "120" : "220"}
                                                                                                        height="150"
                                                                                                        controls
                                                                                                        style={{
                                                                                                            borderRadius: "8px",
                                                                                                            cursor: "pointer",
                                                                                                            backgroundColor: "#000",
                                                                                                        }}
                                                                                                        onContextMenu={(e) => e.preventDefault()}
                                                                                                    >
                                                                                                        <source
                                                                                                            src={
                                                                                                                msg.msg_file.startsWith("blob:")
                                                                                                                    ? msg.msg_file
                                                                                                                    : `${port}${msg.msg_file}`
                                                                                                            }
                                                                                                            type="video/mp4"
                                                                                                        />
                                                                                                        Your browser does not support the video tag.
                                                                                                    </video>
                                                                                                    {msg.message && (
                                                                                                        <div style={{ marginTop: 4 }}>{msg.message}</div>
                                                                                                    )}
                                                                                                </div>
                                                                                            )
                                                                                                :
                                                                                                msg.msg_type === 5 && msg.msg_file ? (
                                                                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                                                                        <InsertDriveFileIcon sx={{ color: "green", fontSize: 32 }} />
                                                                                                        <a
                                                                                                            href={msg.msg_file.startsWith("blob:") ? msg.msg_file : `${port}${msg.msg_file}`}
                                                                                                            target="_blank"
                                                                                                            rel="noopener noreferrer"
                                                                                                            style={{
                                                                                                                color: "#1976d2",
                                                                                                                fontWeight: "bold",
                                                                                                                textDecoration: "underline",
                                                                                                                fontSize: "13px",
                                                                                                                wordBreak: "break-all",
                                                                                                            }}
                                                                                                            download={msg.pdfName || (msg.msg_file ? msg.msg_file.split('/').pop() : "document.pdf")}
                                                                                                        >
                                                                                                            {msg.pdfName || (msg.msg_file ? msg.msg_file.split('/').pop() : "Document")}
                                                                                                        </a>
                                                                                                        {msg.message && (
                                                                                                            <div style={{ marginLeft: 8, fontSize: "12px" }}>{msg.message}</div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )
                                                                                                    :
                                                                                                    null
                                                                            }
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        style={{
                                                                            position: "absolute",
                                                                            bottom: 6,
                                                                            right: 4,
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            fontSize: "10px",
                                                                            color: msg.id === 0 ? "#e0e0e0" : "#888",
                                                                            // marginTop: msg.id === 0 ? "25px" : "30px",
                                                                            gap: 4,
                                                                        }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                color: "#464444",
                                                                                fontSize: "9.5px",
                                                                                marginBottom: "-5px",
                                                                            }}
                                                                        >
                                                                            {msg.time}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    });
                                                })}
                                                hasInputField={false}
                                                showSenderName={false}
                                                bubblesCentered={false}
                                                bubbleStyles={{
                                                    text: { fontSize: 13, color: "#000" },
                                                    chatbubble: {
                                                        backgroundColor: "transparent",
                                                        borderRadius: 5,
                                                        padding: 1,
                                                        color: "#000",
                                                    },
                                                    userBubble: {
                                                        backgroundColor: "transparent",
                                                        borderRadius: 5,
                                                        padding: 1,
                                                        color: "#000",
                                                    },
                                                }}
                                            />

                                            {selectedImage && (
                                                <div
                                                    style={{
                                                        position: "fixed",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100vw",
                                                        height: "100vh",
                                                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        zIndex: 9999,
                                                        padding: 20,
                                                        boxSizing: "border-box",
                                                    }}
                                                    onClick={() => setSelectedImage(null)}
                                                >
                                                    <div
                                                        style={{
                                                            maxWidth: "80vw",
                                                            maxHeight: "90vh",
                                                            overflow: "auto",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <img
                                                            src={selectedImage}
                                                            alt="Preview"
                                                            style={{
                                                                transform: `scale(${zoomLevel})`,
                                                                transition: "transform 0.3s ease",
                                                                maxWidth: "100%",
                                                                maxHeight: "100%",
                                                                borderRadius: "8px",
                                                                objectFit: "contain",
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Button Column */}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            marginLeft: 20,
                                                            gap: 10,
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.1))}
                                                            style={{
                                                                padding: "6px 12px",
                                                                fontSize: 14,
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            ➖ Zoom Out
                                                        </button>
                                                        <button
                                                            onClick={() => setZoomLevel((prev) => Math.min(3, prev + 0.1))}
                                                            style={{
                                                                padding: "6px 12px",
                                                                fontSize: 14,
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            ➕ Zoom In
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedImage(null)}
                                                            style={{
                                                                padding: "6px 12px",
                                                                fontSize: 14,
                                                                cursor: "pointer",
                                                                backgroundColor: "red",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: 4,
                                                            }}
                                                        >
                                                            ✖ Close
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedVideo && (
                                                <div
                                                    style={{
                                                        position: "fixed",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100vw",
                                                        height: "100vh",
                                                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        zIndex: 9999,
                                                        padding: 20,
                                                        boxSizing: "border-box",
                                                    }}
                                                    onClick={() => setSelectedVideo(null)}
                                                >
                                                    <div
                                                        style={{
                                                            maxWidth: "80vw",
                                                            maxHeight: "90vh",
                                                            overflow: "auto",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <video
                                                            src={previewUrl}
                                                            controls
                                                            style={{
                                                                transform: `scale(${zoomLevel})`,
                                                                transition: "transform 0.3s ease",
                                                                maxWidth: "100%",
                                                                maxHeight: "100%",
                                                                borderRadius: "8px",
                                                                objectFit: "contain",
                                                                background: "#000",
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            marginLeft: 20,
                                                            gap: 10,
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.1))}
                                                            style={{
                                                                padding: "6px 12px",
                                                                fontSize: 14,
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            ➖ Zoom Out
                                                        </button>
                                                        <button
                                                            onClick={() => setZoomLevel((prev) => Math.min(3, prev + 0.1))}
                                                            style={{
                                                                padding: "6px 12px",
                                                                fontSize: 14,
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            ➕ Zoom In
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedVideo(null)}
                                                            style={{
                                                                padding: "6px 12px",
                                                                fontSize: 14,
                                                                cursor: "pointer",
                                                                backgroundColor: "red",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: 4,
                                                            }}
                                                        >
                                                            ✖ Close
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {fileName && selectedPDF ? (
                                                <Box
                                                    sx={{
                                                        display: "inline-block",
                                                        padding: "8px",
                                                        borderRadius: "12px",
                                                        backgroundColor: "#f5f5f5",
                                                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                                        maxWidth: "350px",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <InsertDriveFileIcon sx={{ color: "green", fontSize: 48, mb: 1 }} />
                                                    <Typography variant="body2" sx={{ fontSize: "12px", color: "#444", mb: 1 }}>
                                                        {fileName}
                                                    </Typography>
                                                    <Box
                                                        onClick={() => {
                                                            setFileName("");
                                                            setSelectedPDF(null);
                                                            setPDFPreviewName("");
                                                            fetchProfessionalDetails();
                                                        }}
                                                        sx={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundColor: "#fff",
                                                            borderRadius: "16px",
                                                            padding: "4px 12px",
                                                            fontSize: "14px",
                                                            fontWeight: "bold",
                                                            cursor: "pointer",
                                                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                                            color: "#000",
                                                            "&:hover": {
                                                                backgroundColor: "#f0f0f0",
                                                            },
                                                        }}
                                                    >
                                                        Close ×
                                                    </Box>
                                                </Box>
                                            ) : null}

                                            {seenUserIds.length > 0 && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                        marginRight: 5,
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={handleClick}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 8,
                                                            fontSize: 10,
                                                            color: "#666",
                                                            fontStyle: "italic",
                                                        }}
                                                    >
                                                        {/* <span>Seen by</span> */}
                                                        {seenUserIds.map((user) => (
                                                            <div
                                                                key={user.id}
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: "right",
                                                                    textAlign: "right",
                                                                    marginLeft: 'auto'
                                                                }}
                                                            >
                                                                <Avatar
                                                                    sx={{
                                                                        width: 20,
                                                                        height: 20,
                                                                        fontSize: 10,
                                                                        backgroundColor: getColorForSender(user.name || String(user.id)),
                                                                        color: "white",
                                                                        alignItems: "right",
                                                                        textAlign: "right",
                                                                    }}
                                                                >
                                                                    {user.name?.charAt(0).toUpperCase()}
                                                                </Avatar>
                                                                {showNames && (
                                                                    <span
                                                                        style={{
                                                                            marginTop: 2,
                                                                            marginRight: 1,
                                                                            fontSize: 9,
                                                                            color: "#444",
                                                                        }}
                                                                    >
                                                                        {user.name}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )
                                }

                            </div>
                        )
                    }
                    <div ref={messagesEndRef} />

                    {unreadCount > 0 && !isAtBottom && (
                        <div
                            onClick={() => {
                                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                                setUnreadCount(0);
                            }}
                            style={{
                                position: "absolute",
                                bottom: 10,
                                right: 20,
                                backgroundColor: "#7bd015",
                                color: "#0b0303",
                                padding: "6px 12px",
                                borderRadius: 20,
                                fontSize: 12,
                                cursor: "pointer",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            {unreadCount}
                            <MdArrowDownward size={16} />
                        </div>
                    )}
                </div>

                {showEmojiPicker && (
                    <div style={{ position: "absolute", bottom: 70, left: 10, zIndex: 10 }}>
                        <Picker data={data} onEmojiSelect={addEmoji} />
                    </div>
                )}

                <div
                    style={{
                        display: "flex",
                        background: "#eee",
                        borderTop: "1px solid #ccc",
                        flexDirection: "column"
                    }}
                >
                    <div style={{ display: "flex" }}>
                        {!recording ?
                            (
                                <div style={{ display: 'flex' }}>
                                    <button
                                        ref={iconRef}
                                        onClick={handleOpen}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            height: "30px",
                                            width: "30px",
                                            marginTop: "7px",
                                            color: 'black'
                                        }}
                                    >
                                        <AddIcon />
                                    </button>

                                    <button
                                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            height: "40px",
                                            width: "40px",
                                            marginTop: "7px",
                                        }}
                                    >
                                        😊
                                    </button>

                                    <input
                                        style={{
                                            flex: 1,
                                            width: "260px",
                                            padding: 8,
                                            borderRadius: 20,
                                            border: "1px solid #ccc",
                                            outline: "none",
                                            margin: "10px 5px 10px 8px",
                                        }}
                                        placeholder="Type a message"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        onPaste={handlePaste}
                                    />
                                </div>
                            )
                            :
                            (
                                <div>
                                    {recording && stream && (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                background: "#e3f2fd",
                                                borderRadius: 10,
                                                padding: 10,
                                                marginTop: 10,
                                            }}
                                        >
                                            {[...Array(20)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        width: 13,
                                                        height: recording ? `${Math.random() * 30 + 10}px` : `10px`,
                                                        backgroundColor: "#1976d2",
                                                        animation: "waveAnim 3s infinite ease-in-out",
                                                        animationDelay: `${i * 0.10}s`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        {recording ? (
                            <div style={{ display: "flex", alignItems: "center" }}>

                                <button
                                    onClick={stopRecord}
                                    style={{
                                        borderRadius: "60%",
                                        backgroundColor: "#ff3b30",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "8px",
                                        paddingLeft: "10px",
                                        height: "35px",
                                        width: "35px",
                                        margin: "10px 10px 10px 0px",
                                    }}
                                >
                                    <MdStop size={28} color="white" />
                                </button>

                                <button
                                    onClick={handleSend}
                                    style={{
                                        borderRadius: "60%",
                                        backgroundColor: "#2261be",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "8px",
                                        paddingLeft: "10px",
                                        height: "35px",
                                        width: "35px",
                                        margin: "10px 10px 10px 0px",
                                    }}
                                >
                                    <IoSend size={27} />
                                </button>

                                <button
                                    onClick={() => {
                                        setRecording(false);
                                        setRecordedBlob(null);
                                    }}
                                    style={{
                                        borderRadius: "60%",
                                        backgroundColor: "#e74c3c",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "35px",
                                        width: "35px",
                                        margin: "10px 10px 10px 0px",
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        ) : input.trim().length === 0 && !selectedImage && !selectedVideo && !fileName ? (
                            <button
                                onClick={startRecording}
                                style={{
                                    borderRadius: "60%",
                                    backgroundColor: "#2261be",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "35px",
                                    width: "35px",
                                    margin: "10px 20px 10px 0px",
                                }}
                            >
                                <MicIcon />
                            </button>
                        ) : (
                            <button
                                onClick={handleSend}
                                style={{
                                    borderRadius: "60%",
                                    backgroundColor: "#2261be",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "8px",
                                    paddingLeft: "10px",
                                    height: "35px",
                                    width: "35px",
                                    margin: "10px 10px 10px 0px",
                                }}
                            >
                                <IoSend size={27} />
                            </button>
                        )}
                    </div>

                    {/* Audio Recorder */}
                    {/* <div>
                        <ReactMic
                            record={recording}
                            onStop={onStop}
                            strokeColor="#2261be"
                            backgroundColor="#f3f3f3"
                            mimeType="audio/webm"
                            className="sound-wave"
                        />
                        {recordedBlob && (
                            <audio
                                controls
                                src={recordedBlob.blobURL}
                                style={{ marginTop: "10px", width: "100%" }}
                            />
                        )}
                    </div> */}
                </div>
            </div>
        </>
    );
}


export default HDChat;