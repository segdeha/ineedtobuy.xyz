import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import localForage from 'localforage';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: ''
        };
    }

    componentDidMount() {
        localForage.getItem('intb-token')
            .then(token => {
                if (token) {
                    this.setState({ token: token.replace(/\s/g, '+') });
                }
            })
            .catch(console.log);
    }

    render() {
        let { token } = this.state;
        let className = token ? 'show' : 'hide';
        let smsMsg = encodeURI(`Share my shopping list on iNeedToBuy.xyz!\n\nhttps://app.ineedtobuy.xyz/?token=${token}`);
        return (
            <header>
                <Link className="header-link" to="/" />
                <a className={`share-link ${className}`} href={`sms:?&body=${smsMsg}`} />
            </header>
        );
    }
}

export default Header;
