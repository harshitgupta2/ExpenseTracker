import React, { useContext } from 'react';
import {UserContext} from '../../context/UserContext';
import {useNavigate} from 'react-router-dom';
import { SIDE_MENU_DATA } from '../../Utils/data';

const SideMenu = ({activeMenu }) => { 

  
  const {user,clearUser} = useContext(UserContext);

  const navigate = useNavigate();

/**
 * Handles sidebar/menu item clicks.
 *
 * If the clicked item is "Logout", the user is logged out.
 * Otherwise, the function simply navigates to the provided route.
 *
 * @param {string} route - The name or path of the route to navigate to.
 */
  const handleClick = (route) => {
    if(route=="logout"){
      handleLogout();
      return;
    }

    navigate(route);
  };

  /**
 * Logs the user out of the application.
 *
 * This function clears all stored user data,
 * resets the user state, and redirects the user
 * back to the login page.
 */
  const handleLogout = () =>{
    localStorage.clear();
    clearUser();
    navigate("/login")
  }
  return (
  <>

  
   <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">

   
    <h5 className= 'text-gray-950 flex justify-center items-center font-medium leading-6 mb-5'>{user?.fullName || ""}</h5>
    {SIDE_MENU_DATA.map((item,index)=>(
    <button
    key={`menu_${index}`}
    className={`w-full flex items-center gap-4 text-[15px] ${activeMenu == item.label ? "text-white bg-primary" :""} py-3 px-6 rounded-lg mb-3`}
    onClick={()=> handleClick(item.path)}
    >
      <item.icon className='text-xl' />
      {item.label}
    </button>
   ))}
   </div>

  
  </>
  )
}

export default SideMenu
