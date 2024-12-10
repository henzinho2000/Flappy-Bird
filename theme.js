const button = document.querySelector("#button");
const body = document.querySelector("body");

let dark = true;

button.addEventListener("click",()=>{
	if(dark){
		body.style.backgroundColor = "wheat";
		body.style.color = "#212531";
		dark = false;
	}else{
		body.style.backgroundColor = "#212531";
		body.style.color = "white";
		dark = true;
	}
})