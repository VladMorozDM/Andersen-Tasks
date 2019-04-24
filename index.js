/**
 * Created by vlad on 23.04.2019.
 */

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const itemsToParse = [

    {
        date: '2019-03-03T03:24:00',
        text: 'b',
        id: 2
    },
    {
        date: '2019-04-23T03:24:00',
        text: 'c',
        id: 3
    },
    {
        date: '2019-01-23T03:24:00',
        text: 'a',
        id: 1
    },
    {
        date: '2019-02-23T03:24:00',
        text: 'd',
        id: 4
    }
];


class UsefulMethods {
    static sortingByTime(a, b) {
        const c = new Date(a.date);
        const d = new Date(b.date);
        return c - d;
    };

    static sortingByText(a, b) {
        if (a.text < b.text) { return 1; }
        if (a.text > b.text) { return -1; }
        return 0;
    }

    static addItems() {
        const form = document.getElementById("addItem");
        const value = new Item({date: new Date(), text: form.elements[0].value});
        firstComm.add(value);
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
    constructor(root){
        this.root = root;
    }
    render(Items) {
        this.root.innerHTML = '';
        Items.forEach(item => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = item.getTemplate();
            this.root.prepend(wrapper);
        });

    }
}

class Controller {
    constructor(toDoItems = []) {
        this.toDoItems = toDoItems;
        this.root = root;
        this.view = {};
        this.filteredList = [];
    }
    onInit(viewObject) {
        this.view = viewObject;
        this.view.render(this.toDoItems);
        this.view.root.addEventListener("click", e => {
            this.toDoItems.forEach(item => {
                item.handleClick(this, e)
            })
        });
    }
    add(item) {
        const toDoItems = this.toDoItems;
        if (!item.id) (item.id = toDoItems[toDoItems.length - 1].id + 1);
        this.toDoItems.push(item);
        this.view.render(this.toDoItems)
    };
    remove(itemId) {
        this.toDoItems = this.toDoItems.filter(item => item.id !== itemId);
        this.view.render(this.toDoItems);
    }
    sortItems(criteria) {
        console.log(criteria);
        switch (criteria) {
            case "byTime":
                const sortedByNewest = this.toDoItems.sort(UsefulMethods.sortingByTime);
                this.view.render(sortedByNewest);
                break;
            case "byText":
                const sortedByAlphabet = this.toDoItems.sort(UsefulMethods.sortingByText);
                this.view.render(sortedByAlphabet);
                break;
        }
    };
    filterItems(sample) {
        this.filteredList = this.toDoItems.filter(item => item.text.toLowerCase().includes(sample.toLowerCase()));
        this.view.render(this.filteredList)
    }
}


class Item {
    constructor({date = '', text = '', id = 0}) {
        this.date = date;
        this.text = text;
        this.id = id;
    }

    getTemplate() {
        const date = new Date(this.date);
        return `<h6> ${monthNames[date.getMonth()]} ${ date.getDate()}  </h6>
            <form action="">
                <input type="checkbox">
                <p>${this.text}</p>                    
                <input class="change" type="button" data-id="${this.id}" value="change">
                <input class="delete" type="button" data-id="${this.id}" value="delete">
                <input type="text" name="redact">
                <input type="button" name = "submit"><input type="button" name = "cancel">
             </form>`;
    }

    handleClick(controller, event) {
        if (Number.parseInt(event.target.getAttribute("data-id")) === this.id) {
            if (event.target.classList.contains("delete")) {
                controller.remove(this.id);
            }
        }
    }
}

const parent = document.getElementById("root");
const taskList = itemsToParse.map(item => new Item(item));
const firstView = new View(parent);
const firstComm = new Controller(taskList);
firstComm.onInit(firstView);

