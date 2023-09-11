import React, { useState } from "react"
import { useMutation } from "@apollo/client"

import { EDIT_NUMBER, ALL_PERSONS } from "../queries"

const PhoneForm = ({setError}) => {

	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')

	const [changeNumber] = useMutation(EDIT_NUMBER, {
		refetchQueries: [{query: ALL_PERSONS }],
		onError: (error) => {
			const message = error.graphQLErrors[0].message
			setError(message)
		}
	})

	const submit = (event) => {

		event.preventDefault()

		changeNumber({variables: {name, phone}})

		setName('')
		setPhone('')

	}

	return (
		<div>
			<h2>Change Number</h2>
			<form onSubmit={submit}>
				<div>
					Name: 
					<input 
						value={name} 
						onChange={({target}) => setName(target.value)} 
					/>
				</div>
				<div>
					Phone: 
					<input 
						value={phone} 
						onChange={({target}) => setPhone(target.value)} 
					/>
				</div>
				<button type="submit">Change Number</button>
			</form>
		</div>
	)

}

export default PhoneForm