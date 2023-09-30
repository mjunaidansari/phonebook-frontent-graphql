import React, { useEffect, useState } from "react"
import {useApolloClient, useQuery, useMutation, useSubscription} from '@apollo/client'

import Notify from "./components/Notify"
import Persons from './components/Persons'
import PersonForm from "./components/PersonForm"
import PhoneForm from "./components/PhoneForm"
import LoginForm from "./components/LoginForm"

import { ALL_PERSONS, PERSON_ADDED } from "./queries"

// function that takes care of manipulatig cache
export const updateCache = (cache, query, addedPerson) => {

	// helper that is used to eliminate saving same person twice
	const uniqueByName = (a) => {
		let seen = new Set()
		return a.filter((item) => {
			let k = item.name
			return seen.has(k) ? false : seen.add(k)
		})
	}

	cache.updateQuery(query, ({ allPersons }) => {
		return {
			allPersons: uniqueByName(allPersons.concat(addedPerson))
		}
	})

}

const App = () => {

	const [token, setToken] = useState(null)

	const [errorMessage, setErrorMessage] = useState(null)

	const result = useQuery(ALL_PERSONS)

	const client = useApolloClient()

	useEffect(() => {
		const userToken = localStorage.getItem('phonenumbers-user-token')
		if(userToken)
			setToken(userToken)
	}, [])

	const notify = (message) => {
		setErrorMessage(message)
		setTimeout(() => {
			setErrorMessage(null)
		}, 5000)
	}

	useSubscription(PERSON_ADDED, {
		onData: ({data}) => {
			const addedPerson = data.data.personAdded
			notify(`${addedPerson.name} Added`)
			updateCache(client.cache, { query: ALL_PERSONS }, addedPerson)
		}
	})

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