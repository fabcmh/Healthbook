import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Appointment() {
    const [appointments, setAppointments] = useState([]);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const fetchData = async () => {
        try {
            const email = sessionStorage.getItem("email");
            const response = await fetch(`http://localhost:5000/appointment/email=${email}`);
            const appointmentData = await response.json();

            if (response.status === 404) {
                console.log("No entry found");
            } else {
                console.log("Entry found");
                setAppointments(appointmentData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleDelete = (id) => {
        setSelectedAppointmentId(id);
        setDeleteConfirmationOpen(true);
    }

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/appointment/delete/${selectedAppointmentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Appointment deleted successfully');
                setDeleteConfirmationOpen(false);
                fetchData(); // Refresh data after deletion
            } else {
                console.log('Deletion failed');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    }

    const cancelDelete = () => {
        setDeleteConfirmationOpen(false);
        setSelectedAppointmentId(null);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container>
            {appointments.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                    <AlertTitle>No appointments</AlertTitle>
                    <strong>You currently have no upcoming appointments</strong>
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Clinic Name</TableCell>
                                    <TableCell>Datetime</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.map((appointment, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{appointment.clinicGP}</TableCell>
                                        <TableCell>{appointment.timeslot}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="delete"
                                                color="secondary"
                                                onClick={() => handleDelete(appointment._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </TableContainer>
            )}

            <Dialog open={deleteConfirmationOpen} onClose={cancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this appointment?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
