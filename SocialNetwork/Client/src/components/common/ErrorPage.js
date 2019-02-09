import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import BackButton from './BackButtonWithProps';
// import BackButton from './BackButtonWithContext';
// import softUniLogo from '../../picks/softuniLogo.PNG';
import socialMedia from '../../picks/Social_Media.jpg';


export default class ErrorPage extends Component {
    constructor(props) {
        super(props)
    }

    render = () => (
        <div className="container text-center">
            <h1>This page isn't available</h1>

            <h3>The link you followed may be broken, or the page may have been removed.</h3>

            <div className="mt-5" >
                <img src={socialMedia} alt="SoftUni lofo"/>
            </div>
            

            <div className="text-center mt-5">

             {/* <BackButton
                    text="Go back with context"
                    class="btn App-button-primary btn-lg m-3"
                   
                /> */}

                <BackButton
                    text="Go back to the previous page"
                    class="btn App-button-primary btn-lg m-3"
                    {...this.props}
                />

                <NavLink
                    className="btn App-button-primary btn-lg m-3"
                    to="/"
                    role="button">
                    Go to Home
                </NavLink>
            </div>


        </div>
    )
}
