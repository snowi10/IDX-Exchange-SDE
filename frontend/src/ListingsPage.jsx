import { useState, useEffect } from 'react';
import { fetchProperties } from './api/client';
import styles from './ListingsPage.module.css';
import photo_unavailable from './assets/photo_unavailable.jpg'

export default function ListingsPage() {

    const [properties, setProperties] = useState([])
    const [totalProperties, setTotalProperties] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null); 

    useEffect(() => {

        const callFetchProperties = async () => {

            try {

                // API call to backend to fetch properties.
                const response = await fetchProperties()

                // Handle errors from JSON response.
                if (response.status !== 200) {
                    const json = await response.json();
                    setErrorMessage(`${json.status}, 
                        ${json.error}`);
                }
                else {

                    const json = await response.json();
                    let updatedProperties = [];

                    // Create PropertyCard components for each property.
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
            finally {
                setLoading(false);
            }
        }

        callFetchProperties();

        // setTimeout to verify loading screen. 
        // setTimeout(callFetchProperties, 1000);
    }, []);

    // TODO: Create better UI for error message.
    // Display error messages.
    if (errorMessage) {
        return <div>{errorMessage}</div>
    }

    // TODO: Create better UI for loading screen.
    // Display loading screen. 
    if (loading) {
        return <div>Loading...</div>
    }

    // TODO: reformat
    return (
    <>
        <div class={styles.grid}>{properties}</div>
        <div>Showing {properties.length} out of {totalProperties} properties</div>
    </>)    
}

function PropertyCard({ photo, price, address, city, state, beds, baths, sqft }) {

    // Replace image of properties with no photo URLs.
    photo = photo === 'Photo Unavailable' ? photo_unavailable : photo;

    // TODO: Add zipcode.
    // TODO: Reformat cards and descriptions.
    // TODO: Create function for handling loading images.
    return (
    <div class={styles.card}>
        <div class={styles.image_container}>
            <img src={photo} loading="lazy"></img>
        </div>
        <div class={styles.description_container}>
            <p>${price}</p>
            <p>{address}, {city}, {state}</p>
            <p>Beds: {beds}</p>
            <p>Baths: {baths}</p>
            <p>Square Feet: {sqft}</p>
        </div>
   </div>)
}