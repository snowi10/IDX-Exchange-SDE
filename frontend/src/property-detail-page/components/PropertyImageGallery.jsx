import { useState } from 'react';
import styles from './PropertyImageGallery.module.css';

// TODO: Replace no photos with "photo unavailable" image.
// TODO: Replace loading photos with "loading..." image.
export function PropertyImageGallery({ photos }) {
    let mainPhoto = '';
    let photoStrip = [];

    if (photos.length === 0) {
        return
    }
    if (photos.length === 1) {
        mainPhoto = photos[0];
        return <div className={styles.photo_gallery}><img className={styles.main_photo} src={mainPhoto}></img></div>; 
    }

    mainPhoto = photos[0];
    for (let i = 1; i < photos.length && i < 7; i++) {
        photoStrip.push(<div key={i}><img src={photos[i]}></img></div>);
    }

    return (
        <div className={styles.photo_gallery}>
            <div>
                <img className={styles.main_photo} src={mainPhoto}></img>
            </div>
            <div id={styles.photo_strip}>
                {photoStrip}
            </div>
        </div>
    )
}