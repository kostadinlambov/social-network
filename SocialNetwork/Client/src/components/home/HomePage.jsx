import React, { Component, Fragment, lazy, Suspense } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { withRootAuthorization, withAdminAuthorization, withUserAuthorization } from '../../hocs/withAuthorization';
import { toast } from 'react-toastify';
import { ToastComponent } from '../common'
import { requester } from '../../infrastructure/'

import TimeLine from './TimeLine';
import HeaderSection from './HeaderSection';
import MainSharedContent from './MainSharedContent';
import Intro from './Intro';
import PhotoGallery from './PhotosGallery';
import FriendsGallery from './FriendsGallery';
import userService from '../../infrastructure/userService';

import placeholder_user_image from '../../assets/images/placeholder-profile-male.jpg'
import default_background_image from '../../assets/images/default-background-image.jpg'

const UserSearchResultsPage = lazy(() => import('../../components//user/UserSearchResultsPage'))
const UserProfilePage = lazy(() => import('../../components/user/UserProfilePage'))
const UserFriendsPage = lazy(() => import('../../components/user/UserFriendsAllPage'))
const UserFindFriendsPage = lazy(() => import('../../components/user/UserFindFriendsPage'))
const UserAllPage = lazy(() => import('../../components/user/UserAllPage'))
const UserEditPage = lazy(() => import('../../components/user/UserEditPage'))
const UserDeletePage = lazy(() => import('../../components/user/UserDeletePage'))
const UserGalleryPage = lazy(() => import('../../components/user/UserGalleryPage'))

const ErrorPage = lazy(() => import('../../components/common/ErrorPage'))

export default class HomePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: '',
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            profilePicUrl: placeholder_user_image,
            backgroundImageUrl: default_background_image,
            authorities: [],
            ready: false
        }

        this.getUserToShowId = this.getUserToShowId.bind(this);
    }

    componentDidMount() {
        // const currentUserId = userService.getUserId(); 
        // const paramId = this.props.match.params.id;
        // // const userId = this.props.match.params.id;

        // console.log(' this.props: ', this.props);
        // console.log('paramId: ', paramId);
        // console.log('currentUserId: ', currentUserId);
        // debugger;
        // requester.get(`/users/details/${currentUserId}`, (userData) => {
        //     this.setState({
        //         ...userData, ready: true
        //     })
        // }).catch(err => {
        //     console.error('deatils err:', err)
        //     toast.error(<ToastComponent.errorToast text={`Internal Server Error: ${err.message}`} />, {
        //         position: toast.POSITION.TOP_RIGHT
        //     });

        //     if (err.status === 403 && err.message === 'Your JWT token is expired. Please log in!') {
        //         localStorage.clear();
        //         this.props.history.push('/login');
        //     }
        // })
    }

    getUserToShowId(getUserToShowId) {
        debugger;
        console.log(' getUserToShowId: ', getUserToShowId);

        if(getUserToShowId === this.state.id){

        }

        requester.get(`/users/details/${getUserToShowId}`, (userData) => {
            this.setState({
                ...userData, ready: true
            })

            if (userData.error) {
                // toast.error(<ToastComponent.errorToast text={userData.message} />, {
                //     position: toast.POSITION.TOP_RIGHT
                // });
                this.props.history.push("/");
            } 
            debugger;
        }).catch(err => {
            console.error('deatils err:', err)
            toast.error(<ToastComponent.errorToast text={`Internal Server Error: ${err.message}`} />, {
                position: toast.POSITION.TOP_RIGHT
            });

            if (err.status === 403 && err.message === 'Your JWT token is expired. Please log in!') {
                localStorage.clear();
                this.props.history.push('/login');
            }
        })


    }


    render() {
        // if (!this.state.ready) {
        //     // return <h1 className="text-center pt-5 mt-5">Loading...</h1>
        //     return null;
        // }
        console.log(this.props.match.url)
        const loggedIn = localStorage.getItem('token');
        const userToShowId = this.props.match.params;

        console.log('loggedIn: ', loggedIn);
        console.log('userToShowId: ', userToShowId);
        debugger;

        return (
            <Fragment>
                <HeaderSection  {...this.state} />
                <main className="site-content">
                    {/* <div className="container"> */}
                    <section className="main-section">
                    <TimeLine {...this.state} />
                        <Suspense fallback={<h1 className="text-center pt-5 mt-5">Fallback Home Loading...</h1>}>
                            <Switch>
                                {loggedIn && <Route exact path="/home/comments/:id" render={props => <MainSharedContent {...props} {...this.state} getUserToShowId={this.getUserToShowId} />} />}
                                {loggedIn && <Route exact path="/home/profile/:id" render={props => <UserProfilePage {...props} getUserToShowId={this.getUserToShowId} {...this.state} />} />}
                                {loggedIn && <Route exact path="/home/friends/:id" component={UserFriendsPage} />}
                                {loggedIn && <Route exact path="/home/findFriends/:id/:category?" component={UserFindFriendsPage} />}
                                {loggedIn && <Route exact path="/home/users/edit/:id" render={props => <UserEditPage {...props} getUserToShowId={this.getUserToShowId} {...this.state} />}/>}
                                {loggedIn && <Route exact path="/home/users/delete/:id" render={props => <UserDeletePage {...props} getUserToShowId={this.getUserToShowId} {...this.state} />} />}
                                {loggedIn && <Route exact path="/home/users/all/:id" render={props => <UserAllPage {...props} getUserToShowId={this.getUserToShowId} {...this.state} />}/>}
                                {loggedIn && <Route exact path="/home/users/search" component={withUserAuthorization(UserSearchResultsPage)} />}
                                {loggedIn && <Route exact path="/home/gallery/:id" component={withUserAuthorization(UserGalleryPage)} />}

                                <Route exact path="/error" component={ErrorPage} />
                                <Route component={ErrorPage} />
                            </Switch>
                        </Suspense >
                    </section>

                    {this.state.ready &&
                        <Fragment>
                            <section className="aside-section">
                                <Intro {...this.state} />
                                <PhotoGallery {...this.state} />
                                <FriendsGallery userId={this.state.id} />
                                </section>
                        </Fragment>
                    }


                </main>
            </Fragment>

        );
    }
}
