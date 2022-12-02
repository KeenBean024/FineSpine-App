import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import DataService from "../../services/DataService";
import styles from './styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';

const Home = (props) => {
    const { classes } = props;

    // console.log("================================== Home ======================================");


    // Setup Component
    useEffect(() => {

    }, []);

    return (

        <div class="div_content">
            <div class="row">
                <div><center> ,<h1>Hello and welcome to the FineSpine App.</h1> </center></div>
                <br />
                <div class="column">
                    <center><strong>Step 1.</strong> Zip and upload the patient's MRI scans.
                        <br />
                        <IconButton color="inherit" component={Link} to="/upload">
                            <Icon>cloud_upload</Icon>
                            <Typography variant="caption">&nbsp;Upload</Typography>
                        </IconButton>
                        {/* <a href="/upload">
                            <button>Upload</button>
                        </a> */}
                    </center></div>
                <br /><br />
                <div class="column">
                    <center><strong>Step 2.</strong>Get the fracture prediction for the patient
                        <br />                        
                        <IconButton color="inherit" component={Link} to="/predict">
                            <Icon>image_search</Icon>
                            <Typography variant="caption">&nbsp;Predict</Typography>
                        </IconButton></center></div>
            </div>
        </div>
    );
};

export default withStyles(styles)(Home);