import { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import { PropertyCard } from './components/property-card/PropertyCard';
import { PropertyFilters }  from './components/property-filters/PropertyFilters';
import { Pagination } from './components/pagination/Pagination';
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
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(0);

    // The first number and the last number of the properties in a page. 
    const firstPropertyNum = (itemsPerPage * currentPage) + 1;
    let lastPropertyNum = (currentPage + 1) * itemsPerPage;
    lastPropertyNum = lastPropertyNum > totalProperties ? totalProperties : lastPropertyNum;

    // Handle filters form submission in the PropertyFilters component.
    function handleOnSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        setFilters({ ...filters, offset: 0});
        setCurrentPage(0);
    }
    
    // TODO: Create function for not letting minPrice be greater than maxPrice
    // and maxPrice be less than minPrice.
    // Handle changing filters in the PropertyFilters component.
    function handleFilterChange(e) {
        setSubmitted(false);
        setFilters({... filters, [e.target.name]: e.target.value});
    }

    // Handle clearing filters in the PropertyFilters component.
    function handleClearFilters() {
        setSubmitted(true);
        setFilters({});
        setCurrentPage(0);
    }

    // Handle moving to the previous page.
    function handlePrevClick() {
        const prevPage = currentPage - 1;

        // Only move to the previous page if applicable.
        if (currentPage > 0) {
            setSubmitted(true);
            setCurrentPage(prevPage);
            setFilters({... filters, offset: (prevPage) * itemsPerPage})
        }
    }

    // Handle moving to the next page.
    function handleNextClick() {
        const nextPage = currentPage + 1;

        // Only move to the next page if applicable.
        if (lastPropertyNum + 1 < totalProperties) {
            setSubmitted(true);
            setCurrentPage(nextPage);
            setFilters({... filters, offset: (nextPage) * itemsPerPage})
       }
    }

    // Fetch default properties when first loading the page.
    useEffect(() => {
        const fetchDefaultProperties = async () => {
            try {
                let filtersString = filtersToString(filters);
                let response = await fetchProperties(filtersString);
                let defaultLimit = createPropertyCards(response, setProperties, setTotalProperties, setCurrentPage);
                setItemsPerPage(defaultLimit);
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
                    createPropertyCards(response, setProperties, setTotalProperties, setCurrentPage);

                    if (filters?.limit) {
                        setItemsPerPage(filters.limit);
                    }
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
                <div>Loading...</div>
            </>
        )
    }

    // UI for no properties found.
    if (totalProperties === 0) {
        return (
            <>
                <PropertyFilters onSubmit={handleOnSubmit} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} filters={filters}/>
                <div id={styles.showing}>Showing {totalProperties} out of {totalProperties} properties</div>
                <div>No properties found.</div>
            </>
        )
    }
    

    // UI for properties list.
    return (
        <>
            <PropertyFilters onSubmit={handleOnSubmit} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} filters={filters}/>
            <div id={styles.showing}>Showing {firstPropertyNum}-{lastPropertyNum} out of {totalProperties} properties</div>
            <div className={styles.property_grid}>{properties}</div>
            <Pagination onPrevClick={handlePrevClick} onNextClick={handleNextClick} currentPage={currentPage} itemsPerPage={itemsPerPage} firstPropertyNum={firstPropertyNum} lastPropertyNum={lastPropertyNum} totalProperties={totalProperties}/> 
        </>
    )    
}

/**
 * Create PropertyCard components for each property in the JSON response.
 * @param {json} response - The JSON response of the list of properties. 
 * @param {function} setProperties - Handle setting the list of PropertyCard components.
 * @param {function} setTotalProperties - Handle setting the total number of properties from the JSON response.
 * @return the number of property cards created.
 */
function createPropertyCards(propertyData, setProperties, setTotalProperties) {
    let updatedProperties = [];

    // Create PropertyCard components for each property.
    for (let i = 0; i < propertyData.results.length; i++) {
        const result = propertyData.results[i];
        const photo = result.L_Photos ? JSON.parse(result.L_Photos)[0] : 'Photo Unavailable';
        const price = result.L_SystemPrice ? parseInt(result.L_SystemPrice) : 'N/A';
        const address = result.L_Address;
        const city = result.L_City;
        const zip = result.L_Zip;
        const state = result.L_State;
        const beds = result.L_Keyword2? parseInt(result.L_Keyword2) : 'N/A';
        const baths = result.LM_Dec_3 ? parseInt(result.LM_Dec_3) : 'N/A';
        const sqft = result.LM_Int2_3 ? parseInt(result.LM_Int2_3) : 'N/A';

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

    return updatedProperties.length;
}

/**
 * Convert the object of filters into an HTTP parameters request.
 * @param {object} filters - Keys representing the names of the filters and their values. 
 * @returns the string of filters converted to an HTTP parameters request.
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