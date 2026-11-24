import styles from './PropertyMap.module.css';

/** 
 * The component for displaying the property on Google Maps.  
 * @param {number} latitude - The latitude of the property.
 * @param {number} longitude - The longitude of the property.
 */ 
export function PropertyMap({ latitude, longitude }) {
    // TODO: Make frame more dynamic.
    return (
    <div> 
        <iframe width="80%" height="700px" src={`https://www.google.com/maps/embed/v1/place?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}`}></iframe>
    </div>);
}