import { useState } from 'react';
import photo_unavailable from '../../../assets/photo_unavailable.jpg';
import loading_photo from '../../../assets/loading_photo.jpg';
import styles from './PropertyCard.module.css';

/**
 * The component to display a property. 
 * @param {string} photo - The first photo URL of the property.
 * @param {number} price - The listing price of the property.
 * @param {string} address - The address line of the property.
 * @param {string} zip - The zip code of the property.
 * @param {string} city - The city of the property.
 * @param {string} state - The state of the property.
 * @param {number} beds - The number of beds that the property has.
 * @param {number} beds - The number of baths that the property has.
 */
export function PropertyCard({ photo, price, address, zip, city, state, beds, baths, sqft }) {
    const [photoIsLoading, setPhotoIsLoading] = useState(true);

    // Replace properties with no photos.
    photo = photo === 'Photo Unavailable' ? photo_unavailable : photo;

    // Set placeholder cards for photos that are still loading.
    const actual = photoIsLoading ? {display: "none"} : {display : "block"};
    const placeholder = photoIsLoading ? {display: "block"} : {display: "none"};

    // TODO: Handle empty strings in the description container.
    // TODO: Add commas to prices.
    return (
        <div className={styles.property_card} >
            <div className={styles.image_container} style={actual}>
                <img src={photo} onLoad={() => setPhotoIsLoading(false)}></img>
            </div>   
            <div className={styles.image_container} style={placeholder}>
                <img src={loading_photo}></img>
            </div>
            <div className={styles.description_container}>
                <p id={styles.price}>${price}</p>
                <p><b>Beds</b>: {beds} | <b>Baths</b>: {baths} | <b>Sqft</b>: {sqft}</p>
                <p id={styles.address}>{address}, {city}, {state} {zip}</p>
            </div>
        </div>
    )
}