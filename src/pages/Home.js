import logo from "../logo.svg";
import React from "react";

export const Home = (props) => {
    const onChange = (e) => {
        window.fin.InterApplicationBus.publish('topic', e.target.value)
            .then(() => console.log('Published')).catch(err => console.log(err));
    };

    const saveSnapshot = async () => {
        if(window.fin) {
            const platform = await window.fin.Platform.getCurrent();
            const mySnapshot = await platform.getSnapshot();
            window.localStorage.setItem('snapshot', JSON.stringify(mySnapshot));
            alert("Snapshot Saved");
        }
    };

    if (window.fin) {
        props.applySnapShot();
    }

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
                <button
                    className="App-button"
                    onClick={saveSnapshot}
                >
                    Save Snapshot
                </button>
                <input className="App-input-text" type="text" onChange={onChange} placeholder="Type here"/>
            </header>
        </div>
    );
};
