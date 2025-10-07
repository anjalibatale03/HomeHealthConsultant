import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
} from "@mui/material";
import ProfessionalDetails from "../ADMIN/HCM/ProfessionalDetails";
import { CircularProgress, Backdrop } from "@mui/material";
import HRNavbar from "../HR/HRNavbar";

const MM2Dashboard = () => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const [todayData, setTodayData] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [professionalDetails, setProfessionalDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const EnquriyDataTable = async () => {
      try {
        const response = await fetch(`${port}/web/enquiry-statistics/`, {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        const formattedData = [
          {
            type: "Total Enquiries",
            today: data.total_enquiry_today,
            mtd: data.total_enquiry_month,
            ytd: data.total_enquiry_current_financial_year,
          },
          {
            type: "Converted",
            today: data.total_converted_today,
            mtd: data.total_converted_month,
            ytd: data.total_converted_current_financial_year,
          },
          {
            type: "In Follow-ups",
            today: data.total_follow_today,
            mtd: data.total_follow_month,
            ytd: data.total_follow_current_financial_year,
          },
          {
            type: "Cancelled",
            today: data.total_cancelled_today,
            mtd: data.total_cancelled_month,
            ytd: data.total_cancelled_current_financial_year,
          },
          {
            type: "Pending Enquiries",
            today: data.Pen_enq_today,
            mtd: data.Pen_enq_month,
            ytd: data.Pen_enq_current_financial_year,
          },
        ];

        setTodayData(formattedData);
        console.log("Formatted Data:", formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    EnquriyDataTable();
  }, []);

  useEffect(() => {
    const PaymentStatus = async () => {
      try {
        const response = await fetch(`${port}/web/Payment-statistics/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        const PaymentStatusFormatData = [
          {
            status: "Received Amount",
            today: data.received_amount.today,
            mtd: data.received_amount.current_month,
            ytd: data.received_amount.current_financial_year,
            financialPending: data.received_amount.last_financial_year,
          },
          {
            status: "In Process Amount",
            today: data.inprocess_amount.today,
            mtd: data.inprocess_amount.current_month,
            ytd: data.inprocess_amount.current_financial_year,
            financialPending: data.inprocess_amount.last_financial_year,
          },
          {
            status: "Pending Amount",
            today: data.pending_amount.today,
            mtd: data.pending_amount.current_month,
            ytd: data.pending_amount.current_financial_year,
            financialPending: data.pending_amount.last_financial_year,
          },
          {
            status: "Total Amount",
            today: data.total_amount.today,
            mtd: data.total_amount.current_month,
            ytd: data.total_amount.current_financial_year,
            financialPending: data.total_amount.last_financial_year,
          },
        ];

        setPaymentStatus(PaymentStatusFormatData);
      } catch (error) {
        console.error("Error fetching payment statistics:", error);
      }
    };

    PaymentStatus();
  }, []);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`${port}/web/service-statistics/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const responseData = await response.json();

        // Transform API response to match table structure
        const formattedData = responseData.map((service) => ({
          name: service.srv_name,
          completed: {
            today: service.data.total_completed_today,
            mtd: service.data.total_completed_this_month,
            ytd: service.data.total_completed_current_fy,
          },
          ongoing: {
            today: service.data.total_ongoing_today,
            mtd: service.data.total_ongoing_this_month,
            ytd: service.data.total_ongoing_current_fy,
          },
          pending: {
            today: service.data.total_pending_today,
            mtd: service.data.total_pending_this_month,
            ytd: service.data.total_pending_current_fy,
          },
        }));

        setServiceDetails(formattedData);
      } catch (error) {
        console.error("Error fetching service statistics:", error);
      }
    };

    fetchServiceDetails();
  }, []);

  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Change this to match your API call duration
  }, []);

  useEffect(() => {
    const fetchProfessionalDetails = async () => {
      try {
        const response = await fetch(`${port}/web/professional-statistics/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const responseData = await response.json();

        // Extract overall professional data
        const totalProfessionals = responseData.total_professionals;

        // Transform API response into table structure
        const formattedData = responseData.service_wise_breakdown.map(
          (service) => ({
            service_name: service.service_name,
            total_professionals: service.total_professionals,
            assigned: {
              today: service.today.assigned_professionals,
              mtd: service.this_month.assigned_professionals,
              ytd: service.current_financial_year.assigned_professionals,
            },
            unassigned: {
              today: service.today.unassigned_professionals,
              mtd: service.this_month.unassigned_professionals,
              ytd: service.current_financial_year.unassigned_professionals,
            },
          })
        );

        // Update state
        setProfessionalDetails(formattedData);
      } catch (error) {
        console.error("Error fetching professional statistics:", error);
      }
    };

    fetchProfessionalDetails();
  }, []);

  const headerCellStyles = {
    color: "black",
    px: 1,
    py: 0.5,
    fontFamily: "Roboto",
    fontSize: "14px",
    fontWeight: "600",
  };

  const subHeaderCellStyles = {
    color: "black",
    px: 1,
    py: 0.5,
    fontFamily: "Roboto",
    fontSize: "13px",
    fontWeight: "600",
  };

  const bodyCellStyles = {
    px: 1,
    py: 0.5,
    fontFamily: "Roboto",
    fontSize: "13px",
    fontWeight: "700",
  };

  return (
    <>
      <HRNavbar />
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ p: 3, mt: 6 }}>
        <Grid
          container
          spacing={2}
          sx={{ minHeight: "100%", alignItems: "stretch", mb: 3 }}
        >
          <Grid container spacing={2} sx={{ minHeight: "100%" }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "10px",
                }}
              >
                {/* <Typography
                variant="h6"
                sx={{
                  p: 1,
                  textAlign: "center",
                  bgcolor: "rgb(105, 165, 235)",
                  color: "white",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Today's Data
              </Typography> */}
                <Table sx={{ flex: 1 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "rgb(105, 165, 235)" }}>
                      <TableCell sx={{ color: "white", py: 0.5 }}>
                        Type
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          py: 0.5,
                          fontFamily: "Roboto",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Today
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          py: 0.5,
                          fontFamily: "Roboto",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Month Till Date
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          py: 0.5,
                          fontFamily: "Roboto",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Year Till Date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todayData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            py: 0.5,
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {row.type}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            py: 0.5,
                            fontSize: "12px",
                            fontFamily: "Roboto",
                            fontWeight: "500",
                          }}
                        >
                          {row.today}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            py: 0.5,
                            fontSize: "12px",
                            fontFamily: "Roboto",
                            fontWeight: "500",
                          }}
                        >
                          {row.mtd}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            py: 0.5,
                            fontSize: "12px",
                            fontFamily: "Roboto",
                            fontWeight: "500",
                          }}
                        >
                          {row.ytd}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Payment Status Table */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "10px",
                  overflow: "hidden",
                  width: "100%",
                  minWidth: "300px",
                }}
              >
                <Typography
                  sx={{
                    p: 1,
                    textAlign: "center",
                    bgcolor: "rgb(105, 165, 235)",
                    color: "white",
                    fontSize: { xs: "14px", sm: "16px" }, // Adjust font size based on screen
                    fontFamily: "Roboto",
                    fontWeight: "600",
                    height: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Payment Status
                </Typography>

                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <Table sx={{ flex: 1, minWidth: "600px" }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "rgb(219, 225, 233)" }}>
                        {[
                          "Status",
                          "Today",
                          "Month Till Date",
                          "Year Till Date",
                          "Financial Pending",
                        ].map((header, idx) => (
                          <TableCell
                            key={idx}
                            align={idx === 0 ? "left" : "center"}
                            sx={{
                              color: "black",
                              py: 0.5,
                              fontFamily: "Roboto",
                              fontWeight: "600",
                              fontSize: { xs: "12px", sm: "14px" }, // Responsive font size
                              whiteSpace: "nowrap",
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {paymentStatus?.length > 0 ? (
                        paymentStatus.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell
                              sx={{
                                py: 0.5,
                                fontFamily: "Roboto",
                                fontSize: { xs: "12px", sm: "13px" }, // Responsive font
                                fontWeight: "600",
                              }}
                            >
                              {row?.status || "N/A"}
                            </TableCell>
                            {[
                              row?.today,
                              row?.mtd,
                              row?.ytd,
                              row?.financialPending,
                            ].map((value, idx) => (
                              <TableCell
                                key={idx}
                                align="center"
                                sx={{
                                  py: 0.5,
                                  fontSize: { xs: "12px", sm: "13px" }, // Responsive text
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                }}
                              >
                                {value ?? "N/A"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="center"
                            sx={{ py: 2, fontSize: "14px", fontWeight: "500" }}
                          >
                            No payment data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </TableContainer>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ minHeight: "100%" }}>
            <Grid item xs={12}>
              <TableContainer
                component={Paper}
                sx={{
                  height: "100%",
                  mt: 3,
                  borderRadius: "10px",
                  overflowX: "auto",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "#69A5EB",
                    position: "sticky",
                    overflowX: "hidden",
                  }}
                >
                  <Typography
                    sx={{
                      p: 1,
                      textAlign: "center",
                      color: "white",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontFamily: "Roboto",
                      fontWeight: "700",
                    }}
                  >
                    Service Details
                  </Typography>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "rgb(225, 229, 234)" }}>
                      <TableCell sx={headerCellStyles}>Service Name</TableCell>
                      <TableCell
                        colSpan={2}
                        align="center"
                        sx={headerCellStyles}
                      >
                        Completed
                      </TableCell>
                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{ borderRight: "1px solid #000" }}
                      ></TableCell>
                      <TableCell
                        colSpan={2}
                        align="center"
                        sx={headerCellStyles}
                      >
                        Ongoing
                      </TableCell>
                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{ borderRight: "1px solid #000" }}
                      ></TableCell>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={headerCellStyles}
                      >
                        Pending
                      </TableCell>
                    </TableRow>

                    <TableRow sx={{ bgcolor: "#fff" }}>
                      <TableCell sx={subHeaderCellStyles}></TableCell>
                      {[...Array(3)].map((_, idx) => (
                        <React.Fragment key={idx}>
                          <TableCell align="center" sx={subHeaderCellStyles}>
                            Today
                          </TableCell>
                          <TableCell align="center" sx={subHeaderCellStyles}>
                            Month Till Date
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              ...subHeaderCellStyles,
                              borderRight: "1px solid #000", // Add vertical line after "Year Till Date"
                            }}
                          >
                            Year Till Date
                          </TableCell>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {serviceDetails?.length > 0 ? (
                      serviceDetails.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell sx={bodyCellStyles}>
                            {row?.name ?? "N/A"}
                          </TableCell>
                          {[row?.completed, row?.ongoing, row?.pending].map(
                            (data, idx) => (
                              <React.Fragment key={idx}>
                                <TableCell align="center" sx={bodyCellStyles}>
                                  {data?.today ?? "N/A"}
                                </TableCell>
                                <TableCell align="center" sx={bodyCellStyles}>
                                  {data?.mtd ?? "N/A"}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    ...bodyCellStyles,
                                    borderRight: "1px solid #000", // Add vertical line after "Year Till Date"
                                  }}
                                >
                                  {data?.ytd ?? "N/A"}
                                </TableCell>
                              </React.Fragment>
                            )
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          align="center"
                          sx={{ py: 2, fontSize: "14px", fontWeight: "500" }}
                        >
                          No service details available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <TableContainer
                component={Paper}
                sx={{
                  height: "100%",
                  mt: 3,
                  borderRadius: "10px",
                  overflowX: "auto",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "#69A5EB",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    sx={{
                      p: { xs: 1, md: 1.5 },
                      textAlign: "center",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: { xs: "14px", sm: "16px" },
                      fontWeight: "700",
                      fontFamily: "Roboto",
                    }}
                  >
                    Professional Availability
                  </Typography>
                </Box>

                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <Table sx={{ tableLayout: "auto", width: "100%" }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "rgb(219, 225, 233)" }}>
                        <TableCell
                          sx={headerCellStyles}
                          style={{
                            minWidth: "150px",
                            // borderRight: "3px solid #000",
                          }} // Vertical line after "Service Name"
                        >
                          Service Name
                        </TableCell>
                        <TableCell
                          sx={headerCellStyles}
                          align="center"
                          style={{
                            minWidth: "120px",
                            borderRight: "1px solid #000",
                          }} // Vertical line after "Total Professionals"
                        >
                          Total Professionals
                        </TableCell>
                        <TableCell
                          colSpan={3}
                          sx={{
                            ...headerCellStyles,
                            borderRight: "1px solid #000",
                          }} // Vertical line after "Busy"
                          align="center"
                        >
                          Busy
                        </TableCell>
                        <TableCell
                          colSpan={3}
                          sx={headerCellStyles}
                          align="center"
                        >
                          Available
                        </TableCell>
                      </TableRow>

                      {/* Sub-Headers */}
                      <TableRow sx={{ bgcolor: "#fff" }}>
                        <TableCell sx={{ px: 1, py: 0.5 }}></TableCell>
                        <TableCell
                          sx={{ px: 1, py: 0.5, borderRight: "1px solid #000" }}
                        ></TableCell>
                        {[...Array(2)].map((_, idx) => (
                          <React.Fragment key={idx}>
                            <TableCell align="center" sx={subHeaderCellStyles}>
                              Today
                            </TableCell>
                            <TableCell align="center" sx={subHeaderCellStyles}>
                              Month Till Date
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                ...subHeaderCellStyles,
                                borderRight:
                                  idx === 0 ? "1px solid #000" : "none", // Vertical line after "Year Till Date" in "Busy"
                              }}
                            >
                              Year Till Date
                            </TableCell>
                          </React.Fragment>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {professionalDetails?.length > 0 ? (
                        professionalDetails.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell
                              sx={{
                                ...bodyCellStyles,
                                // borderRight: "3px solid #000",
                              }}
                            >
                              {row?.service_name ?? "N/A"}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                ...bodyCellStyles,
                                borderRight: "1px solid #000",
                              }}
                            >
                              {row?.total_professionals ?? "N/A"}
                            </TableCell>

                            {[
                              row?.assigned?.today,
                              row?.assigned?.mtd,
                              row?.assigned?.ytd,
                            ].map((data, idx) => (
                              <TableCell
                                key={idx}
                                align="center"
                                sx={{
                                  ...bodyCellStyles,
                                  borderRight:
                                    idx === 2 ? "1px solid #000" : "none", // Add vertical line after "Year Till Date" in "Busy"
                                }}
                              >
                                {data ?? "N/A"}
                              </TableCell>
                            ))}

                            {[
                              row?.unassigned?.today,
                              row?.unassigned?.mtd,
                              row?.unassigned?.ytd,
                            ].map((data, idx) => (
                              <TableCell
                                key={idx}
                                align="center"
                                sx={bodyCellStyles}
                              >
                                {data ?? "N/A"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={10}
                            align="center"
                            sx={{ py: 2, fontSize: "14px", fontWeight: "500" }}
                          >
                            No professional availability data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MM2Dashboard;
