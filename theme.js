const buttonTheme = document.querySelector("#theme");
const body = document.querySelector("body");

let dark = true;

buttonTheme.addEventListener("click",()=>{
	if(dark){
		body.style.backgroundColor = "wheat";
		buttonTheme.className = "fa-solid fa-moon"
		dark = false;
	}else{
		body.style.backgroundColor = "#212531";
		buttonTheme.className = "fa-solid fa-sun"
		dark = true;
	}
})
