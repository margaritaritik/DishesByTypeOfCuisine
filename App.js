const API_FOOD_TEST = "https://api.edamam.com/search?app_id=900da95e&app_key=40698503668e0bb3897581f4766d77f9";
const spin = document.querySelector(".col-sm-2");
let cuisines = new Set();

const getObj = async (url) => {
    const response = await fetch(url);
    return await response.json()
}

async function ButtonClick() {
    spin.style.display = "block";
    cuisines.clear();
    let text = document.getElementsByTagName("input")[0];
    let val = text.value;
    let resp = await getObj(`${API_FOOD_TEST}&q=${val}`);

    if ( document.querySelector("#format").childElementCount !== 0) {
        let selectOptions = document.getElementById('format');
        let i, L = selectOptions.options.length - 1;
        for(i = L; i > 0; i--) {
            selectOptions.remove(i);
        }
    }
    showFood(resp);
}

let input = document.getElementById("textforwrite");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        ButtonClick().then();
    }
});

function showFood(data) {
    const foodsEl = document.querySelector(".foods");
    let objSel = document.getElementById("format");
    objSel.options = [];
    if (foodsEl.childElementCount !== 0) {
        let test = document.querySelectorAll('.food');
        test.forEach(function (elem) {
            elem.parentNode.removeChild(elem);
        });
    }
    data.hits.forEach(food => {
        const foodEl = document.createElement("div");
        foodEl.classList.add("food");
        foodEl.innerHTML = `
            <div class="food_cover-inner">       
                <img src="${food.recipe.image}" class="food_cover"/>
                
                <div class="food_info">
                    <div class="food_name">${food.recipe.label}</div>
                    <div class="food_cuisineType">${food.recipe.cuisineType}</div>
                </div>
            </div>`
        ;
        foodsEl.appendChild(foodEl);
        cuisines.add(food.recipe.cuisineType[0]);
        spin.style.display = "none";
    });
    for (let item of cuisines) {
        objSel.options[objSel.options.length] = new Option(`${item}`, `${item}`);
    }
    objSel.addEventListener('change', async () => {
        spin.style.display = "block";
        const option = objSel.options[objSel.selectedIndex];
        const query = document.getElementById("textforwrite").value;
        let resp = await getObj(`https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=900da95e&app_key=40698503668e0bb3897581f4766d77f9&cuisineType=${option.value}`);
        showFood(resp);
    });
}



