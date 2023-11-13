import React, { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { Container, Button, Alert, AlertTitle, Grid, Box } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function BookAppointment() {
    const [selectedClinic, setSelectedClinic] = useState('');
    const [selectedGP, setSelectedGP] = useState('');
    const [showSelectedClinic, setShowSelectedClinic] = useState(true);
    const [clinicDateTimePickerValue, setClinicDateTimePickerValue] = useState(dayjs().startOf('day'));
    const [GPDateTimePickerValue, setGPDateTimePickerValue] = useState(dayjs().startOf('day'));
    const [showAlert, setShowAlert] = useState(false);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [showGPDateTimePicker, setShowGPDateTimePicker] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [showSelectGP, setShowSelectGP] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [open, setOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [clinicList, setClinicList] = useState([]);
    const [GPList, setGPList] = useState([]);
    const minDate = dayjs().startOf('day');


    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/gp`);
            const GPData = await response.json();

            if (response.status === 404) {
                console.log("No entry found");
            } else {
                console.log("Entry found");
                setGPList(GPData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        try {
            const response = await fetch(`http://localhost:5000/polyclinic`);
            const clinicData = await response.json();

            if (response.status === 404) {
                console.log("No entry found");
            } else {
                console.log("Entry found");
                setClinicList(clinicData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleClinicChange = (event) => {
        setSelectedClinic(event.target.value);
    };

    const handleGPChange = (event) => {
        setSelectedGP(event.target.value);
    };

    const handleYes = () => {
        setOpen(false);
        setShowSelectGP(true);
        setSelectedClinic('');
        setShowGPDateTimePicker(true);
        setShowButton(true);
        setClinicDateTimePickerValue('');
        setShowSelectedClinic(false);
    };

    const handleNo = () => {
        setOpen(false);
        setShowButton(true);
        setIsButtonDisabled(true);
    };

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            var clinicGP = '';

            if (data.get('selectedClinic') !== '' && showSelectedClinic === true) {
                clinicGP = data.get('selectedClinic')
                console.log("fwefwefwtfrwe", clinicGP)

            }
            else {
                clinicGP = data.get('selectedGP')
                console.log("fwetfrwe", clinicGP)
            }

            var timeslot = '';
            if (clinicDateTimePickerValue !== '') {
                timeslot = clinicDateTimePickerValue.format('DD/MM/YYYY HH:mm');
            }
            else {
                timeslot = GPDateTimePickerValue.format('DD/MM/YYYY HH:mm');
            }
            console.log({ clinicGP, timeslot });

            const response = await fetch('http://localhost:5000/appointment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: sessionStorage.getItem("email"),
                    clinicGP: clinicGP,
                    timeslot: timeslot,
                }),
            });

            const result = await response.json();

            console.log(response);

            if (response.ok) {
                console.log('Appointment booking successful');
                setSuccessModalOpen(true);
            }
            else {
                console.log('Registration failed:', result.message);
            }
        }
        catch (error) {
            console.error('Error', error);
        }
    };

    useEffect(() => {
        fetchData();
        if (selectedClinic !== '') {
            setShowAlert(true);
            setShowDateTimePicker(true);
            setShowGPDateTimePicker(false);
            setOpen(true);
        } else {
            setShowAlert(false);
            setShowDateTimePicker(false);
            setOpen(false);
        }

        if (selectedGP !== '') {
            setIsButtonDisabled(false);
        }
        else {
            setIsButtonDisabled(true);
        }
    }, [selectedClinic, selectedGP]);

    return (
        <Container>
            <Grid>
                {showAlert && (
                    <Alert severity="warning">
                        <AlertTitle></AlertTitle>
                        <strong>There are no more appointments available</strong>
                    </Alert>
                )}
            </Grid>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Grid>
                    {showSelectedClinic && (
                        <InputLabel id="clinic-select-label">Select Clinic</InputLabel>
                    )}
                    {showSelectedClinic && (
                        <Select
                            name="selectedClinic"
                            labelId="selectedClinic"
                            id="selectedClinic"
                            value={selectedClinic}
                            label="Select Clinic"
                            onChange={handleClinicChange}
                            sx={{ width: '100vh', mb: 2 }}
                        >
                            {clinicList.map((clinic, index) => (
                                <MenuItem key={index} value={clinic.name}>
                                    {clinic.name}
                                </MenuItem>
                            ))}
                        </Select>)}
                </Grid>
                <Grid>
                    {showDateTimePicker && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                name="clinicTimeslot"
                                label="Select timeslot"
                                value={clinicDateTimePickerValue}
                                onChange={(newValue) => setClinicDateTimePickerValue(newValue)}
                                sx={{ mb: 2, width: '25vh' }}
                                minDate={minDate}
                            />
                        </LocalizationProvider>)}
                </Grid>
                <Grid>
                    <Dialog open={open}>
                        <DialogTitle>There are no more available slots left</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Would you like to book an appointment at a General Practitioner (GP) instead?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleNo} color="primary">
                                No
                            </Button>
                            <Button onClick={handleYes} color="primary" autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
                <Grid>
                    {showSelectGP && (
                        <InputLabel id="gp-select-label">Select GP</InputLabel>
                    )}
                    {showSelectGP && (

                        <Select
                            name="selectedGP"
                            labelId="selectedGP"
                            id="selectedGP"
                            value={selectedGP}
                            label="Select GP"
                            onChange={handleGPChange}
                            sx={{ width: '100vh', mb: 2 }}
                        >
                            {GPList.map((GP, index) => (
                                <MenuItem key={index} value={GP.name}>
                                    {GP.name}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                </Grid>
                <Grid>
                    {showGPDateTimePicker && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                name="GPTimeslot"
                                label="GPTimeslot"
                                value={GPDateTimePickerValue}
                                onChange={(newValue) => setGPDateTimePickerValue(newValue)}
                                sx={{ mb: 2, width: '25vh' }}
                                minDate={minDate}
                            />
                        </LocalizationProvider>)}
                </Grid>
                <Grid>
                    {showButton && (
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mb: 2 }}
                            disabled={isButtonDisabled}
                        >
                            Book Appointment
                        </Button>)}
                </Grid>
            </Box>
            <Dialog open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
                <DialogTitle>Success!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your appointment has been successfully booked.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuccessModalOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}