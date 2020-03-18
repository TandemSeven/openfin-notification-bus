import React, {Component} from "react";

export class About extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        };

        window.fin.InterApplicationBus.subscribe({ uuid: '*' }, 'topic', sub_msg => this.updateText(sub_msg))
            .then(() => console.log('Subscribed to *')).catch(err => console.log(err));
    }

    updateText = (text) => {
        this.setState({ text })
    };


    render () {
        return (
            <h2>{this.state.text}</h2>
        );
    }
}
