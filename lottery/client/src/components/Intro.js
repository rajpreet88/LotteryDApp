import React from 'react';
import { Link } from 'react-router-dom';
import './Intro.css';

const Intro = () => {
  return (
    <>
        <ul className="list-group" id="list">
        <div className="center">
          <li className="list-group-item" aria-disabled="true">
            <h1>You are</h1>
          </li>
          <li className="list-group-item">
            <Link to="/manager" className="text-decoration-none text">
              <button className="button1 rounded-3">Manager</button>
            </Link>

            <Link to="/players" className="text-decoration-none text">
              <button className="button1 rounded-3 player">Player</button>
            </Link>
          </li>
        </div>
      </ul>
        {/* <h1 className='justify-content-center'>You are</h1>
        <Link to='/manager'>
            <button className='btn btn-primary'>Manager</button>
        </Link>
        <br/>
        <Link to='/players'>
            <button className='btn btn-primary'>Players</button>
        </Link> */}
    </>
  )
}

export default Intro