import React from 'react';
import { AuthContext } from '../AuthContexts/AuthContexts';

const AuthProvider = ({children}) => {

    const userInfo ={
        
    }

    return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
};

export default AuthProvider;