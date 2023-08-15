import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import TRY from './try';
import UserApp from '../src/components/TwoApp/UserApp';
import OwnerApp from '../src/components/TwoApp/OwnerApp';
import reportWebVitals from './reportWebVitals';
import { useState, useEffect,useRef } from 'react';

// // Try to do 
// export function Choose(){
//   const [hasChoose,setHasChoose]=useState(false);
//   const [isUser,setIsUser]=useState(false);

//   function chooseUser(){
//     console.log("User!!");
//     setHasChoose(true);
//     setIsUser(true);
//   }
//   function chooseOwner(){
//     console.log("owner!!");
//     setHasChoose(true);
//     setIsUser(false);
//   }

//   function showButton(){
//     return(
//       <div>
//         <button onClick={(e)=>chooseUser(e)}>
//           USER
//         </button>
//         <button onClick={chooseOwner}>
//           OWNER
//         </button>
//       </div>
//     )
//   }
//   function showUserInterface(){
//     return(
//       <div>
//         <UserApp/>
//       </div>
//     )
//   }
//   function showOwnerInterface(){
//     return(
//       <div>
//         <OwnerApp/>
//       </div>
//     )
//   }
  
//   return(
//     <div className="Identity">
//       {
//         hasChoose? (
//         <div>
//         {isUser?(
//           <div>
//             {showUserInterface()}
//             {/* {showOwnerInterface()} */}
//           </div>
//         ):(
//           <div>
//             {showOwnerInterface()}
//             {/* {showUserInterface()} */}
//           </div>
//         )}
//         </div>
//         ):(
//           <div>
//           {showButton()}
//           </div>
//         )
//       }

//     </div>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <TRY />
  // </React.StrictMode>

  <React.StrictMode>
    {/* <Choose/> */}
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
