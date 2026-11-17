import styles from './PropertyMap.module.css';

export function PropertyMap({ latitude, longitude }) {
    return (
    <div> 
        <iframe width="80%" height="600px" src={`https://www.google.com/maps/embed/v1/place?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}`}></iframe>
    </div>);
}