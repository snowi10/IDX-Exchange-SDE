import { useState } from 'react';
import styles from './Lightbox.module.css';
import loading_photo from '../../../assets/loading_photo.jpg'; 

/**
 * The component for displaying all photos of a property in a lightbox.
 * @param {array} photos - The list of URLs of photos for a property. 
 * @param {boolean} display - Specifies whether to display the Lightbox component or not.
 * @param {number} currentPhoto - The number of the current photo being shown in the lightbox.  
 * @param {number} maxStripPhotos - The maximum number of photos that can be displayed in the bottom strip of the lightbox.
 * @param {number} startStripPhoto - The number of the photo that begins the bottom strip of the lightbox.
 * @param {function} handleOnPrevClick - To handle clicking to the previous photo.
 * @param {function} handleOnNextClick - To handle clicking to the next photo.
 * @param {function} handleOnBackgroundClick - To handle clicking on the background of the lightbox (exiting).
 * @param {function} handleOnPhotoClick - To handle clicking on the photos of the lightbox.
 */
export function Lightbox({ photos, display, currentPhoto, maxStripPhotos, startStripPhoto, handleOnPrevClick, handleOnNextClick, handleOnBackgrounClick, handleOnPhotoClick }) {
    const [photoIsLoading, setPhotoIsLoading] = useState(new Array(photos.length).fill(true));
    let strip = [];
    let count = 0;
    let setDisplay; 

    // To handle any photos that are still loading.
    function handleLoadingPhoto(target) {
        setPhotoIsLoading(photoIsLoading.map((value, index) => {
            value = index === target ? false : value;
        }));
    }
    
    // Specify whether to display the lightbox or not.
    setDisplay = display ? {} : {display: 'none'};

    // Disable the previous and next buttons if there are no more photos to see.
    const prevButtonStyle = currentPhoto === 0 ? styles.prev_button_disabled : styles.prev_button;
    const nextButtonStyle = currentPhoto === photos.length - 1 ? styles.next_button_disabled : styles.next_button;

    // Create the bottom strip of the lightbox.
    for (let i = startStripPhoto; i < photos.length && count < maxStripPhotos; i++) {
        // Show loading image if the photo is still loading. 
        let displayPhoto = photoIsLoading[i] ? loading_photo : photos[i];

        // Dim the image in the bottom strip of the lightbox if it is the current photo being shown.
        if (i === currentPhoto) {
            strip.push(<div className={styles.strip_column} key={i}><img src={displayPhoto} style={{filter: 'brightness(50%)'}} onClick={(e) => handleOnPhotoClick(e, i)} onLoad={() => handleLoadingPhoto(i)}></img></div>)
        }
        else {
            strip.push(<div className={styles.strip_column} key={i}><img src={displayPhoto} onClick={(e) => handleOnPhotoClick(e, i)} onLoad={() => handleLoadingPhoto(i)}></img></div>)
        }

        count++;
    }

    return (
        <div id={styles.lightbox} style={setDisplay} onClick={() => handleOnBackgrounClick()}>
            <div id={styles.current_photo}>
                <img src={photos[currentPhoto]}></img>
            </div>
            <button id={prevButtonStyle} type="button" onClick={(e) => handleOnPrevClick(e)}>{'<'}</button>
            <button id={nextButtonStyle} type="button" onClick={(e) => handleOnNextClick(e)}>{'>'}</button>
            <div id={styles.lightbox_strip}>
                {strip}
            </div>
        </div>
    )
}