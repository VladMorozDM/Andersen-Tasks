/**
 * Created by vlad on 23.04.2019.
 */
const parent = document.getElementById("root");
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const itemsToParse  = [
    {
        date: new Date( '2019-04-23T03:24:00' ),
        text: 'a',
        id: 1
    },
    {
        date: new Date( '2019-04-23T03:24:00' ),
        text: 'b',
        id: 2
    },
    {
        date: new Date( '2019-04-23T03:24:00' ),
        text: 'c',
        id: 3
    },
    {
        date: new Date( '2019-04-23T03:24:00' ),
        text: 'd',
        id: 4
    }
];



class Commander{
    constructor(root, toDoItems = []){
        this.toDoItems = toDoItems;
        this.root = root;

    }

    add(item){
        const toDoItems = this.toDoItems;
        if(!item.id)  (item.id = toDoItems[toDoItems.length-1].id+1);
        this.toDoItems.push(item);
        this.render()
    };

    remove(itemId){
        this.toDoItems = this.toDoItems.filter( item => item.id !== itemId);

        this.render();
    }


    onInit(){
        this.render();


    }

    render(){
        this.root.innerHTML = '';
        this.toDoItems.forEach( item => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = item.template;
            this.root.append(wrapper);
        });
        this.root.addEventListener("click", e =>{
            this.toDoItems.forEach( item => {
                item.handleClick(this, e)} )
        });
    }
}



class Item{

    constructor({date = '', text = '', id = 0}){
        this.date = date;
        this.text = text;
        this.id = id;
        console.log(this.date, "&");
        this.template = `<h6> ${monthNames[this.date.getMonth()]} ${this.date.getDay()} </h6>
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
                console.log("IN!")
                controller.remove(this.id);
            }
            if(event.target.classList.contains("submit")){
                event.target.setAttribute("value", "edit");
                event.target.classList.toggle("edit");
                event.target.classList.toggle("submit");
                let contentToChange = event.target;
                while(contentToChange.id != this.id){
                    contentToChange = contentToChange.previousElementSibling;
                }

                if(this.name !== contentToChange.firstElementChild.value){
                    this.name = contentToChange.firstElementChild.value
                    this.template = `<p id="${this.id}">${this.name}</p>
                          <input type="button" class = "edit" data-id="${this.id}" value="edit">
                          <input type="button" class = "delete" data-id="${this.id}" value="delete">`;
                    contentToChange.innerHTML = contentToChange.firstElementChild.value
                }else{

                    contentToChange.innerHTML = contentToChange.firstElementChild.value;


                }
            }


            // Click on edit button
            else if(event.target.classList.contains("edit")){
                event.target.setAttribute("value", "submit");
                event.target.classList.toggle("edit");
                event.target.classList.toggle("submit");
                let contentToChange = event.target;
                while(contentToChange.id != this.id){
                    contentToChange = contentToChange.previousElementSibling;
                }

                const contentValue = contentToChange.innerHTML;
                contentToChange.innerHTML =
                    `<input type="text" value="${contentValue}">`
            }

        }
    }
}


const taskList = itemsToParse.map( item => new Item(item));

const firstComm = new Commander(parent, taskList);
firstComm.onInit();

const form = document.getElementById("addItem");


function addItems(event){
    console.log("Ku!");

    const value = new Item({date: new Date(),text: form.elements[0].value});
    firstComm.add(value);
}