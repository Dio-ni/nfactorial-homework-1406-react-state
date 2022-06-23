import React, { useState,useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";


// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = [
  {
    key: uuidv4(),
    label: "Have fun",
  },
  {
    key: uuidv4(),
    label: "Spread Empathy",
  },
  {
    key: uuidv4(),
    label: "Generate Value",

  },
];
const getFromLocalItems=()=>{
  let list = localStorage.getItem('items');
  console.log(list);
  if(list){
    return JSON.parse(localStorage.getItem('items'))
  }
  else{
    return [];
  }
}
// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(getFromLocalItems());

  const [filterType, setFilterType] = useState("");

  const [search,setSearch]=useState("");
  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    // mutating !WRONG!
    // const oldItems = items;
    // oldItems.push({ label: itemToAdd, key: uuidv4() });
    // setItems(oldItems);

    // not mutating !CORRECT!
    setItems((prevItems) => [
      { label: itemToAdd, key: uuidv4() },
      ...prevItems,
    ]);
    setItemToAdd("");
  };
  const handleDeleteItem =({key})=>{
     const itemIndex = items.findIndex((item) => item.key === key);
     const leftSideOfAnArray = items.slice(0, itemIndex);
     const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
     setItems([...leftSideOfAnArray, ...rightSideOfAnArray]);
     

  }

  const handleItemDone = ({ key }) => {
    //first way
    // const itemIndex = items.findIndex((item) => item.key === key);
    // const oldItem = items[itemIndex];
    // const newItem = { ...oldItem, done: !oldItem.done };
    // const leftSideOfAnArray = items.slice(0, itemIndex);
    // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
    // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

    //  second way
    // const changedItem = items.map((item) => {
    //   if (item.key === key) {
    //     return { ...item, done: item.done ? false : true };
    //   } else return item;
    // });

    //second way updated
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };
  const handleImportant =({key})=>{
    setItems((prevItems) =>
    prevItems.map((item) => {
      if (item.key === key) {
        return { ...item, status: !item.status };
      } else return item;
    })
  );
  }
  const handleEnter =(event)=>{
    if(event.key ==='Enter'){
      handleAddItem(event.target.value);
    }
  }
  const handleFilterItems = (type) => {
    setFilterType(type);
  };
  
  const handleSearch=(value)=>{
    setSearch(value);
    console.log(items.find((item)=>item.label.includes(search)))
  }

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const filteredItems =
    !filterType || filterType === "all" 
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      :items.filter((item) => item.done)
  const searchFiltered = filteredItems.filter((item)=>item.label.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);
  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={(e)=>handleSearch(e.target.value)}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {searchFiltered.length > 0 &&
          searchFiltered.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item ${item.done ? " done" : "" } ${item.status ? "text-info": ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={()=>handleImportant(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={()=>handleDeleteItem(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
          onKeyDown={(e)=>handleEnter(e)}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
