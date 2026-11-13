import styles from './PropertyCard.module.css';

/**
 * 
 * @param {string} photo - The URL of the photo to be displayed for a property card.
 * @param {number} currentPhoto - The index number of the current photo of a property.
 * @param {number} totalPhotos - The total number of photos of a property.
 * @param {object} style - To either display or not display the PropertyImageCarousel for a property.
 * @param {function} setPhotoIsLoading - To set whether the photo is loading or not.
 * @param {function} onPrevPhotoClick - To handle when the button to move to the previous photo is clicked on.  
 * @param {function} onNextPhotoClick - To handle when the button to move to the next photo is clicked on.
 * @returns 
 */
export function PropertyImageCarousel({photo, currentPhoto, totalPhotos, style, setPhotoIsLoading, onPrevPhotoClick, onNextPhotoClick}) {

    // Change button style depending on the total number of photos.
    const button_style = totalPhotos === 0 ? styles.photo_button_disabled : styles.photo_button;

    return (
    <div className={styles.image_container} style={style}>
        <p id={styles.total_properties}>{currentPhoto}/{totalPhotos}</p>
        <button className={button_style} id={styles.prev_button} type="button" onClick={(e) => onPrevPhotoClick(e)}>{'<'}</button>
        <button className={button_style} id={styles.next_button} type="button" onClick={(e) => onNextPhotoClick(e)}>{'>'}</button>
        <img src={photo} onLoad={setPhotoIsLoading ? () => setPhotoIsLoading(false) : null}></img>
    </div>
    )
}