/**
 * Create the full address of a property based on the address, city, state, and zip code.
 * @param {string} address - The address of the property. 
 * @param {string} city  - The city of the property.
 * @param {string} state - The state of the property.
 * @param {string} zip - The zip code of the property. 
 * @returns a string of the full address of a property.
 */
export function createFullAddress(address, city, state, zip) {
    let fullAddressBuilder = [];

    // Address.
    if (address) {
        fullAddressBuilder.push(address);
    }

    // City.
    if (city && address) {
        fullAddressBuilder.push(`, ${city}`);
    }
    else if (city) {
        fullAddressBuilder.push(city);
    }

    // State.
    if (state && (address || city)) {
        fullAddressBuilder.push(`, ${state}`);
    }
    else if (state) {
        fullAddressBuilder.push(state);
    }

    // Zip code.
    if (zip && parseInt(zip) !== 0) {
        if (state) {
            fullAddressBuilder.push(` ${zip}`);
        }
        else if (address || city) {
            fullAddressBuilder.push(`, ${zip}`);
        }
        else  {
            fullAddressBuilder.push(zip);
        }
    }

    const fullAddress = fullAddressBuilder? fullAddressBuilder.join('') : ''; 

    return fullAddress;
}