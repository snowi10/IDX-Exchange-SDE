import { useState } from 'react';
import styles from './PropertyImageGallery.module.css';
import loading_photo from '../../assets/loading_photo.jpg'; 

export function Lightbox({ photos, display, currentPhoto, maxStripPhotos, startStripPhoto, handleOnPrevClick, handleOnNextClick, handleOnBackgrounClick, handleOnPhotoClick }) {
    const [photoIsLoading, setPhotoIsLoading] = useState(new Array(photos.length).fill(true));
    let strip = [];
    let count = 0;
    let setDisplay; 

    function handleLoadingPhoto(target) {
        setPhotoIsLoading(photoIsLoading.map((value, index) => {
            value = index === target ? false : value;
        }));
    }
    
    setDisplay = display ? {} : {display: 'none'};

    const prevButtonStyle = currentPhoto === 0 ? styles.prev_button_disabled : styles.prev_button;
    const nextButtonStyle = currentPhoto === photos.length - 1 ? styles.next_button_disabled : styles.next_button;

    for (let i = startStripPhoto; i < photos.length && count < maxStripPhotos; i++) {
        let displayPhoto = photoIsLoading[i] ? loading_photo : photos[i];

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