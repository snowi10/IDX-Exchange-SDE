// Fetch properties with parameters.
export async function fetchProperties(params) {
    const property = await fetch(`/api/properties?${params}`)
    return property; 
}

// Fetch property by ID.
export async function fetchPropertyDetail(id) {
    const property = await fetch(`/api/properties/${id}`);
    return property;
}