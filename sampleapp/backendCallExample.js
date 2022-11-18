async function getClasses(type_list=null, department_list=null, min_units=null, max_units=null, classes_taken=null){
	const requestBody = {
        "type_list": type_list,
        "department_list": department_list,
        "min_units": min_units,
        "max_units": max_units,
        "classes_taken": classes_taken
    }
    const response = await fetch("http://127.0.0.1:8000/api/getClasses", {
		crossDomain:true,
		mode: 'cors',
		method: 'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify(requestBody)
	});
	const responseJson = await response.json();
	return responseJson;
}
console.log(await getClasses(type_list=["req-cs"], department_list=["COM SCI"], min_units=2, max_units=4, classes_taken=null));