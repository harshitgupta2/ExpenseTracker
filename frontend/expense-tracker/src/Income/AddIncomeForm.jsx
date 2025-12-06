import React, { useState } from 'react'
import Input from '../components/input/Input'

const AddIncomeForm = ({onAddIncome}) => {
    const [income,setIncome] = useState({
        source:"",
        amount:"",
        date:"",
        icon:""
    })
    const handleChange = (key,value)=> setIncome({...income,[key]:value})
  return (
    <div>
    <Input 
    value={income.source}
    onChange={({target})=> handleChange("source",target.value)}
    label="Income source"
    placeholder="Freelance, Salary, etc"
    type="text"
     />
      <Input 
    value={income.amount}
    onChange={({target})=> handleChange("amount",target.value)}
    label="Amount"
    placholder=""
    type="number"
     />
      <Input
    value={income.date}
    onChange={({target})=> handleChange("date",target.value)}
    label="Date"
    placholder=""
    type="date"
     />
     <div className='flex justify-end mt-6'>
     <button
     type="button"
     className='add-btn add-btn-fill'
     onClick={()=> onAddIncome(income)}
     >Add Income</button>
     </div>
    </div>
  )
}

export default AddIncomeForm
