import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';

class FirstRun extends Component {
    constructor(props) {
        super(props);

        this.state = {
            manualReferral: false
        };

        this.onManualReferral = this.onManualReferral.bind(this);
    }

    onManualReferral(evt) {
        evt.preventDefault();
        this.setState({
            manualReferral: true
        });
    }

    render() {
        let { onChange, onNext, onClear, tokenValue, referral } = this.props;
        let { manualReferral } = this.state;

        let buttonText, instructions, secondary_instructions, inputType, inputDisabled;

        if (referral) {
            buttonText = 'Join shopping list';
            instructions = (
                <Fragment>
                    <p>Looks like someone asked you to join their shopping list.</p>
                    <p>Tap “Join shopping list” to get started.</p>
                </Fragment>
            );
            secondary_instructions = (
                <p className="secondary-text">You can also <Link onClick={onClear} to="/">create a new shopping list</Link>.</p>
            );
            inputType = 'text';
            inputDisabled = true;
        }
        else if (manualReferral) {
            buttonText = 'Join shopping list';
            instructions = (
                <Fragment>
                    <p>Enter your share code below. Then tap “Join shopping list” to get started.</p>
                </Fragment>
            );
            secondary_instructions = (
                <p className="secondary-text">You can also <Link onClick={onClear} to="/">create a new shopping list</Link>.</p>
            );
            inputType = 'text';
            inputDisabled = false;
        }
        else {
            buttonText = 'Create shopping list';
            instructions = (
                <Fragment>
                    <p>Tap “Create shopping list” to get started.</p>
                </Fragment>
            );
            secondary_instructions = (
                <p className="secondary-text">You can also <a onClick={this.onManualReferral}>join an existing shopping list</a>.</p>
            );
            inputType = 'hidden';
            inputDisabled = false;
        }

        return (
            <main className="first-run full-viewport container">
                <Header />
                <section>
                    <form className="card" onSubmit={onNext}>
                        <input type="hidden" name="intb-manual-referral" value={ manualReferral ? 1 : 0 } />
                        <h1>Welcome to your smart shopping list!</h1>
                        {instructions}
                        <label>
                            <input type={inputType} disabled={inputDisabled} name="intb-token" onChange={onChange} value={tokenValue} required placeholder="Share Code" autoCapitalize="none" />
                        </label>
                        <p>
                            <button onClick={onNext}>{buttonText}</button>
                        </p>
                        {secondary_instructions}
                    </form>
                </section>
            </main>
        );
    }
}

export default FirstRun;
