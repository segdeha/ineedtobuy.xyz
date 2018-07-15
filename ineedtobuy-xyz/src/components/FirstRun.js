import React, { Component } from 'react';

class FirstRun extends Component {
    constructor(props) {
        super(props);

        // control the input element
        this.state = {
            tokenValue: ''
        };
    }

    render() {
        let { onChange, onNext } = this.props;

        return (
            <main>
                <h1>Welcome to iNeedToBuy.xyz!</h1>
                <p>Have a token? Add it below. Otherwise, click “Next” to get started.</p>
                <form onSubmit={onNext}>
                    <label>
                        Token: <input type="text" name="intb-token" onChange={onChange} value={this.state.tokenValue} placeholder="fancy toad licorice" />
                    </label>
                    <p>
                        <button onClick={onNext}>Next</button>
                    </p>
                </form>
            </main>
        );
    }
}

export default FirstRun;
