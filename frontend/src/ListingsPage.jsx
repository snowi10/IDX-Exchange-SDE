import { useState, useEffect} from 'react';
import { fetchProperties } from './api/client';
import styles from './ListingsPage.module.css';
import photo_unavailable from './assets/photo_unavailable.jpg';
import loading_photo from './assets/loading_photo.jpg';

export default function ListingsPage() {

    const [properties, setProperties] = useState([])
    const [totalProperties, setTotalProperties] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null); 

    useEffect(() => {

        const callFetchProperties = async () => {

            try {

                // API call to backend to fetch properties.
                const response = await fetchProperties();

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
                setLoading(false); // Set loading state to false after fetch has completed.
            }
        }

        // setTimeout to verify loading screen. 
        //setTimeout(callFetchProperties, 1000);

        callFetchProperties(); // Fetch properties.

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

    return (
    <>
        <PropertyFilter />
        <div id={styles.showing}>Showing {properties.length} out of {totalProperties} properties</div>
        <div class={styles.grid}>{properties}</div>
    </>)    
}

function PropertyCard({ photo, price, address, city, state, beds, baths, sqft }) {
    const [photoIsLoading, setPhotoIsLoading] = useState(true);

    // Replace properties with no photos.
    photo = photo === 'Photo Unavailable' ? photo_unavailable : photo;

    // Set placeholder cards for photos that are still loading.
    const actual = photoIsLoading ? {display: "none"} : {display : "block"};
    const placeholder = photoIsLoading ? {display: "block"} : {display: "none"};

    // TODO: Add zipcode.
    // TODO: Choose font for card descriptions.
    return (
        <div class={styles.card} >
            <div class={styles.image_container} style={actual}>
                <img src={photo} onLoad={() => setPhotoIsLoading(false)}></img>
            </div>   
            <div class={styles.image_container} style={placeholder}>
                <img src={loading_photo}></img>
            </div>
            <div class={styles.description_container}>
                <p id={styles.price}>${price}</p>
                <p><b>Beds</b>: {beds} | <b>Baths</b>: {baths} | <b>Square Feet</b>: {sqft}</p>
                <p id={styles.address}>{address}, {city}, {state}</p>
            </div>
        </div>
    )
}

function PropertyFilter() {
    // TODO: Filter for city, zip code, min price, max price, beds (dropdown), baths (dropdown).

    return (
        <div class={styles.filter}>
            <form>
            <label for={styles.city_input}>City</label>
            <input id={styles.city_input} type="text"></input>            
                                                                         
            <label for={styles.zip_input}>Zip</label>                   
            <input id={styles.zip_input} type="text"></input>
                                                                         
            <label for={styles.min_price}>Min Price</label>                   
            <input id={styles.min_price} type="text"></input>
            
            <label for={styles.max_price}>Max Price</label>                   
            <input id={styles.max_price} type="text"></input>

            <label for={styles.beds}>Beds</label>                   
            <select id={styles.beds}></select>

            <label for={styles.baths}>Baths</label>                   
            <select id={styles.baths}></select>

            </form>
        </div>
    )
}