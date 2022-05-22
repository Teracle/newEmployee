
import './Home.css';
import React, { useState,useEffect } from "react";
import Modal from 'react-modal';
import Notifications, {notify} from 'react-notify-toast';
// import useMediaQuery from '@mui/material/useMediaQuery';

// Google icon
<link rel="stylesheet" href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
// Google icon

let uuid = require('uuid');

const { 
  v1: uuidv1,
} = require('uuid');


function App() {

  const [AddEmployeemodal, AddEmployeemodalIsOpen] = useState(false);
  const [EditEmployeemodal, EditEmployeemodalIsOpen] = useState(false);
  const [deleteModal, deleteModalIsOpen] = useState(false);
  const [editFirstName,setEditFirstName]=useState('');
  const [editFirstName2,setEditFirstName2]=useState('');
  const [Users, fetchUsers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [id,setID]=useState('');

  // const isDesktop = useMediaQuery('(min-width: 420px)');

  const AddModal =()=>{
    AddEmployeemodalIsOpen(true);
  }

  const EditModal =(e)=>{
    EditEmployeemodalIsOpen(true);
  }

  const DeleteModal=(e)=>{
    deleteModalIsOpen(true);
  }


  const handleName = e => {
    setFirstName(e.target.value);
    setEditFirstName(e.target.value);
  };

  const handleSurname= e =>{
    setLastName(e.target.value);
    setEditFirstName2(e.target.value);
  }

  

  const SaveAndCloseModal=(e)=>{
    setEditFirstName("")
    setEditFirstName2("");
    setFirstName("");
    setLastName(""); 

    if(firstName!=='' && lastName!==''){
      AddEmployeemodalIsOpen(false);
      EditEmployeemodalIsOpen(false);
      const id=uuidv1();
    
      const newID = {"firstname": firstName, "lastname": lastName,"id":id};    
      setEditFirstName(firstName)
      setEditFirstName2(lastName);
      
      fetch('http://localhost:3005/persons', {  

      method: 'POST', 
     
      body: JSON.stringify(newID),
      headers: {
        'Content-Type': 'application/json'
    }

    })
    .then(()=>{
      getData();
    })
    .catch(()=>{
      alert('Unable to add employee');
    })

    setFirstName("");
    setLastName("");

    notify.show('Новый сотрудник успешно создан',"success",3000,"green");

  }
  
  else if(firstName==='' && lastName!==''){
    notify.show('Укажите Имя сотрудника',"error",3000,"red");

  }
  else if(lastName==='' && firstName!==''){
    notify.show('Укажите Фамилию сотрудника',"error",3000,"red");
  }
  else{
   
    notify.show('Укажите имя и фамилию сотрудника',"error",3000,"red");
  }

  
  
  }

  const closeModal=()=>{
    AddEmployeemodalIsOpen(false);
    EditEmployeemodalIsOpen(false);
    deleteModalIsOpen(false);
  }

 
   const getData = () => {
    fetch('http://localhost:3005/persons')
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        fetchUsers(res)
      })
  }

  useEffect(() => {
    getData()
  }, [])



  const SavedAndCloseEditModal=(e)=>{
   

    if(firstName!=='' && lastName!==''){
    const newData={"firstname":editFirstName,"lastname":editFirstName2};
    EditEmployeemodalIsOpen(false);
    fetch('http://localhost:3005/persons/'+id, {  

      method: 'PUT', 
     
      body: JSON.stringify(newData),
      headers: {
        'Content-Type': 'application/json'
    }

    })
    .then(()=>{
      getData();
    })
    .then(()=>{
      setFirstName("");
      setLastName(""); 
  
    })
    .catch(()=>{
      console.log('Couldn\t edit employee');
    })


    notify.show('Сотрудник успешно отредактирован',"success",3000,"green");
  }

  else if(firstName==='' && lastName!==''){
    notify.show('Укажите Имя сотрудника',"error",3000,"red");

  }
  else if(lastName==='' && firstName!==''){
    notify.show('Укажите Фамилию сотрудника',"error",3000,"red");
  }
  else{
   
    notify.show('Укажите имя и фамилию сотрудника',"error",3000,"red");
  }

  }

  
  const getValue=(e)=>{
    setFirstName(e.currentTarget.querySelector('.row-profile').textContent);
    setLastName(e.currentTarget.querySelector('.editLastName').textContent)
    setID(e.currentTarget.querySelector('.ID').textContent);
    
}



const DeleteEmployeeModal=(e)=>{
    
  fetch('http://localhost:3005/persons/'+id,{  

    method: 'DELETE', 
    headers: {
      'Content-Type': 'application/json'
  }
  })

.then(()=>{
  getData();
})
.catch((e)=>{
  console.log('No employee with that ID');
})

  setFirstName("");
  setLastName("");
  deleteModalIsOpen(false);
  notify.show('Сотрудник успешно удален',"success",3000,"green");

}

  return (
    <div className="App">
     
    
     <Notifications />

      <table id="customers">
        
        <tr>
          <th>Имя</th>
          <th>Фамилия</th>
          <th></th>
          
        </tr>

         {Users.map(item => {

              
                return(
                    <tr onClick={getValue}>
                      
                      <td className="row-profile"><img className="profile-icon" src="https://img.icons8.com/small/32/000000/user-male-circle.png"/> {item.firstname}</td>
                      <td className='editLastName'>{item.lastname}</td>
                      <td className='ID'>{item.id}</td>
                      
                      <td><img onClick={EditModal} className="edit" src="https://img.icons8.com/small/32/000000/edit.png"/><img onClick={DeleteModal} className="remove" src="https://img.icons8.com/small/32/000000/delete-sign.png"/></td>
                  
                  </tr>
                    )
                  
                })}
        </table>

      <Modal isOpen={AddEmployeemodal}>
        <div className='addEmployee-window'>
          <div className='addEmployee-header'>
            <h3>Создание сотрудника</h3>
          </div>

            <p className='back' style={{color:"blue", textDecoration:'underline blue',cursor:'pointer'}} onClick={closeModal}>Назад к списку</p>
              <input onChange={handleName} placeholder="Введите имя сотрудника"/>
              <input onChange={handleSurname} placeholder="Введите фамилию сотрудника"/>
              <button type="submit" onClick={SaveAndCloseModal}>Сохранить</button>
                
          </div>
        </Modal>

      <Modal isOpen={EditEmployeemodal}>
        <div className='addEmployee-window'>
          <div className='addEmployee-header'>
            <h3>Редактирование сотрудника</h3>
          </div>

        <p className='back' style={{color:"blue", textDecoration:'underline blue',cursor:'pointer'}} onClick={closeModal}>Назад к списку</p>
        
        
        <input onChange={handleName} value={firstName} />
          <input onChange={handleSurname} value={lastName} />
            <button onClick={SavedAndCloseEditModal}>Сохранить</button>
                
          </div>
        </Modal>

      <Modal isOpen={deleteModal}>
        <div className='addEmployee-window'>
          <div className='addEmployee-header'>
            <h3>Удалить сотрудника?</h3>
          </div>

        <p className='back' style={{color:"blue", textDecoration:'underline blue',cursor:'pointer'}} onClick={closeModal}>Назад к списку</p>
        

          <p>Имя:<b>{firstName}</b></p>
          <p>Фамилия:<b>{lastName}</b></p>
            <button onClick={DeleteEmployeeModal}>Удалить</button>
                
          </div>
        </Modal>


      <div>
        
      </div>

        <div className="addEmployee" onClick={AddModal}>Добавить сотрудника</div>
              
      </div>

  );
}

export default App;
