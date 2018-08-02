import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
    render() {
        let { current } = this.props;
        return (
            <footer>
                <ul>
                    <li className={ current === 'purchases' ? 'selected' : '' }>
                        <Link to="/">
                            <img src="/img/list.svg" alt="Purchases" />
                        </Link>
                    </li>
                    <li className={ current === 'add' ? 'selected' : '' }>
                        <Link to="/add">
                            <img src="/img/add.svg" alt="Add a thing" />
                        </Link>
                    </li>
                </ul>
            </footer>
        );
    }
}

export default Footer;
