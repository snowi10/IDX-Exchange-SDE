import { useState } from 'react';
import { Lightbox } from '../lightbox/Lightbox';
import photo_unavailable from '../../../assets/photo_unavailable2.jpg';
import loading from '../../../assets/loading_photo.jpg';
import styles from './PropertyImageGallery.module.css';

/**
 * The component to display photos of a property on the detail page.
 * @param {array} photos - The list of URLs of photos of a property. 
 */
export function PropertyImageGallery({ photos }) {
    const maxGalleryPhotos = 7;
    const mainPhotoNum = 0;
    const maxLightboxStripPhotos = 4;
    const [photoIsLoading, setPhotoIsLoading] = useState(new Array(maxGalleryPhotos).fill(true));
    const [currLightboxPhoto, setCurrLightboxPhoto] = useState(0);
    const [lightboxState, setLightboxState] = useState(false);
    let mainPhoto = '';
    let photoStrip = [];
    let startLightboxPhoto;

    // To handle photos that are loading.
    function handleLoadingPhoto(target) {
        setPhotoIsLoading(photoIsLoading.map((value, index) => {
            value = index === target ? false : value;
        }));
    }

    // To handle clicking on a photo in the gallery.
    function handlePhotoClick(e, photoNum) {
        e.preventDefault();
        e.stopPropagation();
        setCurrLightboxPhoto(photoNum);
        setLightboxState(true);
    }

    // To handle exiting the lightbox.
    function handleOnBackgroundClick() {
        setLightboxState(false);
    }

    // To handle clicking to the previous photo.
    function handleOnPrevClick(e) {
        e.preventDefault();
        e.stopPropagation();

        // Only move to the previous photo if applicable.
        if (currLightboxPhoto - 1 >= 0) {
            setCurrLightboxPhoto(currLightboxPhoto - 1);
        }
    }

    // To handle clicking to the next photo.
    function handleOnNextClick(e) {
        e.preventDefault();
        e.stopPropagation();

        // Only move to the next photo if applicable.
        if (currLightboxPhoto + 1 < photos.length) {
            setCurrLightboxPhoto(currLightboxPhoto + 1);
        }
    }

    // To handle clicking on a photo in the lightbox.
    function handleOnLightboxPhotoClick(e, photoNum) {
        e.preventDefault();
        e.stopPropagation();
        setCurrLightboxPhoto(photoNum);
    }

    // The photo that will begin the lightbox strip. 
    startLightboxPhoto = findLastDivisibleNum(currLightboxPhoto, maxLightboxStripPhotos);

    // Show photo unavailable for a property with no photos.
    if (photos.length === 0) {
        return (
            <div id={styles.gallery_body}>
                <div className={styles.photo_gallery_disabled}>
                    <img className={styles.main_photo} src={photo_unavailable}></img>
                </div>
            </div>);
    }

    // Replace the main photo if it is still loading.
    mainPhoto = photoIsLoading[mainPhotoNum] ? loading : photos[mainPhotoNum];

    // Only show the main photo for a property with only one photo.
    if (photos.length === 1) {
        return (
            <>
                <div id={styles.gallery_body} onClick={() => handleOutsideClick()}>
                    <div className={styles.photo_gallery}>
                        <img className={styles.main_photo} src={mainPhoto} onClick={(e) => handlePhotoClick(e, mainPhotoNum)} onLoad={() => handleLoadingPhoto()}></img>
                    </div> 
                </div>
                <Lightbox photos={photos} display={lightboxState} currentPhoto={currLightboxPhoto} maxStripPhotos={maxLightboxStripPhotos} startStripPhoto={startLightboxPhoto} handleOnPrevClick={handleOnPrevClick} handleOnNextClick={handleOnNextClick} handleOnBackgrounClick={handleOnBackgroundClick} handleOnPhotoClick={handleOnLightboxPhotoClick} />
            </>);
    }

    // Create the gallery strip of photos.
    for (let i = mainPhotoNum + 1; i < photos.length && i < maxGalleryPhotos; i++) {
        let displayPhoto = photoIsLoading[i] ? loading : photos[i];
        photoStrip.push(<div key={i}><img src={displayPhoto} onClick={(e) => handlePhotoClick(e, i)} onLoad={() => handleLoadingPhoto(i)}></img></div>);
    }

    return (
        <>
            <div id={styles.gallery_body}>
                <div className={styles.photo_gallery}>
                    <div>
                        <img className={styles.main_photo} src={mainPhoto} onClick={(e) => handlePhotoClick(e, mainPhotoNum)} onLoad={() => handleLoadingPhoto(0)}></img>
                    </div>
                    <div id={styles.gallery_strip}>
                        {photoStrip}
                    </div>
                </div>
            </div>
            <Lightbox photos={photos} display={lightboxState} currentPhoto={currLightboxPhoto} maxStripPhotos={maxLightboxStripPhotos} startStripPhoto={startLightboxPhoto} handleOnPrevClick={handleOnPrevClick} handleOnNextClick={handleOnNextClick} handleOnBackgrounClick={handleOnBackgroundClick} handleOnPhotoClick={handleOnLightboxPhotoClick} />
        </>)
}

/**
 * Find the last divisible number given the dividend and the divisor. 
 * @param {number} currNum - The number being divided (dividend).
 * @param {number} divisor - The number that is dividing (divisor).
 * @return a number that is divisible by the divisor.
 */
function findLastDivisibleNum(currNum, divisor) {
    // Go to the previous number while the current number is not divisible by the divisor.
    while (currNum % divisor !== 0) {
        currNum--;
    }

    return currNum;
}