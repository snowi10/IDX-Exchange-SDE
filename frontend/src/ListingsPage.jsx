import { useState, useEffect, useMemo} from 'react';
import { fetchProperties } from './api/client';
import styles from './ListingsPage.module.css';
import photo_unavailable from './assets/photo_unavailable.jpg';
import loading_photo from './assets/loading_photo.jpg';

/**
 * The component for the main property listings page.
 */
export default function ListingsPage() {
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null); 
    const [properties, setProperties] = useState([])
    const [totalProperties, setTotalProperties] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState({});

    // Handle filters form submission in the PropertyFilters component.
    function handleOnSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
    }
    
    // Handle changing filters in the PropertyFilters component.
    function handleFilterChange(e) {
        setSubmitted(false);
        setFilters({... filters, [e.target.name]: e.target.value});
    }

    // Handle clearing filters in the PropertyFilters component.
    function handleClearFilters() {
        setSubmitted(true);
        setFilters({});
        setFiltersHistory({});
    }

    // Fetch default properties when first loading the page.
    useEffect(() => {
        const fetchDefaultProperties = async () => {
            try {
                let response = await fetchProperties('');
                await createPropertyCards(response, setErrorMessage, setProperties, setTotalProperties);
            }
            catch (error) {
                setErrorMessage(error.message);
            }
            finally {
                setLoading(false);
            }
        }

        fetchDefaultProperties();

    }, []);

    // Fetch filtered properties when users submit a request.
    useEffect(() => {
        const fetchFilteredProperties = async () => {
            try {
                if (submitted) {
                    setLoading(true);
                    let filtersString = filtersToString(filters);
                    let response = await fetchProperties(filtersString);
                    await createPropertyCards(response, setErrorMessage, setProperties, setTotalProperties);
                }
            }
            catch (error) {
                setErrorMessage(error.message);
            }
            finally {
                setSubmitted(false);
                setLoading(false); 
            }
        }

        fetchFilteredProperties(); 

    }, [submitted]);

    // TODO: Create better UI for error message.
    // UI for error messages.
    if (errorMessage) {
        return <div>{errorMessage}</div>
    }

    // TODO: Create better UI for loading screen.
    // UI for API call that is still loading. 
    if (loading) {
        return (
            <>
                <PropertyFilters onSubmit={handleOnSubmit} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} filters={filters}/>
                <div id={styles.showing}>Showing {properties.length} out of {totalProperties} properties</div>
                <div>Loading...</div>
            </>
        )
    }

    // UI for no properties found.
    if (totalProperties === 0) {
        return (
            <>
                <PropertyFilters onSubmit={handleOnSubmit} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} filters={filters}/>
                <div id={styles.showing}>Showing {properties.length} out of {totalProperties} properties</div>
                <div>No properties found.</div>
            </>
        )
    }

    // UI for properties list.
    return (
        <>
            <PropertyFilters onSubmit={handleOnSubmit} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} filters={filters}/>
            <div id={styles.showing}>Showing {properties.length} out of {totalProperties} properties</div>
            <div className={styles.property_grid}>{properties}</div>
        </>
    )    
}

/**
 * The component to display a property. 
 * @param {string} photo - The first photo URL of the property.
 * @param {number} price - The listing price of the property.
 * @param {string} address - The address line of the property.
 * @param {string} zip - The zip code of the property.
 * @param {string} city - The city of the property.
 * @param {string} state - The state of the property.
 * @param {number} beds - The number of beds that the property has.
 * @param {number} beds - The number of baths that the property has.
 */
function PropertyCard({ photo, price, address, zip, city, state, beds, baths, sqft }) {
    const [photoIsLoading, setPhotoIsLoading] = useState(true);

    // Replace properties with no photos.
    photo = photo === 'Photo Unavailable' ? photo_unavailable : photo;

    // Set placeholder cards for photos that are still loading.
    const actual = photoIsLoading ? {display: "none"} : {display : "block"};
    const placeholder = photoIsLoading ? {display: "block"} : {display: "none"};

    // TODO: Handle empty strings in the description container.
    // TODO: Add commas to prices.
    return (
        <div className={styles.property_card} >
            <div className={styles.image_container} style={actual}>
                <img src={photo} onLoad={() => setPhotoIsLoading(false)}></img>
            </div>   
            <div className={styles.image_container} style={placeholder}>
                <img src={loading_photo}></img>
            </div>
            <div className={styles.description_container}>
                <p id={styles.price}>${price}</p>
                <p><b>Beds</b>: {beds} | <b>Baths</b>: {baths} | <b>Square Feet</b>: {sqft}</p>
                <p id={styles.address}>{address}, {city}, {state} {zip}</p>
            </div>
        </div>
    )
}

