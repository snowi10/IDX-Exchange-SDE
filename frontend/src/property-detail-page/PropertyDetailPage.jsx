import { useParams, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchPropertyDetail, fetchOpenhouseDetail } from '../api/client';
import { createFullAddress } from '../common/createFullAddress.js';
import { PropertyImageGallery } from './components/property-image-gallery/PropertyImageGallery.jsx';
import { Openhouse } from './components/openhouse/Openhouse.jsx';
import { PropertyMap } from './components/property-map/PropertyMap.jsx';
import { errorBoundaryMessage } from '../common/errorBoundaryMessage.jsx';
import styles from './PropertyDetailPage.module.css';

// TODO: Add more descriptions to the page.
// TODO: Parse time of openhouse information.
// TODO: Have 'show more' button for long sections.
// TODO: Fix empty strings for openhouse information.
export default function PropertyDetailPage() {
    const [propDetail, setPropDetail] = useState({})
    const [photoGallery, setPhotoGallery] = useState([]);
    const [openhouseDetails, setOpenhouseDetails] = useState([]);
    const { id } = useParams();
    const thisPath = useLocation();

    // Scroll to top of the page on first navigation.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [thisPath]);

    // Fetch details of a property.
    useEffect(() => {
        const fetchPropDetail = async () => {
            const detail = await fetchPropertyDetail(id);
            const photos = detail.L_Photos ? JSON.parse(detail.L_Photos) : 'Photo Unavailable';
            const price = detail.L_SystemPrice ? parseInt(detail.L_SystemPrice) : 'N/A';
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

            setPropDetail({
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
                    const startTime = detail[i].OpenHouseStartTime;
                    const endTime = detail[i].OpenHouseEndTime;
                    const date = detail[i].OpenHouseDate;
                    const agentFirstName = detail[i].ShowingAgentFirstName;
                    const agentLastName = detail[i].ShowingAgentLastName;
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

    return (
    <ErrorBoundary fallback={errorBoundaryMessage()}>
        <PropertyImageGallery photos={photoGallery} />
        <div id={styles.detail_body}>
            <div>
                <h1 id={styles.main}><b>${propDetail.price}</b> | <b>Beds:</b> {propDetail.beds} | <b>Baths:</b> {propDetail.baths} | <b>Sqft:</b> {propDetail.sqft}<br></br></h1>
                <h2 id={styles.address}>{propDetail.address}</h2>
                <h3><b>Features:</b></h3>
                <p>Year built: {propDetail.year}</p>
                <h3><b>Description:</b><br></br></h3>
                <p>{propDetail.description}</p>
            </div>
            <hr></hr>
            {openhouseDetails}
            <hr></hr>
            <PropertyMap latitude={propDetail.latitude} longitude={propDetail.longitude} />
        </div>
    </ErrorBoundary>);
}