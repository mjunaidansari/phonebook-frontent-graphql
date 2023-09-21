import React, { useEffect, useState } from "react"
import {useApolloClient, useQuery} from '@apollo/client'

import Notify from "./components/Notify"
import Persons from './components/Persons'
import PersonForm from "./components/PersonForm"
import PhoneForm from "./components/PhoneForm"
import LoginForm from "./components/LoginForm"

import { ALL_PERSONS } from "./queries"

const App = () => {

	const [token, setToken] = useState(null)

	const [errorMessage, setErrorMessage] = useState(null)

	const result = useQuery(ALL_PERSONS)

	const client = useApolloClient()

	const notify = (message) => {
		setErrorMessage(message)
		setTimeout(() => {
			setErrorMessage(null)
		}, 5000)
	}

	if (!token) {
		return (
			<div>
				<Notify errorMessage={errorMessage}/>
				<h2>Login</h2>
				<LoginForm 
					setToken = {setToken}
					setError = {notify}
				/>
			</div>
		)
	}

	const logout = () => {
		setToken(null)
		localStorage.clear()
		client.resetStore()
	}

	if (result.loading) {
		return <div>Loading...</div>
	}


	return (
		<div>
			<Notify errorMessage={errorMessage}/>
			<button onClick={logout}>Logout</button>
			<Persons persons = {result.data.allPersons} />
			<PersonForm setError={notify}/>
			<PhoneForm setError={notify}/>
		</div>
	)

}

export default App