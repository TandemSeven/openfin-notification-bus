import logo from "../logo.svg";
import React from "react";

export const Home = (props) => {
    const onChange = (e) => {
        window.fin.InterApplicationBus.publish('topic', e.target.value).then(() => console.log('Published')).catch(err => console.log(err));
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <button
                    className="App-button"
                    onClick={props.notify}
                >
                    Notification
                </button>
                <input className="App-input-text" type="text" onChange={onChange} placeholder="Type here"/>
            </header>
        </div>
    );
}
