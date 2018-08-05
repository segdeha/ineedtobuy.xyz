import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        let { token } = this.props;
        let className = token ? 'show' : 'hide';
        let smsMsg = encodeURI(`Share my shopping list on iNeedToBuy.xyz!\n\nhttps://app.ineedtobuy.xyz/?token=${token}`);
        return (
            <header>
                <Link className="header-link" to="/" />
                <Link className="back-link" to="/" />
                <Link className="help-link" to="/help" />
                <a className={`share-link ${className}`} href={`sms:?&body=${smsMsg}`} />
            </header>
        );
    }
}

export default Header;
