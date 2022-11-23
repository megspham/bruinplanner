/**
 * @file Instructions for uploading a DARS file for import. 
 * Communicates with the backend to parse the uploaded DARS file, and 
 * sends the result to the Calendar for display.
 * @author Andy Goh
 */

import React from "react";
import BackgroundSvg from "../images/DARSPageBackground.svg";
import { useLocation } from "react-router-dom";
import UploadFileForm from "./UploadFileForm";

// TODO: Make styling better for DARS upload page
import "./DARSUpload.css";

const DARSUpload = () => {
    const location = useLocation();
    const id = location.state.id;
    return (
        <div className="dars-upload-container welcome-message">
            <img src={BackgroundSvg} alt="Your SVG" class="dars-bg" />
            <ol className='instructions'>
                <h2>To obtain your DARS Report...</h2>
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