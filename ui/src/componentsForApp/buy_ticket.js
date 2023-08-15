// import {Link} from "react-router-dom";
// import "./Address.css"
import {useState,useEffect,useRef} from 'react';
import { TiCheckbox, TiCheckboxGroup, TiCheckboxButton } from '@titian-design/mobile-react';

// const Buy: React.FunctionComponent = () => {
    const Buy=()=>{

    const number=66;
    let LotteryNumber=[];
    let selectNum=[];
    let selectNum2=[];
    const [numList,setNumList]=useState([]);
    const [checkState,setCheckState]=useState([]);
    const ref = useRef([]);
    let numOption=useRef(0);

    
    function handleInit(e){
      for(let i=0;i<number;i++){
        ref.current.push(false);
      }    
    }
    useEffect(() => {
      if(ref.current.length===0){
        handleInit();
      }
      setCheckState({checkState:ref.current});
      console.log(ref.current);
  },[])

    function filtered(input){
      // const num=input.toString();
      
      selectNum2.splice(selectNum2.indexOf(input),1);
      // selectNum.splice(selectNum.indexOf(input),1);
      // setNumList({numList:selectNum});
      // setNumList(()=>{
      //   numList.splice(numList.indexOf(input),1);
      // })
      console.log("do filter");
      console.log(selectNum2);
      console.log("finish");
    }

    function add(input){
      setNumList((pre)=>{
        return([...pre,input]);
      })
    }

    function handleList(e){
      const num=e.target.label;
      selectNum=numList;
      // const select=e.target.value
      // console.log(selectNum);
      // console.log(select);
        if(ref.current[num-1]===true){
          console.log("cancel"+ref.current[num-1]);
          // e.target.value=0;
          ref.current[num-1]=false;
          filtered(num);
          console.log(numList);
          // setNumList({numList:selectNum});
        }
        else if(ref.current[num-1]===false){
          // e.target.value=1;
          console.log("add"+ref.current[num-1]);
          ref.current[num-1]=true;
          // setNumList((pre)=>{
          //   return([...pre,num])
          // })
          add(num);
          console.log(numList);
        }
      }

      function handleCheckboxChange(event) {
        const isChecked = event.target.checked;
        console.log(isChecked);
      }

      function handleList3(e){
        // console.log(selectNum2);      
        const num=e.target.label;
        const select=e.target.value
        const check=e.target.checked;
        selectNum=numList;
        console.log(check);
        console.log(select);
        // if(selectNum2.includes(num)){
        if(select===1){
          console.log("cancel");
          e.target.value=0;
          filtered(num);
          setNumList({numList:selectNum});
        }
        else if(select===0){
          console.log("add");
          e.target.value=1;
          setNumList((pre)=>{
            return([...pre,num])
          })
          console.log(selectNum2);
        }
      }  

    function handleList2(e){  
      const num=e.target.label;
      if(ref.current[num-1]===true){
        console.log("cancel");
        ref.current[num-1]=false;
        numOption.current-=1;
        filtered(num);
        console.log("option: "+numOption.current);
      }
      else if(ref.current[num-1]===false){
        console.log("add");
        ref.current[num-1]=true;
        numOption.current+=1;
        selectNum2.push(num);
        console.log("option: "+numOption.current);
        console.log(selectNum2);
      }
    }

    function handleClear(e){
      handleInit();
    }

    function test(e){
      const bool=e.target.value;
      if(bool===0){
        console.log("select"+e.target.label);
        e.target.value=1;
      }else{
        console.log("cancel"+e.target.label);
        e.target.value=0;
      }
    }


     
    const show=()=>{
        for(let i=1;i<=number;i++){
            LotteryNumber.push(<TiCheckboxButton label={i} value={0} key={i} onchange={(e)=>handleList2(e)}/>)
            // LotteryNumber.push(<TiCheckboxButton label={i} value={0} key={i}  onchange={handleCheckboxChange}/>)
        }
        return LotteryNumber;
        
    }
    
      // return (
      //   <div>

      //   {/* <TiCheckboxButton label="try" onChange={handleCheckboxChange} /> */}
      //   {show()}
      //   <span>
      //     <button>Clear All</button>
      //     <button>Buy</button>
      //   </span>
      //   <div/>
      // );
      return(
        <>
        <div>{show()}</div>
        <span>
           <button onchange={(e)=>handleClear(e)}>Clear All</button>
           <button>Buy</button>
           <button>Back</button>
         </span>
        </>
      )
    }

    

    export default Buy;