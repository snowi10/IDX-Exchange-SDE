import { useState } from 'react';
import { NavLink } from 'react-router';
import { createFullAddress } from '../../../common/createFullAddress.js';
import { PropertyImageCarousel } from './PropertyImageCarousel';
import photo_unavailable from '../../../assets/photo_unavailable.jpg';
import loading_photo from '../../../assets/loading_photo.jpg';
import styles from './PropertyCard.module.css';

/**
 * The component to display individual properties on a card. 
 * @param {number} id - The ID of the property
 * @param {string} photos - The list of URLs of photos of the property.
 * @param {number} price - The listing price of the property.
 * @param {string} address - The address line of the property.
 * @param {string} zip - The zip code of the property.
 * @param {string} city - The city of the property.
 * @param {string} state - The state of the property.
 * @param {number} beds - The number of beds that the property has.
 * @param {number} baths - The number of baths that the property has.
 * @param {number} sqft - The square feet of the property.
 */
export function PropertyCard({ id, photos, price, address, zip, city, state, beds, baths, sqft }) {
    const [photoIsLoading, setPhotoIsLoading] = useState(true);
    const [currentPhoto, setCurrentPhoto] = useState(0);

    // Use address, city, state, and zip to create a full, readable address to display on the card.
    const fullAddress = createFullAddress(address, city, state, zip);

    // To handle clicking to the previous photo.
    function handlePrevPhotoClick(e) {
        e.preventDefault();
        e.stopPropagation();

        // Do nothing for no photos to move to.
        if (photos === 'Photo Unavailable') {
            return;
        }
        if (photos.length <= 1) {
            return;
        }

        // Move to the previous photo.
        if (currentPhoto > 0) {
            setCurrentPhoto(currentPhoto - 1);
            setPhotoIsLoading(true);
        }
        // Move to the last photo when at the beginning photo.
        else {
            setCurrentPhoto(photos.length - 1);
            setPhotoIsLoading(true);
        }
    }

    // To handle clicking to the next photo.
    function handleNextPhotoClick(e) {
        e.preventDefault();
        e.stopPropagation();

        // Do nothing for no photos to move to.
        if (photos === 'Photo Unavailable') {
            return;
        }
        if (photos.length <= 1) {
            return;
        }

        // Move to the next photo.
        if (currentPhoto < photos.length - 1) {
            setCurrentPhoto(currentPhoto + 1);
            setPhotoIsLoading(true);
        }
        // Move to beginning photo when at the last photo.
        else {
            setCurrentPhoto(0);
            setPhotoIsLoading(true);
        }
    }

    // Replace properties with no photos.
    let displayPhoto = photos === 'Photo Unavailable' ? photo_unavailable : photos[currentPhoto];

    // Set placeholder cards for photos that are still loading.
    const actual = photoIsLoading ? {display: "none"} : {display : "block"};
    const placeholder = photoIsLoading ? {display: "block"} : {display: "none"};

    // TODO: Add commas to prices.
    return (
        <NavLink to={`/property/${id}`}>
        <div className={styles.property_card}>
            <PropertyImageCarousel style={actual} photo={displayPhoto} currentPhoto={photos === 'Photo Unavailable' ? 0 : currentPhoto + 1} totalPhotos={photos === 'Photo Unavailable' ? 0 : photos.length} setPhotoIsLoading={setPhotoIsLoading} onPrevPhotoClick={handlePrevPhotoClick} onNextPhotoClick={handleNextPhotoClick}/> 
            <PropertyImageCarousel style={placeholder} photo={loading_photo} currentPhoto={photos === 'Photo Unavailable' ? 0 : currentPhoto + 1} totalPhotos={photos === 'Photo Unavailable' ? 0 : photos.length} onPrevPhotoClick={handlePrevPhotoClick} onNextPhotoClick={handleNextPhotoClick} />
            <div className={styles.description_container}>
                <p id={styles.price}>${price}</p>
                <p><b>Beds</b>: {beds} | <b>Baths</b>: {baths} | <b>Sqft</b>: {sqft}</p>
                <p id={styles.address}>{fullAddress}</p>
            </div>
        </div>
        </NavLink>
    )
}