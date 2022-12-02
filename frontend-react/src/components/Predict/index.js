import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import DataService from "../../services/DataService";
import CircularProgress from '@material-ui/core/CircularProgress';

// import styles from './styles';

const styles = theme => ({
    card: {
        maxWidth: 550,
    },
    media: {
        maxheight: 200,
    },
});

const Predict = (props) => {
    const { classes } = props;

    // console.log("================================== Predict ======================================");


    // Component States
    const [id, setId] = useState("");
    const [outputs, setOutputs] = useState("");
    const [isLoading, setIsLoading] = useState(false)


    // Setup Component
    useEffect(() => {

    }, []);

    // Handlers
    const handleOnSynthesisClick = () => {
        setIsLoading(true)
        var formData = new FormData();
        formData.append("patient_id", id);
        DataService.Predict(formData)
            .then(function (response) {
                setOutputs(response.data.explain);
                setIsLoading(false)

            })
    }



    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false} className={classes.container}>
                    <Typography variant="h5" gutterBottom>Patient ID</Typography>
                    <Grid container spacing={8}>
                        <Grid item md={5}>
                            <br />
                            <Typography>
                                Enter patient id (Don't know any patient id?.. Try 1111)
                            </Typography>
                            <br />
                            <TextField
                                label="Patient ID (eg 1111)"
                                variant="outlined"
                                // fullWidth
                                value={id}
                                onChange={(event) => setId(event.target.value)}
                            />
                            <br />
                            <br />
                            {/* <br /> */}
                            <Button variant="contained" onClick={() => handleOnSynthesisClick()}>Submit</Button>
                        </Grid>
                        <Grid item md={7}>
                            {isLoading && <CircularProgress color="secondary" />}
                            {!isLoading && outputs && (
                                <Card className={classes.card}>
                                    {/* <img  src={outputs} alt="Card image cap" /> */}
                                    <CardMedia
                                        component="img"
                                        alt="Explainable Image"
                                        className={classes.media}
                                        // height="140"
                                        image={outputs}
                                    />
                                    {/* <CardMedia
                                            // className={classes.media}
                                            image={outputs}
                                            title="Stylelized image"
                                        /> */}
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Explainable Image
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                                The highlighted areas are likely to be fractured.
                                        </Typography>
                                    </CardContent>
                                </Card>

                            )}
                            {
                                !isLoading && !outputs && (
                                    <Card>

                                        <CardContent>
                                            <Typography align="center" variant="body2">
                                                <strong>Enter Patient ID to view possible fracture locations</strong>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                )
                            }
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Predict);