const  itemForm = document.getElementById('item-form');
const  itemInput = document.getElementById('item-input');
const  itemList = document.getElementById('item-list');
const  itemClear = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button')
let isEditMode = false;

const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();
  
  itemsFromStorage.forEach(item => addItemToDOM(item));
  checkUI();
}

const addItem = (e) => {
    e.preventDefault();

    const newItem = itemInput.value; 


    if (newItem === '') {
        alert('Please Add An Item');
        return;
    }
    
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemsFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExist(newItem)) {
        alert('That item already exist!');
        return;
        }
    }


    // create item DOM element
    addItemToDOM(newItem);

    //add items to local storage
    addItemToStorage(newItem);
    
    checkUI();

    itemInput.value = '';

}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}


const addItemToDOM = (item) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const button = createButton("remove-item btn-link text-red");
    
    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);
}

const addItemToStorage = (item) => {
    const itemsFromStorage = getItemsFromStorage();

   
    //ADD new items
    itemsFromStorage.push(item);

    //convert to JSON string set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

const createButton = (classes) => {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}


const createIcon = (classes) => {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function OnclickItem (e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeEl(e.target.parentElement.parentElement);
    } else {
       setItemToEdit(e.target);
    }
}

const setItemToEdit = (item) => {
    isEditMode = true;
    
    itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML ='<i class="fa-solid fa-pen"></i>Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

const removeEl = (item) => {
   if (confirm('Are You Sure?')) {
    item.remove();


    //remove from storage
    removeItemsFromStorage(item.textContent);
    checkUI();
   }
}

const removeItemsFromStorage = (item) => {
    let itemsFromStorage = getItemsFromStorage();

    // filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

const clearAll = () => {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
     
    localStorage.removeItem('items');

    checkUI();

    // itemList.innerHTML = ''; (one way of doing it)
}

const checkUI = () => {
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
       itemClear.style.display = 'none';
       itemFilter.style.display = 'none';
    } else {
       itemClear.style.display = 'block';
       itemFilter.style.display = 'block';
    }
    
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

const checkItems = () => {
   const filter = itemFilter.value.toLowerCase();
   const items = itemList.querySelectorAll('li');
    
    items.forEach((item) => {
        const itemName =item.firstChild.textContent.toLowerCase();


       if ( itemName.indexOf(filter) != -1) {
        item.style.display = 'flex'
       }else {
        item.style.display = 'none'
       }


    })
   console.log(filter);
}

const checkIfItemExist = (item) => {
    const itemsFromStorage = getItemsFromStorage();

    return (itemsFromStorage.includes(item));


}

//Initialize app

const init = () => {

 itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', OnclickItem);
itemClear.addEventListener('click', clearAll);
itemFilter.addEventListener('input', checkItems);
document.addEventListener('DOMContentLoaded', displayItems);
checkUI();

}

init();

