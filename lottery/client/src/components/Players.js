import React, {useState,useEffect} from 'react';

const Players = ({state, address}) => {
    const [paccount, setPAccount] = useState("No account connected")
    const [registeredPlayers, setRegisteredPlayers] = useState([]);
    const [reload, setReload] = useState(false);

    //auto reload the addresses of the regsitered players once they send >= 1 ether successfully
    const reloadRegisteredPlayers = ()=>{
        setReload(!reload); // toggling to reload addresses if not loaded and vice-versa
    }

     //to auto reload the new account everytime we select a new account we will be using a listener function provided my metamask to fetch the new account address
     const setPlayersAccountListener = (provider)=>{
        provider.on('accountsChanged',(paccounts)=>{
            setPAccount(paccounts[0]);
        })
    }


    //to get the accounts connected to Metamask
    useEffect(()=>{

        const getAccounts = async ()=>{
            const {web3} = state;
            const paccounts = await web3.eth.getAccounts();
            
            setPAccount(paccounts[0]);
            setPlayersAccountListener(web3.givenProvider)
        }
        
        state.web3 && getAccounts();

    }, [state, state.web3])


//to get all the registered players who have participated in the Lottery using allPlayers function in Lottery.sol
useEffect(()=>{

    const getPlayers = async ()=>{
        const { contract } = state;
        const players = await contract.methods.allPlayers().call(); // players is an array which will have all the players participating in the lottery
        console.log(players);
        //we need to map the players to get the registered players by resolving promise
        const regPlayers = await Promise.all(players.map((all_players)=>{
            return all_players;}))
        console.log(regPlayers);
        setRegisteredPlayers(regPlayers);
        reloadRegisteredPlayers();// reload the new registered addresses
    
    }

    state.contract && getPlayers();
},[state, state.contract, reload])

  return (
    <>
        <div className='container position-absolute top-50 start-50 translate-middle'>
            <div className='container border border-4 broder-dark rounded-3'>
                <ul className="list-group my-lg border-primary">
                    <li className="list-group-item text-center mt-auto">
                        <h5>Connected Account: <b className='text-success'>{paccount}</b></h5>
                    </li>
                    <li className="list-group-item">
                        <h5>Players please pay atleast 1 ether on this contract address: <b className='text-primary'>{address}</b></h5>
                    </li>
                    <li className="list-group-item">
                        <h5>Registered Players: <b className='text-secondary'>{registeredPlayers.length !== 0 && registeredPlayers.map((name)=>(<p key={name}>{name}</p>))}</b></h5>
                    </li>
                </ul>

                
                
                {/* <button className='btn btn-success justify-content-center' onClick={getContractBalance}>Click here for Contract Balance</button> */}
                <br/>
                
                {/* <button className='btn btn-primary justify-content-center' onClick={winnerLottery}>Click here for Winner</button> */}
            
            </div>
        </div>
    </>)
  
}

export default Players
