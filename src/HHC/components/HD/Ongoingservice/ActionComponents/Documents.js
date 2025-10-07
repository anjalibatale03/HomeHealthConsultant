import { useState, useEffect, useRef } from "react";
import {
    Grid,
    Button,
    TextField,
    Snackbar,
    Alert,
    Typography,
    IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

const Documents = ({ eventID, callerId, patientID }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem("token");
    const fileInputRefs = useRef({});

    const [lab, setLab] = useState([]);
    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // GET API
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`${port}/web/get_document_list/`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setLab(data);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        fetchDocuments();
    }, []);


    const fetchUploadedDocs = async () => {
        try {
            const response = await fetch(
                `${port}/web/post_documents/${eventID}/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const result = await response.json();
            if (response.ok) {
                setUploadedDocs(result);
            }
        } catch (error) {
            console.error("Error fetching uploaded documents:", error);
        }
    };

    useEffect(() => {
        fetchUploadedDocs();
    }, [eventID, port, accessToken]);

    const handleFileChange = (e, ds_doc_id) => {
        const files = Array.from(e.target.files);
        setLab((prevLab) =>
            prevLab.map((doc) =>
                doc.ds_doc_id === ds_doc_id
                    ? { ...doc, selectedFiles: files }
                    : doc
            )
        );
    };

    const handleSubmit = async () => {
        const filesByDocId = {};
        lab.forEach((doc) => {
            if (doc.selectedFiles && doc.selectedFiles.length) {
                filesByDocId[doc.ds_doc_id] = doc.selectedFiles;
            }
        });

        console.log("filesByDocId", filesByDocId);

        if (Object.keys(filesByDocId).length === 0) {
            setSnackbar({
                open: true,
                message: "Please select at least one file to upload!",
                severity: "error",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("agg_sp_pt_id", patientID);
            formData.append("eve_id", eventID);
            formData.append("verification_status", "1");

            for (const [docId, files] of Object.entries(filesByDocId)) {
                files.forEach((file) => {
                    formData.append(`ds_doc_id*${docId}`, file);
                    console.log(`Uploading file for ds_doc_id*${docId}:`, file.name);

                });
            }

            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            const response = await fetch(`${port}/web/post_documents/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                setSnackbar({
                    open: true,
                    message: result.message || "Upload failed!",
                    severity: "error",
                });
                return;
            }

            setLab((prevLab) =>
                prevLab.map((doc) => ({
                    ...doc,
                    selectedFiles: [],
                }))
            );

            Object.values(fileInputRefs.current).forEach((input) => {
                if (input) input.value = "";
            });

            setSnackbar({
                open: true,
                message: "Document uploaded successfully!",
                severity: "success",
            });

            await fetchUploadedDocs();

        } catch (error) {
            setSnackbar({
                open: true,
                message: `Error: ${error.message}`,
                severity: "error",
            });
        }
    };

    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDelete = async (pd_doc_id, fileUrl) => {
        setDeleteTarget({ pd_doc_id, fileUrl });

        const payload = {
            eve_id: eventID,
            agg_sp_pt_id: patientID,
            docs: [pd_doc_id],
        };

        try {
            const response = await fetch(`${port}/web/delete_document/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) {
                setSnackbar({
                    open: true,
                    message: result.message || "Delete failed!",
                    severity: "error",
                });
                return;
            }

            setSnackbar({
                open: true,
                message: "Document deleted successfully!",
                severity: "success",
            });
            await fetchUploadedDocs();
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Error: ${error.message}`,
                severity: "error",
            });
        } finally {
            setDeleteTarget(null);
        }
    };

    const getGroupedUploadedDocs = () => {
        const docIdToName = {};
        lab.forEach(doc => {
            docIdToName[doc.ds_doc_id] = doc.doc_name;
        });

        const grouped = {};
        if (Array.isArray(uploadedDocs)) {
            uploadedDocs.forEach(doc => {
                if (!grouped[doc.ds_doc_id]) {
                    grouped[doc.ds_doc_id] = [];
                }
                grouped[doc.ds_doc_id].push({
                    file: doc.file,
                    pd_doc_id: doc.pd_doc_id,
                });
            });
        }
        return Object.entries(grouped).map(([ds_doc_id, files]) => ({
            ds_doc_id,
            doc_name: docIdToName[ds_doc_id] || `Document ${ds_doc_id}`,
            files,
        }));
    };

    const getFileName = (url) => url.split('/media/Patient_documents/')[1] || url;

    return (
        <Grid>
            <Grid container spacing={2} padding={2} sx={{ marginTop: "0.5em" }}>
                {lab.map((doc) => (
                    <Grid item lg={4} sm={4} xs={12} key={doc.ds_doc_id}>
                        <TextField
                            label={doc.doc_name}
                            name={doc.doc_name}
                            type="file"
                            fullWidth
                            size="small"
                            onChange={(e) => handleFileChange(e, doc.ds_doc_id)}
                            inputRef={(el) => (fileInputRefs.current[doc.ds_doc_id] = el)}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ multiple: true }}
                            sx={{ "& input": { fontSize: "14px" } }}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container justifyContent="center" padding={2}>
                <Button
                    variant="contained"
                    size="medium"
                    onClick={handleSubmit}
                    sx={{ fontSize: "1rem" }}
                >
                    Submit
                </Button>
            </Grid>

            <hr />

            <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                Uploaded Documents
            </Typography>

            <Grid container spacing={2} padding={2}>
                {getGroupedUploadedDocs().map((group) => (
                    <Grid item xs={12} key={group.ds_doc_id}>
                        <Typography variant="h6" sx={{ mt: 2 }}>{group.doc_name}</Typography>
                        {group.files.map((fileObj, idx) => (
                            <Grid container key={idx} alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                <Grid item xs={1}>
                                    <Typography>{idx + 1}.</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        title={getFileName(fileObj.file)}
                                    >
                                        {getFileName(fileObj.file)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(fileObj.pd_doc_id, fileObj.file)}
                                        sx={{ mr: 1 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        component="a"
                                        href={`${port}${fileObj.file}`}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default Documents;
