import styles from './PropertyCard.module.css';

export function PropertyImageCarousel({photo, currentPhoto, totalPhotos, style, setPhotoIsLoading, onPrevPhotoClick, onNextPhotoClick}) {

    return (
    <div className={styles.image_container} style={style}>
        <p id={styles.total_properties}>{currentPhoto}/{totalPhotos}</p>
        <button id={styles.prev_button} type="button" onClick={(e) => onPrevPhotoClick(e)}>Prev</button>
        <button id={styles.next_button} type="button" onClick={(e) => onNextPhotoClick(e)}>Next</button>
        <img src={photo} onLoad={setPhotoIsLoading ? () => setPhotoIsLoading(false) : null}></img>
    </div>
    )
}