import { useParams, useLocation } from 'react-router';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchPropertyDetail, fetchOpenhouseDetail } from '../api/client';
import { createFullAddress } from '../common/createFullAddress.js';
import { PropertyImageGallery } from './components/property-image-gallery/PropertyImageGallery.jsx';
import { Openhouse } from './components/openhouse/Openhouse.jsx';
import { PropertyMap } from './components/property-map/PropertyMap.jsx';
import { errorBoundaryMessage } from '../common/errorBoundaryMessage.jsx';
import styles from './PropertyDetailPage.module.css';

// TODO: Add more descriptions to the page.
export default function PropertyDetailPage() {
    const [propDetails, setPropDetails] = useState({})
    const [photoGallery, setPhotoGallery] = useState([]);
    const [openhouseDetails, setOpenhouseDetails] = useState([]);
    const [descriptionIsOverflowing, setDescriptionIsOverflowing] = useState(false);
    const [descriptionShowMore, setDescriptionShowMore] = useState(false);
    const { id } = useParams();
    const thisPath = useLocation();
    const descriptionText = useRef(null);

    let descriptionShowText = '';
    let descriptionDisplay = {};
    let descriptionEllipsisDisplay = {};
    let descriptionShowMoreDisplay = {};
    let breakDisplay = {};

    // Add 'Show more' button for long property description.
    if (descriptionIsOverflowing) {
        descriptionShowText = descriptionShowMore ? 'Show less' : 'Show more';
        breakDisplay = !descriptionShowMore ? {display: 'none'} : {};
        descriptionDisplay = descriptionShowMore ? {maxHeight: '100%'} : {};
        descriptionEllipsisDisplay = descriptionShowMore ? {display: 'none'} : {display: 'block'};
    }
    else {
        descriptionEllipsisDisplay = {display: 'none'};
        descriptionShowMoreDisplay = {display: 'none'};
        breakDisplay = {display: 'none'};
    }

    // To handle showing more of the description of a property.
    function handleOnShowClick() {
        if (descriptionShowMore) {
            setDescriptionShowMore(false);
        }
        else {
            setDescriptionShowMore(true);
        }
    }
    
    // Scroll to top of the page on first navigation.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [thisPath]);

    // Fetch details of a property.
    useEffect(() => {
        const fetchPropDetail = async () => {
            const detail = await fetchPropertyDetail(id);
            const photos = detail.L_Photos ? JSON.parse(detail.L_Photos) : 'Photo Unavailable';
            const price = detail.L_SystemPrice ? parseInt(detail.L_SystemPrice).toLocaleString('en-us') : 'N/A';
            const address = detail.L_Address;
            const city = detail.L_City;
            const zip = detail.L_Zip;
            const state = detail.L_State;
            const beds = detail.L_Keyword2? parseInt(detail.L_Keyword2) : 'N/A';
            const baths = detail.LM_Dec_3 ? parseInt(detail.LM_Dec_3) : 'N/A';
            const sqft = detail.LM_Int2_3 ? parseInt(detail.LM_Int2_3) : 'N/A';
            const year = detail.YearBuilt ? detail.YearBuilt : 'N/A';
            const description = detail.L_Remarks;
            const latitude = detail.LMD_MP_Latitude;
            const longitude = detail.LMD_MP_Longitude;

            const fullAddress = createFullAddress(address, city, state, zip);

            setPropDetails({
                price: price, 
                address: fullAddress, 
                beds: beds, 
                baths: baths, 
                sqft: sqft, 
                year: year,
                description: description,
                latitude: latitude,
                longitude: longitude,
                json: JSON.stringify(detail)});
            
            setPhotoGallery(photos === 'Photo Unavailable' ? [] : photos);
        }

        fetchPropDetail();

    }, []);


    // Fetch openhouse information of a property.
    useEffect(() => {
        const getOpenhouseDetail = async () => {
            const detail = await fetchOpenhouseDetail(id);
            let currOpenhouse = {};

            if (detail.lenth === 0) {
                currOpenhouse = {isInfo: false}; // No openhouse information exists.
            }
            else {

                for (let i = 0; i < detail.length; i++) {
                    const status = detail[i].OpenHouseStatus;
                    const type = detail[i].OpenHouseType;
                    const startTime = detail[i].OpenHouseStartTime ? new Date(detail[i].OpenHouseStartTime).toLocaleTimeString('en-US', {timeStyle: 'short'}) : 'N/A';
                    const endTime = detail[i].OpenHouseEndTime ? new Date(detail[i].OpenHouseEndTime).toLocaleTimeString('en-US', {timeStyle: 'short'}) : 'N/A';
                    const date = detail[i].OpenHouseDate ? new Date(detail[i].OpenHouseDate).toLocaleDateString('en-US') : 'N/A'; 
                    const agentFirstName = detail[i].ShowingAgentFirstName ? detail[i].ShowingAgentFirstName : 'N/A';
                    const agentLastName = detail[i].ShowingAgentLastName ? detail[i].ShowingAgentLastName : 'N/A';

                    currOpenhouse = {
                        isInfo: true,
                        status: status, 
                        type: type, 
                        startTime: startTime, 
                        endTime: endTime,
                        date: date,
                        agentFirstName: agentFirstName,
                        agentLastName: agentLastName
                    }
                }

                setOpenhouseDetails(...openhouseDetails, <Openhouse details={currOpenhouse}></Openhouse>);
            }
        }

        getOpenhouseDetail();
    }, []);

    // TODO: Rerun effect when browser is resized.
    // Determine if description of propety is long.
    useEffect(() => {
        function checkIsOverflowing() {
            if ((descriptionText.current).clientHeight < (descriptionText.current).scrollHeight) {
                setDescriptionIsOverflowing(true);
            }
            else {
                setDescriptionIsOverflowing(false);
            }
        }

        window.addEventListener('resize', checkIsOverflowing);
        checkIsOverflowing();
        return () => window.removeEventListener('resize', checkIsOverflowing);

    }, [propDetails]);

    return (
    <ErrorBoundary fallback={errorBoundaryMessage()}>
        <PropertyImageGallery photos={photoGallery} />
        <div id={styles.detail_body}>
            <div>
                <h1 id={styles.main}><b>${propDetails.price}</b> | <b>Beds:</b> {propDetails.beds} | <b>Baths:</b> {propDetails.baths} | <b>Sqft:</b> {propDetails.sqft}<br></br></h1>
                <h2 id={styles.address}>{propDetails.address}</h2>
                <h3><b>Features:</b></h3>
                <p>Year built: {propDetails.year}</p>
                <h3><b>Description:</b><br></br></h3>
                <div id={styles.description} style={descriptionDisplay} ref={descriptionText}>
                    <p className={styles.subsection_body}>{propDetails.description}</p>
                </div>
                <p style={descriptionEllipsisDisplay}>...</p>
                <br style={breakDisplay}></br>
                <button className={styles.show_more} type='button' style={descriptionShowMoreDisplay} onClick={() => handleOnShowClick()}>{descriptionShowText}</button>
            </div>
            {openhouseDetails}
            <hr></hr>
            <PropertyMap latitude={propDetails.latitude} longitude={propDetails.longitude} />
        </div>
    </ErrorBoundary>);
}