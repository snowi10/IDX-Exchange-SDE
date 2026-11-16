import { useState } from 'react';
import { Lightbox } from './Lightbox';
import photo_unavailable from '../../assets/photo_unavailable2.jpg';
import loading from '../../assets/loading_photo.jpg';
import styles from './PropertyImageGallery.module.css';

/**
 * The component to display photos of a property on the detail page.
 * @param {list} photos - The list of URL's of photos for a property. 
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

    function handleLoadingPhoto(target) {
        setPhotoIsLoading(photoIsLoading.map((value, index) => {
            value = index === target ? false : value;
        }));
    }

    function handlePhotoClick(e, photoNum) {
        e.preventDefault();
        e.stopPropagation();
        setCurrLightboxPhoto(photoNum);
        setLightboxState(true);
    }

    function handleOnBackgroundClick() {
        setLightboxState(false);
    }

    function handleOnPrevClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (currLightboxPhoto - 1 >= 0) {
            setCurrLightboxPhoto(currLightboxPhoto - 1);
        }
    }

    function handleOnNextClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (currLightboxPhoto + 1 < photos.length) {
            setCurrLightboxPhoto(currLightboxPhoto + 1);
        }
    }

    function handleOnLightboxPhotoClick(e, photoNum) {
        e.preventDefault();
        e.stopPropagation();
        setCurrLightboxPhoto(photoNum);
    }

    startLightboxPhoto = findLastDivisibleNum(currLightboxPhoto, maxLightboxStripPhotos);

    if (photos.length === 0) {
        return (
            <div id={styles.gallery_body}>
                <div className={styles.photo_gallery_disabled}>
                    <img className={styles.main_photo} src={photo_unavailable}></img>
                </div>
            </div>);
    }

    mainPhoto = photoIsLoading[mainPhotoNum] ? loading : photos[mainPhotoNum];

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

function findLastDivisibleNum(currNum, divisor) {
    while (currNum % divisor !== 0) {
        currNum--;
    }

    return currNum;
}