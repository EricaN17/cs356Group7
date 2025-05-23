
const API_BASE_URL = '../services/ExperimentsService'
export async function createExperiment(body){
    const response = await fetch(`${API_BASE_URL}/get`,{
        method:'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body:JSON.stringify(body),

    });
}

export async function updateExperiment(body){
    const response = await fetch(`${API_BASE_URL}/get`,{
        method:'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body:JSON.stringify(body),
    });
    return response.json()
}

export async function readExperiment(body){
    const response = await fetch(`${API_BASE_URL}/get`,{
        method:'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body:JSON.stringify(body),
    });
    return response.json()

}

export async function deleteExperiment(body){
    const response = await fetch(`${API_BASE_URL}/get`,{
        method:'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body:JSON.stringify(body),
    });
    return response.json()
}