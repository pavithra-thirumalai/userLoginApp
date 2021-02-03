import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

// This component displays Registration form with user details- username,password,phone,email

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
            mail: '',
            phone:'',
			password: ''
		};
		this.update = this.update.bind(this);
		this.displayLogin = this.displayLogin.bind(this);
	}

	update(e) {
		let name = e.target.name;
		let value = e.target.value;
		this.setState({
			[name]: value
		});
	}

	displayLogin(e) {
		e.preventDefault();
		console.log('You have successfully registered');
		console.log(this.state);
		this.setState({
			name: '',
            mail: '',
            phone:'',
			password: ''
        });
        e.preventDefault()
        let opts = {
			'name': this.state.name,
			'password': this.state.password,
			'email':this.state.mail,
			'phone':this.state.phone
        }
        console.log(JSON.stringify(opts))
        fetch('http://localhost:5000/register', {
        method: 'post',
        body: JSON.stringify(opts)
        }).then(r => r.json()).then(res => {
			console.log("Registered successfully")
			toast.success('Registered successfull') 
		})
        
	}

	render() {
		return (
			<div className="register">
				<form onSubmit={this.displayLogin}>
					<h2>Register</h2>

					<div className="name">
						<input
							type="text"
							placeholder="Name"
							name="name"
							value={this.state.name}
							onChange={this.update}
						/>
					</div>

					<div className="email">
						<input
							type="text"
							placeholder="Enter your email"
							name="mail"
							value={this.state.mail}
							onChange={this.update}
						/>
					</div>
                    <div className="email">
						<input
							type="text"
							placeholder="Enter your phone"
							name="phone"
							value={this.state.phone}
							onChange={this.update}
						/>
					</div>
					<div className="pasword">
						<input
							type="password"
							placeholder="Password"
							name="password"
							value={this.state.password}
							onChange={this.update}
						/>
					</div>
					<input type="submit" value="Register" />
				</form>
				<Link to="/">Login Here</Link>
			</div>
		);
	}
}

export default Register;