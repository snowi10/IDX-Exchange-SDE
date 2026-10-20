export async function fetchProperties(params) {
    const property = await fetch(`/api/properties?${params}`)
    return property; 
}

export async function fetchPropertyDetail(id) {
    const property = await fetch(`/api/properties/${id}`);
    return property;
}