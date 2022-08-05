import React from 'react'
import { Button, Col, Container, Grid, Icon, Panel, Row,Alert } from 'rsuite'
import { auth, database } from '../misc/firebase'
import firebase from "firebase/app"

const Signin = () => {
    const signIn =async (provider) => {
        try {
            const {additionalUserInfo,user} = await auth.signInWithPopup(provider);
            if(additionalUserInfo.isNewUser){
                await database.ref(`/profiles/${user.uid}`).set({
                    name:user.displayName,
                    createdAt:firebase.database.ServerValue.TIMESTAMP
                })
            }
            Alert.success("Signed In",4000);
        } catch (error) {
            Alert.error(error.message,4000)
        
        }
    }
    const onFacebookSignIn = () => {
        signIn( new firebase.auth.FacebookAuthProvider())
    }
    const onGoogleSignIn = () => {
        signIn(new firebase.auth.GoogleAuthProvider())
    }
  return (
    <Container>
        <Grid className='mt-page'>
            <Row>
                <Col xs={24} md={12} mdOffset={6}>
                    <Panel>
                        <div className="text-center">
                            <h2>Welcome to Chat</h2>
                            <p>Progressive chat platform for users</p>
                        </div>
                        <div className="mt-3">
                            <Button block color='blue' onClick={onFacebookSignIn}>
                                <Icon icon={"facebook"} />Continue with Facebook
                            </Button>
                            <Button block color='green' onClick={onGoogleSignIn} >
                                <Icon icon={"google"} />Continue with Google
                            </Button>
                        </div>
                    </Panel>
                </Col>
            </Row>
        </Grid>
    </Container>
  )
}

export default Signin