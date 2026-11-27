import { useState, useRef, useEffect } from 'react';
import styles from '../../PropertyDetailPage.module.css';

/**
 * The component to display openhouse information of a property. 
 * @param {object} details - Keys representing openhouse details and their values.
 */
export function Openhouse({ details }) {
    const [openhouseShowMore, setOpenhouseShowMore] = useState(false);
    const openhouseText = useRef(null);
    let agentName;

    let openhouseShowText = openhouseShowMore ? 'Show less' : 'Show more';
    let openhouseEllipsis = openhouseShowMore ? {display: 'none'} : {};
    let openhouseDetailStyle = openhouseShowMore ? {maxHeight: '100%'} : {maxHeight: '120px'};
    
    // Handle clicking on the 'Show more' button.
    function handleOnShowClick() {
        if (openhouseShowMore) {
            setOpenhouseShowMore(false);
        }
        else {
            setOpenhouseShowMore(true); 
        }
    }

    // Return no openhouse information if it does not exist.
    if (!details.isInfo) {
        return;
    }

    // Adjust 'Show more' button according to window size.
    useEffect(() => {
        if (openhouseText.current.clientHeight < openhouseText.current.scrollHeight) {
            console.log(true);
        }
    }, []);

    // Handle empty showing agent names. 
    if (details.agentFirstName === 'N/A' || details.agentLastName === 'N/A') {
        agentName = 'N/A';
    }
    else {
        agentName = `${details.agentFirstName} ${details.agentLastName}`;
    }

    return (
        <>
            <hr></hr>
            <div id={styles.openhouse_detail} ref={openhouseText} style={openhouseDetailStyle}>
                <h1><b>Openhouse:</b></h1>
                <h3><b>Status:</b> {details.status}</h3>
                <h3><b>Type:</b> {details.type}</h3>
                <h3><b>Date:</b> {details.date}</h3>
                <h3><b>Start Time:</b> {details.startTime}</h3>
                <h3><b>End Time:</b> {details.endTime}</h3>
                <h3><b>Showing Agent:</b> {agentName}</h3>
                <br></br>
            </div>
            <p style={openhouseEllipsis}>...</p>
            <button className={styles.show_more} type='button' onClick={() => handleOnShowClick()}>{openhouseShowText}</button>
        </>
       );
}