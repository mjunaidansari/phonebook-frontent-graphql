import { useState, useEffect } from "react"
import { selectHttpOptionsAndBody, useMutation } from "@apollo/client"
import { LOGIN } from '../queries'

const LoginForm = ({setToken, setError}) => {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [login, result] = useMutation(LOGIN, {
		onError: (error) => {
			setError(error.graphQLErrors[0].errors.error)
			// setError(error.graphQLErrors[0])
		}
	})

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value 
			setToken(token)
			console.log(token)
			localStorage.setItem('phonenumbers-user-token', token)
		}
	}, [result.data]) //eslint-disable-line

	const submit = async (event) => {
		event.preventDefault()
		login({variables: {username, password}})
	}

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					Username: <input value = {username} onChange={ ({target}) => setUsername(target.value) }/>
				</div>
				<div>
					Username: <input type='password' value = {password} onChange={ ({target}) => setPassword(target.value) }/>
				</div>
				<button type="submit">Login</button>
			</form>
		</div>
	)

}

export default LoginForm