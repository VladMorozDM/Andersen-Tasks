/**
 * Created by vlad on 23.04.2019.
 */
const parent = document.getElementById("root");
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const itemsToParse  = [
    {
        date:  '2019-04-23T03:24:00' ,
        text: 'a',
        id: 1
    },
    {
        date:  '2010-04-23T03:24:00' ,
        text: 'b',
        id: 2
    },
    {
        date:  '2019-02-23T03:24:00' ,
        text: 'c',
        id: 3
    },
    {
        date: '2019-05-23T03:24:00' ,
        text: 'd',
        id: 4
    }
];



class Commander{
    constructor(root, toDoItems = []){
        this.toDoItems = toDoItems;
        this.root = root;
        this.state = "date"
    }

    add(item){
        const toDoItems = this.toDoItems;
        if(!item.id)  (item.id = toDoItems[toDoItems.length-1].id+1);
        this.toDoItems.push(item);
        this.render(this.toDoItems)
    };

    remove(itemId){
        this.toDoItems = this.toDoItems.filter( item => item.id !== itemId);
        this.render(this.toDoItems);
    }

    getTemplate(){
        return `<div>
                    <form id="addItem" action="#">
                        <div>
                            <input type="text">
                            <input type="button" onclick="addItems()" value="add Task">
                        </div>
                        <select name="language" size="2">
                            <option value="byTime"="selected">Sort By Time</option>
                            <option value="byText">Sort By Text</option>
                        </select>
                    </form>
                    
                </div>`
    }

    filterItems(criteria){
        /*
        switch(criteria) {
            case "byTime":

                break;
            case "byText":

                break;
        }
        */
        };
    sortItems(criteria){
        switch(criteria) {
            case "byTime":
                const sortedList = this.toDoItems.sort(function(a,b){
                    const c = new Date(a.date);
                    const d = new Date(b.date);
                    return c-d;
                });
                console.log(sortedList);
                this.render(sortedList);
                break;
            case "byText":

                break;
        }

    };


    onInit(){
        this.render(this.toDoItems);
        this.root.addEventListener("click", e =>{
            this.toDoItems.forEach( item => {
                item.handleClick(this, e)} )
        });
    }

    render(Items){
        this.root.innerHTML = '';

        Items.forEach( item => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = item.getTemplate();
            this.root.prepend(wrapper);
        });
        const form = this.getTemplate();
        this.root.innerHTML +=  form;
    }
}



class Item{
    constructor({date = '', text = '', id = 0}){
        this.date = date;
        this.text = text;
        this.id = id;

    }
    getTemplate(){
        return `<h6> ${new Date(this.date)} </h6>
            <form action="">
                <input type="checkbox">
                <p>${this.text}</p>                    
                <input class="change" type="button" data-id="${this.id}" value="change">
                <input class="delete" type="button" data-id="${this.id}" value="delete">
                <input type="text" name="redact">
                <input type="button" name = "submit"><input type="button" name = "cancel">
             </form>`;
    }
    handleClick(controller, event){
        if(event.target.getAttribute("data-id") == this.id  ) {
            if (event.target.classList.contains("delete")) {
                controller.remove(this.id);
            }

        }
    }
}


function addItems(event){
    const form = document.getElementById("addItem");
    const value = new Item({date: new Date(),text: form.elements[0].value});
    firstComm.add(value);
}

const taskList = itemsToParse.map( item => new Item(item));
const firstComm = new Commander(parent, taskList);
firstComm.onInit();


firstComm.sortItems("byTime");


