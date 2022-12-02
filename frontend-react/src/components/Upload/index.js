import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import DataService from "../../services/DataService";
import styles from './styles';

const Upload = (props) => {
    const { classes } = props;

    // console.log("================================== Upload ======================================");

    const inputFile = useRef(null);

    // Component States
    const [status, setStatus] = useState(null);
    const [id, setId] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [filename, setfilename] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    // Setup Component
    useEffect(() => {

    }, []);

    // Handlers
    const handleImageUploadClick = () => {
        var fname = inputFile.current.files[0].name
        setfilename(fname.substr(0, fname.indexOf('.')))
        inputFile.current.click();
    }
    const handleOnChange = (event) => {
        setIsLoading(true)
        var formData = new FormData();
        formData.append("file", inputFile.current.files[0]);
        formData.append("patient_id", id);

        DataService.Upload(formData)
            .then(function (response) {
                setPrediction(response.data);
                setStatus(response.status);
                setIsLoading(false)
            })
    }

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="md" className={classes.container}>
                    
                    <Typography variant="h6" gutterBottom align='center'>Upload zip file &nbsp; &nbsp; 
                    <input 
                            type="file"
                            accept="zip/*"
                            on
                            autocomplete="off"
                            tabindex="-1"
                            display="false"
                            // className={classes.fileInput}
                            ref={inputFile}
                            onChange={(event) => handleImageUploadClick(event)}
                            required
                        /></Typography>
                    <br /><br />
                    <Typography variant="h6" gutterBottom align='center'>Patient ID &nbsp; &nbsp; 
                        <TextField
                            label="Patient ID"
                            variant="outlined"
                            // fullWidth
                            onChange={(event) => setId(event.target.value)}
                            required
                        />
                        {/* <input
                                type="text"
                                value={filename}
                                ref={id}
                                onChange={(event) => setId(event.target.value)}
                                // onChange={(event) => handleImageUploadClick(event)}
                            /> */}
                    </Typography>
                    <br /><br />
                    <center><Button variant="contained" onClick={() => handleOnChange()}>Submit</Button>
                    <br /><br />
                    {isLoading && <CircularProgress color="secondary" />} 
                    {!isLoading && prediction && status===200 &&
                        <Typography variant="h6" gutterBottom align='center'>

                                <span className={classes.safe}>{prediction["message"]}</span>
                           
                        </Typography>
                    }
                    {!isLoading && prediction && status!==200 &&
                        <Typography variant="h6" gutterBottom align='center'>

                                <span className={classes.poisonous}>{prediction["detail"]}</span>
                           
                        </Typography>
                    }
                    </center>
                    
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Upload);