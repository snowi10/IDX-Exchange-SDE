import { useState } from 'react';
import photo_unavailable from '../../assets/photo_unavailable2.jpg';
import loading from '../../assets/loading_photo.jpg';
import styles from './PropertyImageGallery.module.css';

export function PropertyImageGallery({ photos }) {
    const [photoIsLoading, setPhotoIsLoading] = useState([true, true, true, true, true, true, true]);

    function handleLoadingPhoto(target) {
        setPhotoIsLoading(photoIsLoading.map((value, index) => {
            value = index === target ? false : value;
        }));
    }

    let mainPhoto = '';
    let photoStrip = [];

    if (photos.length === 0) {
        return <div className={styles.photo_gallery}><img className={styles.main_photo} src={photo_unavailable}></img></div>;
    }

    mainPhoto = photoIsLoading[0] ? loading : photos[0];

    if (photos.length === 1) {
        return <div className={styles.photo_gallery}><img className={styles.main_photo} src={mainPhoto} onLoad={() => setPhotoIsLoading(photoIsLoading[0] = false)}></img></div>; 
    }
    for (let i = 1; i < photos.length && i < 7; i++) {
        let displayPhoto = photoIsLoading[i] ? loading : photos[i];
        photoStrip.push(<div key={i}><img src={displayPhoto} onLoad={() => handleLoadingPhoto(i)}></img></div>);
    }

    return (
        <div className={styles.photo_gallery}>
            <div>
                <img className={styles.main_photo} src={mainPhoto} onLoad={() => handleLoadingPhoto(0)}></img>
            </div>
            <div id={styles.photo_strip}>
                {photoStrip}
            </div>
        </div>
    )
}