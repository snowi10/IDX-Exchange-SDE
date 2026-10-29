import styles from './PropertyFilters.module.css';

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
                        <select name="beds" id={styles.beds} className={styles.filter_input} value={filters?.beds || ''} onChange={(e) => onFilterChange(e)}>
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
                        <select name="baths" id={styles.baths} className={styles.filter_input} value={filters?.baths || ''} onChange={(e) => onFilterChange(e)}>
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