/**
 * A component to filter the list of properties. 
 * @param {function} onSubmit - To handle the submission of the filters form. 
 * @param {function} onFilterChange - To handle changes within the filters form. 
 * @param {function} onClearFilters - To handle clearing the previous filters. 
 * @param {object} filters - Keys representing the names of the filters and their values. 
 */
export function PropertyFilters({ onSubmit, onFilterChange, onClearFilters, filters }) {

    return (
        <div className={styles.filter_container}>
            <form onSubmit={(e) => onSubmit(e)}>
                <div className={styles.filter_grid}>
                    <div>
                        <label htmlFor="city">City</label><br></br>
                        <input name="city" id={styles.city} data-testid="city" className={styles.filter_input} type="text" value={filters?.city || ''} onChange={(e) => onFilterChange(e)}></input>            
                    </div>

                    <div>
                        <label htmlFor="zip">Zip</label><br></br>                   
                        <input name="zip" id={styles.zip} className={styles.filter_input} type="text" value={filters?.zip || ''} onChange={(e) => onFilterChange(e)}></input>
                    </div>                                                        
                                                                                
                    <div>
                        <label htmlFor="minPrice">Min Price</label><br></br>             
                        <input name="minPrice" id={styles.min_price} className={styles.filter_input} type="number" min="0" value={filters?.minPrice || ''} onChange={(e) => onFilterChange(e)}></input>
                    </div>
            
                    <div>
                        <label htmlFor="maxPrice">Max Price</label><br></br>               
                        <input name="maxPrice" id={styles.max_price} className={styles.filter_input} type="number" min="0" value={filters?.maxPrice || ''} onChange={(e) => onFilterChange(e)}></input>
                    </div>
                <div className={styles.bed_baths_grid}>
                    <div>
                        <label htmlFor="beds">Beds</label><br></br>            
                        <select name="beds" id={styles.beds} className={styles.filter_input} value={filters?.beds} onChange={(e) => onFilterChange(e)}>
                            <option value=""></option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="26">26</option>
                            <option value="32">32</option>
                            <option value="35">35</option>
                            <option value="39">39</option>
                            <option value="45">45</option>
                            <option value="52">52</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="baths">Baths</label><br></br>                  
                        <select name="baths" id={styles.baths} className={styles.filter_input} value={filters?.baths} onChange={(e) => onFilterChange(e)}>
                            <option value=""></option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="22">22</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="27">27</option>
                            <option value="32">32</option>
                            <option value="46">46</option>
                            <option value="58">58</option>
                            <option value="59">59</option>
                        </select>
                    </div>
               </div>
               </div>
                <button id={styles.filter_submit} className={styles.filter_button} type="submit">Filter</button>
                <button id={styles.filter_clear} className={styles.filter_button} type="button" onClick={() => onClearFilters()}>Clear filters</button>
            </form>
        </div>
    )
}

/**
 * Create PropertyCard components for each property in the JSON response.
 * @param {json} response - The JSON response of the list of properties. 
 * @param {function} setErrorMessage - Handle setting an error message.
 * @param {function} setProperties - Handle setting the list of PropertyCard components.
 * @param {function} setTotalProperties - Handle setting the total number of properties from the JSON response.
 */
async function createPropertyCards(propertyData, setErrorMessage, setProperties, setTotalProperties) {
    let updatedProperties = [];

    // Create PropertyCard components for each property.
    for (let i = 0; i < propertyData.results.length; i++) {
        const result = propertyData.results[i];
        const photo = result.L_Photos ? JSON.parse(result.L_Photos)[0] : 'Photo Unavailable';
        const price = result.L_SystemPrice;
        const address = result.L_Address;
        const city = result.L_City;
        const zip = result.L_Zip;
        const state = result.L_State;
        const beds = result.L_Keyword2;
        const baths = parseInt(result.LM_Dec_3);
        const sqft = result.LM_Int2_3;

        updatedProperties.push(<PropertyCard 
            key={i} 
            photo={photo} 
            price={price} 
            address={address} 
            city={city}
            zip={zip} 
            state={state} 
            beds={beds} 
            baths={baths} 
            sqft={sqft}/>)
    }

    setProperties(updatedProperties);
    setTotalProperties(propertyData.total);
}

/**
 * Convert the object of filters into an HTTP parameters request.
 * @param {object} filters - Keys representing the names of the filters and their values. 
 * @returns a string.
 */
function filtersToString(filters) {
    let filtersString = '';
    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            filtersString += `&${key}=${filters[key]}`
        }
    });

    return filtersString;
}