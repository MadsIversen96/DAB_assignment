async function rentVehicle(id){
    const response = await fetch(`/vehicles/rent/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
        alert(result.message);
        return;
    }
    window.location.reload()
}

async function cancelRental(id){
    try {
        const response = await fetch(`/vehicles/cancelRent/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
  
        if (!response.ok) {
            alert(result.message);
            return;
        }
        window.location.reload()
    }catch(error){
        console.error('Error canceling rental:', error);
        alert('An error occurred while trying to cancel rental.'); 
    }
}

async function updateColour(id){
    let newColour = prompt("Update colour")
    const response = await fetch(`/colours/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: newColour})
    })

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
        alert(result.message);
        return;
    }
    window.location.reload()
}

async function deleteColour(id){
    try {
        const response = await fetch(`/colours/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
  
        if (!response.ok) {
            alert(result.message);
            return;
        }
        window.location.reload()
    }catch(error){
        console.error('Error deleting colour:', error);
        alert('An error occurred while trying to delete the colour.'); 
    }
}

async function updateType(id){
    newType = prompt("Update type")
    const response = await fetch(`/types/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: newType})
    })

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
        alert(result.message);
        return;
    }
    window.location.reload()
}

async function deleteType(id){
    try {
        const response = await fetch(`/types/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
        return;
        }
        window.location.reload()
    }catch(error){
        console.error('Error deleting colour:', error);
        alert('An error occurred while trying to delete the types.'); 
    }
}

function sqlQuery1() {
    fetch('/vehicles/popularTypes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Response was not ok');
            }
            return response.text();
        })
        .then(html => {
            document.querySelector('.vehicle-list').innerHTML = html;
        })
        .catch(error => {
            console.error('Error occured trying to show vehicles ordered by popular type:', error);
        });
}

function sqlQuery2(){
    fetch('/vehicles/requireService')
    .then(response => {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        return response.text();
    })
    .then(html => {
        document.querySelector('.vehicle-list').innerHTML = html;
    })
    .catch(error => {
        console.error('Error occured trying to show all vehicles that require service:', error);
    });
}

function sqlQuery3(){
    fetch('/vehicles/cruiseControl')
    .then(response => {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        return response.text();
    })
    .then(html => {
        document.querySelector('.vehicle-list').innerHTML = html;
    })
    .catch(error => {
        console.error('Error occured trying to show all vehicles with cruise control:', error);
    });
}

function sqlQuery4(){
    fetch('/vehicles/currentlyRented')
        .then(response => {
            if (!response.ok) {
                throw new Error('Response was not ok');
            }
            return response.text();
        })
        .then(html => {
            document.querySelector('.vehicle-list').innerHTML = html;
        })
        .catch(error => {
            console.error('Error occured trying to show rented vehicles:', error);
        });
}

function allVehicles(){
    fetch('/vehicles/allVehicles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Response was not ok');
            }
            return response.text();
        })
        .then(html => {
            document.querySelector('.vehicle-list').innerHTML = html;
        })
        .catch(error => {
            console.error('Error occured trying to show all vehicles:', error);
        });
}