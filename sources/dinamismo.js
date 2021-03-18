let index = 0;

//Funciones para el manejo del fondo de la cabecera
function images(){
	const imagesList = [
	"sources/imgs/Php.png",
	"sources/imgs/Mysql.png",
	"sources/imgs/SlimFramework.png",
	"sources/imgs/AngularJS.png"
	]

	return imagesList;
}

function headerBackground(){
	const imagesList = images();
	const header = document.getElementById("header");

	index = ( index >= imagesList.length ) ? 0 : index;
	header.style.backgroundImage = `url("${imagesList[index]}")`;
	index++;
}
/////

//Carga de proyectos
function projects(){
	const ajax = new Ajax();

	ajax.ready = (status,statusText,response) => {
		const data = JSON.parse(response);
		const projects = document.getElementById("projects");

		//Genero las cajas con los datos proporcionados por el archivos json
		data.forEach( (objeto) => {
			let container = document.createElement("div");
			let _class = objeto.lenguaje; 
			container.setAttribute("class",`col mb-3 mb-md-0 d-block ${_class}`);

			let containerFluid = document.createElement("div");
			containerFluid.setAttribute("class","oxford p-2 border rounded shadow-lg");

			let img = document.createElement("img");
			img.setAttribute("class","img-fluid");
			img.setAttribute("src",objeto.imagen);

			let info = document.createElement("div");
			info.setAttribute("class","mt-2 p-md-2");

			let content = `
			<h4>${objeto.titulo}</h4>
			<span class="h5">Frameworks: </span>
			<strong> ${objeto.frameworks} </strong><br>
			<span class="h5">Languages:</span>
			<strong> ${objeto.lenguajes}</strong><br>
			<span class="h5">Link:</span> 
			<a href="${objeto.url}" class="text-decoration-none" target="_blank">Click here</a><br>
			<span class="monospace">${objeto.observacion}</span>
			`;

			info.innerHTML = content;
			containerFluid.appendChild(img);
			containerFluid.appendChild(info);
			container.appendChild(containerFluid);
			projects.appendChild(container);
		});
	}
	
	ajax.request("POST","sources/projects.json","text");
}
////

//Funcion para el filtrado de proyectos
function filtering( language = "All" ){
	const projects = document.getElementById("projects");

	for(let i=0;i < projects.childElementCount;++i){
		let tmp = "";

		if( language !== "All" ){
			if(!projects.childNodes[i].getAttribute("class").includes(language) && !projects.childNodes[i].getAttribute("class").includes("d-none")){
				tmp = projects.childNodes[i].getAttribute("class").replace("d-block","d-none");
				projects.childNodes[i].setAttribute("class",tmp);
			}

			if(projects.childNodes[i].getAttribute("class").includes(language) && projects.childNodes[i].getAttribute("class").includes("d-none")){
				tmp = projects.childNodes[i].getAttribute("class").replace("d-none","d-block");
				projects.childNodes[i].setAttribute("class",tmp);
			}
		}
		else {
			tmp = projects.childNodes[i].getAttribute("class").replace("d-none","d-block");
			projects.childNodes[i].setAttribute("class",tmp);
		}
	}
}

function main(){
	projects();
	setInterval("headerBackground()",7000);
}
window.addEventListener("load",main,false);