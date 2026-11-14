import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { fetchPropertyDetail } from '../api/client';
import { createFullAddress } from '../common/createFullAddress.js';
import { PropertyImageGallery } from './components/PropertyImageGallery.jsx';
import styles from './PropertyDetailPage.module.css';

// TODO: Add more descriptions to the page.
// TODO: Display open house information.
// TODO: Add Google maps location.
// TODO: Create lightbox.
export default function PropertyDetailPage({ }) {
    const [propDetail, setPropDetail] = useState({})
    const [photoGallery, setPhotoGallery] = useState([]);
    const { id } = useParams();

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

            const fullAddress = createFullAddress(address, city, state, zip);

            setPropDetail({
                price: price, 
                address: fullAddress, 
                beds: beds, 
                baths: baths, 
                sqft: sqft, 
                year: year,
                description: description,
                json: JSON.stringify(detail)});
            
            setPhotoGallery(photos === 'Photo Unavailable' ? [] : photos);
        }

        fetchPropDetail();

    }, []);

    return (
    <>
        <PropertyImageGallery photos={photoGallery} />
        <p id={styles.main}><b>${propDetail.price}</b> | Beds: {propDetail.beds} | Baths: {propDetail.baths} | Sqft: {propDetail.sqft}</p>
        <p id={styles.address}>{propDetail.address}</p>
        <p>Year built: {propDetail.year}</p>
        <p>{propDetail.description}</p>
    </>);
}