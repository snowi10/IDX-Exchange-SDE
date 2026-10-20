import { useState, useEffect } from 'react';
import { fetchProperties } from './api/client';
import styles from './ListingsPage.module.css';

export default function ListingsPage() {

    const [properties, setProperties] = useState([])
    const [totalProperties, setTotalProperties] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null); 

    useEffect(() => {

        const callFetchProperties = async () => {

            try {
                const response = await fetchProperties()

                if (response.status !== 200) {
                    const json = await response.json();
                    setErrorMessage(`${json.status}, 
                        ${json.error}`);
                }
                else {

                    const json = await response.json();
                    let updatedProperties = [];

                    for (let i = 0; i < json.results.length; i++) {

                        const result = json.results[i];
                        const photo = result.L_Photos ? JSON.parse(result.L_Photos)[0] : 'Photo Unavailable';
                        const price = result.L_SystemPrice;
                        const address = result.L_Address;
                        const city = result.L_City;
                        const state = result.L_State;
                        const beds = result.L_Keyword2;
                        const baths = parseInt(result.LM_Dec_3);
                        const sqft = result.LM_Int2_3;

                        updatedProperties.push(<PropertyCard 
                            key={i} 
                            photo={photo} 
                            price={price} 
                            address={address} 
                            city={city} 
                            state={state} 
                            beds={beds} 
                            baths={baths} 
                            sqft={sqft}/>)
                    }

                    setProperties(updatedProperties);
                    setTotalProperties(json.total);
                }

            }
            catch (error) {
                setErrorMessage(error.message);
            }
        }

        callFetchProperties();
    }, []);

    if (errorMessage) {
        return <div>{errorMessage}</div>
    }

    // TODO: reformat
    return (
    <>
        <div>{properties}</div>
        <div>Showing {properties.length} out of {totalProperties} properties</div>
    </>)    
}

function PropertyCard({ photo, price, address, city, state, beds, baths, sqft }) {
    // TODO: Add zipcode.
    // TODO: Reformat cards and descriptions.
    return (
    <div class={styles.card}>
        <div class={styles.container}>
            <img src={photo}></img>
            <p>${price}</p>
            <p>{address}, {city}, {state}</p>
            <p>Beds: {beds}</p>
            <p>Baths: {baths}</p>
            <p>Square Feet: {sqft}</p>
        </div>
   </div>)
}