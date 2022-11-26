async function sendRequest(apiName, requestBody){
    const response = await fetch("http://127.0.0.1:8000/api/" + apiName, {
		crossDomain:true,
		mode: 'cors',
		method: 'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify(requestBody)
	});
	const responseJson = await response.json();
	return responseJson;
}

async function getClasses(type_list=null, department_list=null, min_units=null, max_units=null, classes_taken=null){
	const requestBody = {
        "type_list": type_list,
        "department_list": department_list,
        "min_units": min_units,
        "max_units": max_units,
        "classes_taken": classes_taken
    }
	return await sendRequest("getClasses", requestBody);
}

async function addUser(id=null){
	const requestBody = {
        "id": id
    }
	return sendRequest("addUser", requestBody);
}

console.log(await getClasses(type_list=["req-cs"], department_list=["COM SCI"], min_units=2, max_units=4, classes_taken=null));
console.log(await addUser(id="testid"))