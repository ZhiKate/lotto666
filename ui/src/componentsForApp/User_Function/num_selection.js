

import {useState,useEffect,useRef} from 'react';
import { TiCheckbox, TiCheckboxGroup, TiCheckboxButton } from '@titian-design/mobile-react';
import {BigNumber, ethers } from 'ethers';//change
import Lotto666 from "../../constant_contract/Lotto666.json";
import Address from '../../constant_contract/Address_Local';
const { ethereum } = window;
// const ethereum = (window as any).ethereum;

const NumberSelector=(props)=>{
    // unfinish: 彩票价格是可以变化的，应该将价格设为一个state。
    // const provider = new ethers.providers.Web3Provider(ethereum);
    // const signer = provider.getSigner();
    const number=66;
    let LotteryNumber = [];
    let selectNum=[];
    const [numList,setNumList]=useState([]); // record the number you have seleted.
    const [input,setInput]=useState(1);
    const [move,setMove]=useState(1);
    const [cost,setCost]=useState(0);
    let ref = useRef([]); //to record if number has selected or not.false-->not selected; true--> selected
    let numOption=useRef(0); // record how many numbers you have selected. And you cannot select more than 6 numbers.
    let NotallowClick=useRef(true); // if true --> 'Buy' button cannot be clicked; otherwise, 'Buy' can be clicked. When numOption===6, it can be clicked.
    const {AccAddress,AccBalance}=props;
    //---------------------------------------- handle functions ------------------------------------------------------
    //this function is used to set all number to be false which means not be seleted/
    function handleInit(e){
      for(let i=0;i<number;i++){
        ref.current.push(false);
      }    
    }

    // this one is used to remove the number which has been seleted. That means when this number is in the numList(has been seleted),
    // and you input it again, it will be removed from the numList.
    function filtered(input){
        setNumList(current =>
            current.filter(num => {
              return num !== input;
            }),
          );
        }

    // when input is not in the numList,add it into numList.     
    function add(input){
        setNumList((pre)=>{
            return([...pre,input]);
        })
        }

    // this one is used to update all the states when you add or cancel the number.    
    function handleList(e){
        const num=e.target.value;
        selectNum=numList;
        console.log("Before rerender, how the numList look like: "+ selectNum);
        if(ref.current[num-1]===true){
            console.log("cancel"+ref.current[num-1]);
            ref.current[num-1]=false;
            numOption.current-=1;
            NotallowClick.current=true;
            filtered(num);
            console.log(numList);
        }
        else if(ref.current[num-1]===false&&numOption.current<6){
            console.log("add"+ref.current[num-1]);
            ref.current[num-1]=true;
            numOption.current+=1;
            if(numOption.current===6){
                NotallowClick.current=false;
            }
            add(num);
            console.log(numList);
        }
    }


    // this one is used to cancel all selected numbers. 
    function handleClear(e){
        numOption.current=0;
        NotallowClick.current=true;
        setNumList(()=>{
            return([]);
        });
        setInput(0);
        console.log("before set all value to false: "+ref.current);
        for(let i=0;i<number;i++){
            ref.current[i]=false;
            
        }    
        console.log("After set all... : "+ref.current);
    }

    // it is used to order the elements in the numList(small -> large).
    function orderNumList(){
        console.log(numList);
        let ordered=numList;
        ordered.sort(function(a,b){return a-b});
        return ordered;
        // input.sort();
        // console.log(input);
        // const[]=[11,2,3,4];
        // console.log(ordered);
    }

    //use this to generate the ticket number by 6 selected digits.
    function generator(){
        const list=orderNumList();
        const calculateList=[];
        for(let i=0;i<list.length;i++){
            calculateList.push(list[i]-1);
        }
        // console.log(list);
        let bigNum=0;
        for(let i=0;i<calculateList.length;i++){
            bigNum+=calculateList[i]*Math.pow(66,i);
        }
        return bigNum;
    }



    async function handleBuy(){
        const bigNum=generator();
        const amount=input;
        console.log("The generated big number is: "+ bigNum);
        // invoke the lotto666 contract

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
        //   "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",//change to constant value later, like config.Lotto666_address.
          Lotto666.abi,
          signer
        );

        // const number=ethers.BigNumber;
        const bigNumList=[];

        // const number=new ethers.BigNumber(bigNum);
        for(let i=0;i<input;i++){
            bigNumList.push(bigNum);
        }

        const valuesBytes = ethers.utils.arrayify(bigNumList);
        // console.log("type of []: "+typeof([]) );
        // console.log("type of bigNum: "+typeof(bigNum) );
        // console.log("type of bibNumList: "+typeof(bigNumList) );
        // const test=ethers.BigNumber.from(7610032321);
        // const test2=[];
        // test2.push(test);
        const transaction=await contract.buyTickets(valuesBytes);
        // const transaction=await contract.buyTickets(test2);
        await transaction.wait();
        console.log("gas used: ", transaction.gasLimit.toString());

        // const view_your_tickets=await contract.viewTicketsOfAddress(AccAddress);
        // ticketIdList=
        // console.log("you have tickets: "+ view_your_tickets);
        // const ticketNumber666 = await contract.viewTicketNumber(bigNum);
        // console.log(" Check number: "+ticketNumber666);

    }




    //----------------------------------- useEffect --------------------------------------------
    // use to init.
    useEffect(() => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      if(ref.current.length===0){
        handleInit();
      }
      console.log(ref.current)
      const contract = new ethers.Contract(
        Address.LOTTO666_ADDRESS,
        // "0x610178dA211FEF7D417bC0e6FeD39F05609AD788", //Lotto666 contract address
        Lotto666.abi,
        signer
         );

         async function fetchData() {
            const price=await contract.ticketPrice();
            const Price=ethers.utils.formatEther(price);
            console.log("ticket price is: "+ Number(Price));
            setCost(Number(Price));
            console.log("is cost has been set?: "+cost);
        }

        fetchData();
    
    },[])

    // useEffect(() => {
    //     const contract = new ethers.Contract(
    //       // config.USD_TOKEN_ADDRESS,
    //       "0x610178dA211FEF7D417bC0e6FeD39F05609AD788", //Lotto666 contract address
    //       Lotto666.abi,
    //       signer
    //        );
  
    //        async function fetchData() {
    //           const price=await contract.ticketPrice();
    //           const Price=ethers.utils.formatEther(price);
    //           console.log("ticket price is: "+ Number(Price));
    //           setCost(Number(Price));
    //           console.log("is cost has been set?: "+cost);
    //       }
  
    //       fetchData();      
    //   })

    
    //----------------------------------------show on the screen -----------------------------
    // use to show all numbers(1-66).
    const show=()=>{
        for(let i=1;i<=number;i++){
            LotteryNumber.push(<TiCheckboxButton label={i} value={i} key={i} checked={ref.current[i-1]}  onchange={(e)=>handleList(e)}/>)
        }
        return LotteryNumber;        
    }

    // when the number of plays change,set the input state.
    const handleInputChange=(e)=>{
        // const input= e.target.value.replace(/\D/g, '');
        if(input>0){
          setInput(e.target.value); 
        }
        setMove(e.target.value);
        if(move>input){
            setInput(e.target.value);
        }
        
    }

    const FormType=()=>{
        return(
            <div>
                <h1>Buy a Ticket</h1>
                <h3> {cost} Ether per play</h3>
                <div>
                    <h2>Select 6 Numbers from Below: </h2>
                    {show()}
                </div>
                <label><span>Numbers of plays: </span> <input type='number' value={input} onChange={handleInputChange} /></label>
                <p>Total Pay: {cost*input} </p>
                <span>
                    <button onClick={(e)=>handleClear(e)}>Clear All</button>
                    <button disabled={NotallowClick.current} onClick={(e)=>handleBuy(e)} >Buy</button>
                    {/* <button>Back</button> */}
                    {/* <button onClick={(e)=>showNumList(e)}>check</button> */}
                </span>
            </div>
        )

    }
    
      return(
        // <>
        // <h1>Buy a Ticket</h1>
        // <h3>2 Ether per play</h3>
        // <div>
        //     <h2>Select 6 Numbers from Below: </h2>
        //     {show()}
        // </div>
        // <div>
        //     <span>
        //         <h2>Numbers of plays: </h2>
        //         <input type='number'></input>
        //     </span>
        // </div>
        // <div>
        // <span>
        //    <button onClick={(e)=>handleClear(e)}>Clear All</button>
        //    <button disabled={NotallowClick.current}  >Buy</button>
        //    {/* <button>Back</button> */}
        //    {/* <button onClick={(e)=>showNumList(e)}>check</button> */}
        //  </span>
        // </div>
        // </>
        <>
            {FormType()}
        </>
      )
    }

    

    export default NumberSelector;