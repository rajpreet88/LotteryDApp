import React, {useEffect, useState} from 'react';
import './Manager.css';

const Manager = ({state}) => {
    const [account, setAccount] = useState('');
    const [contractBalance, setContractBalance] = useState(0);
    const [lotteryWinner, setLotteryWinner] = useState('No winner yet');


    //to auto reload the new account everytime we select a new account we will be using a listener function provided my metamask to fetch the new account address
    const setAccountListener = (provider)=>{
        provider.on('accountsChanged',(accounts)=>{
            setAccount(accounts[0]);
        })
    }

    useEffect(()=>{

        const getManagerAccount = async()=>{
            const  {web3}= state;
            const allAccounts = await web3.eth.getAccounts();
            console.log(allAccounts);
            setAccountListener(web3.givenProvider);// call the listener function for auto reload
            setAccount(allAccounts[0]); //initial Manager Account
        }

        state.web3 && getManagerAccount();
    },[state,state.web3] )

    //Now lets get the balance of the contract/manager account who has deployed this contract
    const getContractBalance = async ()=>{
        const { contract } = state;
        try{// we need to put a check that only the manager can check the contract balance as per the original contract logic
            
            const balance = await contract.methods.getBalance().call({from:account});  // the getBalance function is called from Lottery.sol contract
            console.log(balance);
            setContractBalance(balance); // set the contract balance from the balance fetched
        }catch(e){
            console.log('You are not the Manager')
            setContractBalance('You are not the Manager')
        }
    }

    //This function select a winner while also handling the missing required logic if any.
    const winnerLottery = async ()=>{
        const { contract } = state;
        try{

            //since we are changing the state of a varibale in the blockchain we will use send method to get the winner's address
            await contract.methods.pickWinner().send({from:account});

            //Call the default getter function for public state variable 'winner' which get auto created for state variable in solidity
            const lotWinner = await contract.methods.winner().call();
            console.log(lotWinner);
            setLotteryWinner(lotWinner);
        }catch(e){
            if(e.message.includes("You are not the manager")){
                console.log("You are not the manager")
                setLotteryWinner("You are not the manager");
            }
            else if(e.message.includes("Players are less than 3")){
                console.log("Players are less than 3")
                setLotteryWinner("Players are less than 3");
            }
            else{
                console.log('No winner yet')
                setLotteryWinner('No winner yet')
            }
        }
    }


    return(
    <>
        <div className='container position-absolute top-50 start-50 translate-middle'>
            <div className='container center border border-4 broder-dark rounded-3'>
                <ul className="list-group my-lg border-primary">
                    <li className="list-group-item text-center mt-auto">
                        <h5>Connected/Manager Account: <b className='text-success'>{account}</b></h5>
                    </li>
                    <li className="list-group-item">
                        <h5>Contract Balance: <b className='text-primary'>{contractBalance} ETH</b></h5>
                        <button className='btn btn-success justify-content-center' onClick={getContractBalance}>Click here for Contract Balance</button>
                    </li>
                    <li className="list-group-item">
                        <h5>Lottery Winner: <b className='text-secondary'>{lotteryWinner}</b></h5>
                        <button className='btn btn-primary justify-content-center' onClick={winnerLottery}>Click here for Winner</button>
                    </li>
                </ul>

                
                
                {/* <button className='btn btn-success justify-content-center' onClick={getContractBalance}>Click here for Contract Balance</button> */}
                <br/>
                
                {/* <button className='btn btn-primary justify-content-center' onClick={winnerLottery}>Click here for Winner</button> */}
            
            </div>
        </div>
        {/* <h3>Connected/Manager Account: <b className='success'>{account}</b></h3>
        <br/>
        <h3>Contract Balance: {contractBalance}</h3>
        <button className='btn btn-success justify-content-center' onClick={getContractBalance}>Click here for Contract Balance</button>
        <br/>
        <h3>Lottery Winner: {lotteryWinner}</h3>
        <button className='btn btn-primary justify-content-center' onClick={winnerLottery}>Click here for Winner</button> */}
    </>
    )
}

export default Manager
