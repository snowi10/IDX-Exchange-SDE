import { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import { PropertyCard } from './components/property-card/PropertyCard';
import { PropertyFilters }  from './components/property-filters/PropertyFilters';
import styles from './ListingsPage.module.css';

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
                await createPropertyCards(response, setProperties, setTotalProperties);
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
                    await createPropertyCards(response, setProperties, setTotalProperties);
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
 * Create PropertyCard components for each property in the JSON response.
 * @param {json} response - The JSON response of the list of properties. 
 * @param {function} setProperties - Handle setting the list of PropertyCard components.
 * @param {function} setTotalProperties - Handle setting the total number of properties from the JSON response.
 */
async function createPropertyCards(propertyData, setProperties, setTotalProperties) {
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