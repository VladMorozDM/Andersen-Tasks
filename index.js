/**
 * Created by vlad on 23.04.2019.
 */
let itemsToParse;

if(!localStorage.getItem("items")) {
    itemsToParse = [

        {
            date: '2019-03-03T03:24:00',
            text: 'sa',
            done: false,
            id: 2
        },
        {
            date: '2019-04-23T03:24:00',
            text: 'Should drink some tea',
            done: false,
            id: 3
        },
        {
            date: '2019-01-23T03:24:00',
            text: 'Work hard',
            done: true,
            id: 1
        },
        {
            date: '2019-02-23T03:24:00',
            text: 'Work not hard',
            done: true,
            id: 4
        },
        {
            date: '2019-02-23T03:24:00',
            text: 'Waghhhh',
            done: true,
            id: 5
        }
    ];
} else{
    itemsToParse = JSON.parse(localStorage.getItem("items"));
}

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];



class UsefulMethods {
    static sortingByTime(a, b) {
        const c = new Date(a.date);
        const d = new Date(b.date);
        return c - d;
    };
    static sortingByText(a, b) {
        if (a.text.toLowerCase() < b.text.toLowerCase())  return 1;
        if (a.text.toLowerCase() > b.text.toLowerCase())  return -1;
        return 0;
    }
    static addItems() {
        const form = document.getElementById("addItem");
        if(form.elements[0].value === '') {
            form.elements[0].classList.add("warning");
        }
        else {
            form.elements[0].classList.remove("warning");
            const value = new Item({date: new Date(), text: form.elements[0].value, done: false});
            form.elements[0].value = '';
            firstComm.add(value);
        }
    }
    static changeSorting() {
        const form = document.getElementById("addItem");
        const sortingSelect = form.typeOfSorting;
        firstComm.sortItems(sortingSelect.options[sortingSelect.selectedIndex].value);
    }
    static filterByText() {
        const form = document.getElementById("addItem");
        const filterSample = form.filterSample.value;
        firstComm.filterItems(filterSample)
    }
}



class View {
    constructor(root, toDoItems){
        this.toDoItems = toDoItems;
        this.root = root;
        this.filteredList = [];
    }
    render() {
        this.root.innerHTML = '';
        if (this.filteredList.length){
                this.filteredList.forEach(item => {
                    const wrapper = document.createElement("div");
                    wrapper.innerHTML = item.getTemplate();
                    this.root.prepend(wrapper);
                })
        }else {
                this.toDoItems.forEach(item => {
                    const wrapper = document.createElement("div");
                    wrapper.innerHTML = item.getTemplate();
                    this.root.prepend(wrapper);
                });
        }

    }
}

class Controller {
    constructor(viewObject) {
        this.root = root;
        this.view = viewObject;
    }
    onInit() {
        this.render();
        this.view.root.addEventListener("click", e => {
            this.view.toDoItems.forEach(item => {
                item.handleClick(this, e)
            })
        });
    }
    add(item) {
        const toDoItems = this.view.toDoItems;
        if (!item.id && toDoItems.length) {
            item.id = toDoItems[toDoItems.length - 1].id + 1
        }
        else if( !item.id && !toDoItems.length ) {
            item.id = 0;
        }
        this.view.toDoItems.push(item);
        localStorage.setItem("items", JSON.stringify(this.view.toDoItems));
        this.filteredList = [];
        this.render()
    };
    remove(itemId) {
        this.view.filteredList = this.view.filteredList.length
                                    ? this.view.filteredList.filter(item => item.id !== itemId)
                                    : this.view.filteredList;
        this.view.toDoItems = this.view.toDoItems.filter(item => item.id !== itemId);
        localStorage.setItem("items", JSON.stringify(this.view.toDoItems));
        this.render();
    };
    sortItems(criteria) {
        switch (criteria) {
            case "byTime":
                this.view.filteredList.length
                    ?  this.view.filteredList.sort(UsefulMethods.sortingByTime)
                    :  this.view.toDoItems.sort(UsefulMethods.sortingByTime);
                this.render();
                break;
            case "byText":
                  this.view.filteredList.length
                    ? this.view.filteredList.sort(UsefulMethods.sortingByText)
                    : this.view.toDoItems.sort(UsefulMethods.sortingByText);
                this.render();
                break;
        }
    };
    filterItems(sample) {
        if(sample==='') this.view.filteredList = [];
        else{
            this.view.filteredList = this.view.toDoItems.
                filter(item => item.text.toLowerCase().includes(sample.toLowerCase()));
        }
        this.render()
    }
    render(){
        this.view.render();
    }

}


class Item {
    constructor({date = '', text = '', id, done = false}) {
        this.date = date;
        this.text = text;
        this.id = id;
        this.done = done;
    }

    getTemplate() {
        const date = new Date(this.date);
        return `<h6> ${monthNames[date.getMonth()]} ${ date.getDate()}  </h6>
            <form action="">
                <input type="checkbox" name="progress" data-id=${this.id} ${this.done ? "checked" : ""}>
                <label for="progress" >${this.done ? "Done" : "In progress" }</label>
                <p>${this.text}</p>                    
                <input class="delete btn btn-danger" type="button" data-id="${this.id}" value="delete">
             </form>`;
    }

    handleClick(controller, event) {
        if (Number.parseInt(event.target.getAttribute("data-id")) === parseInt(this.id)) {
            if (event.target.classList.contains("delete")) {
                controller.remove(this.id);
            }else if(event.target.name === "progress"){
                this.done = !this.done;
                controller.render()
            }
        }
    }
}

const parent = document.getElementById("root");
const taskList = itemsToParse.map(item => new Item(item));
const firstView = new View(parent, taskList);
const firstComm = new Controller(firstView);

firstComm.onInit();




