// Fetch properties with parameters.
export async function fetchProperties(params) {
        const response = await fetch(`/api/properties?${params}`)

        if (response.status !== 200) {
            throw new Error(`Failed to fetch properties. \nStatus: ${response.status}.`)
        }

        return await response.json(); 
}

/*
// Fetch property by ID.
export async function fetchPropertyDetail(id) {
    const property = await fetch(`/api/properties/${id}`);


    return property;
}
*/