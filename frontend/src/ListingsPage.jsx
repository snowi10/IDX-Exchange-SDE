import { useState, useEffect, useMemo} from 'react';
import { fetchProperties } from './api/client';
import styles from './ListingsPage.module.css';
import photo_unavailable from './assets/photo_unavailable.jpg';
import loading_photo from './assets/loading_photo.jpg';

/**
 * The main property listings page.
 */
export default function ListingsPage() {

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null); 

    const [properties, setProperties] = useState([])
    const [totalProperties, setTotalProperties] = useState(0);

    const [submitted, setSubmitted] = useState(false);

    const [filters, setFilters] = useState({});
    const [filtersHistory, setFiltersHistory] = useState({});

    function handleOnSubmit(e) {
        e.preventDefault();
        setFiltersHistory(filters);
        setSubmitted(true);
    }
    
    function handleFilterChange(e) {
        setSubmitted(false);
        setFilters({... filters, [e.target.name]: e.target.value});
    }

    function handleClearFilters() {
        setSubmitted(false);
        setFilters({});
        setFiltersHistory({});
    }

    useEffect(() => {

        const callFetchProperties = async () => {
            try {
                let response;
                let filtersString;

                console.log(filters);
                console.log(filtersHistory);

                // API call to backend to fetch properties.
                if (submitted) {
                    setLoading(true);

                    // Fetch properties with new filters when requested by user.
                    filtersString = filtersToString(filters);
                    response = await fetchProperties(filtersString);
                }
                else {

                    // Fetch properties with previous filters to keep properties' state.
                    filtersString = filtersToString(filtersHistory);
                    response = await fetchProperties(filtersString);
                }

                // Handle errors from JSON response.
                if (response.status !== 200) {
                    const json = await response.json();
                    setErrorMessage(`${json.status}, 
                        ${json.error}`);
                }
                else {

                    const json = await response.json();
                    let updatedProperties = [];

                    // Create PropertyCard components for each property.
                    for (let i = 0; i < json.results.length; i++) {

                        const result = json.results[i];
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
                    setTotalProperties(json.total);
                }

            }
            catch (error) {
                setErrorMessage(error.message);
            }
            finally {
                setLoading(false); // No longer loading after properties have been fetched.
            }
        }

        // setTimeout to verify loading screen. 
        //setTimeout(callFetchProperties, 1000);

        callFetchProperties(); // Fetch properties.

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
                <PropertyFilter onSubmit={handleOnSubmit} onFilterChange={handleFilterChange} filters={filters}/>
                <div id={styles.showing}>Showing {properties.length} out of {totalProperties} properties</div>
                <div>Loading...</div>
            </>
        )
    }

    // UI for no properties found.
    if (totalProperties === 0) {
        return (
            <>
                <PropertyFilter onSubmit={handleOnSubmit} onFilterChange={handleFilterChange} filters={filters}/>
                <div id={styles.showing}>Showing {properties.length} out of {totalProperties} properties</div>
                <div>No properties found.</div>
            </>
        )
    }

    // UI for properties list.
    return (
        <>
            <PropertyFilter onSubmit={handleOnSubmit} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} filters={filters}/>
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
function PropertyFilter({ onSubmit, onFilterChange, onClearFilters, filters }) {

    return (
        <div className={styles.filter_container}>
            <form onSubmit={(e) => onSubmit(e)}>
                <div className={styles.filter_grid}>
                    <div>
                        <label htmlFor="city">City</label><br></br>
                        <input name="city" id={styles.city} className={styles.filter_input} type="text" value={filters.city || ''} onChange={(e) => onFilterChange(e)}></input>            
                    </div>

                    <div>
                        <label htmlFor="zip">Zip</label><br></br>                   
                        <input name="zip" id={styles.zip} className={styles.filter_input} type="text" value={filters.zip || ''} onChange={(e) => onFilterChange(e)}></input>
                    </div>                                                        
                                                                                
                    <div>
                        <label htmlFor="minPrice">Min Price</label><br></br>             
                        <input name="minPrice" id={styles.min_price} className={styles.filter_input} type="number" min="0" value={filters.minPrice || ''} onChange={(e) => onFilterChange(e)}></input>
                    </div>
            
                    <div>
                        <label htmlFor="maxPrice">Max Price</label><br></br>               
                        <input name="maxPrice" id={styles.max_price} className={styles.filter_input} type="number" min="0" value={filters.maxPrice || ''} onChange={(e) => onFilterChange(e)}></input>
                    </div>
                <div className={styles.bed_baths_grid}>
                    <div>
                        <label htmlFor="beds">Beds</label><br></br>            
                        <select name="beds" id={styles.beds} className={styles.filter_input} value={filters.beds} onChange={(e) => onFilterChange(e)}>
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
                        <select name="baths" id={styles.baths} className={styles.filter_input} value={filters.baths} onChange={(e) => onFilterChange(e)}>
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