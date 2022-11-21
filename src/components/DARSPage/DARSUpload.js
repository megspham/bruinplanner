/**
 * @file Defines the page that new users are taken to upon login. It has a welcome
 * message for the user, and options (via buttons) to start with a blank template 
 * or import DARs.
 * @author Andy Goh
 */

import React from "react";
import "./DARSUpload.css";
import BackgroundSvg from "../images/DARSPageBackground.svg";
import { CustomizedButton } from "../CustomizedButton";
import { Link } from "react-router-dom";
import Logout from "../Logout";
import { useLocation } from "react-router-dom";
import UploadFileForm from "./UploadFileForm";

const DARSUpload = () => {
    const location = useLocation();
    const id = location.state.id;
    return (
        <div className="dars-upload-container">
            <img src={BackgroundSvg} alt="Your SVG" class="dars-bg" />
            <ol className='instructions'>
                <li>Generate a DARS audit from MyUCLA</li>
                <li>Click on "View Report"</li>
                <li>Right click and press "Save As..." and choose the option "Webpage, complete"</li>
            </ol>
            <div class="page-content">
                <div class="dars-button-container">
                    <UploadFileForm googleId={id}></UploadFileForm>
                </div>
            </div>
        </div>
    );
};

export default DARSUpload;