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
import Login from "../Login";

// TODO: Make styling better for DARS upload page
import "./DARSUpload.css";

const DARSUpload = () => {
    const location = useLocation();
    const id = location.state ? location.state.id : null;
    return (
        <div>
            {id ?
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
                </div >
                :
                <div>
                    <h1 class="welcome-message">
                        Please sign in again
                    </h1>
                    <div class="dars-button-container">
                        <Login destination={"/dars/upload"}></Login>
                    </div>
                </div>
            }
        </div>
    );
};

export default DARSUpload;