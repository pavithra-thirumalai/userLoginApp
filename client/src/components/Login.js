import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

// This component displays the login form with username and password fields

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
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
		console.log('You are logged in');
		console.log(this.state);
		this.setState({
			username: '',
			password: ''
        });
        e.preventDefault()
        let opts = {
        'username': this.state.username,
        'password': this.state.password
        }
        console.log(opts)
        fetch('http://localhost:5000/login', {
        method: 'post',
        body: JSON.stringify(opts)
        }).then(r => r.json())
        .then(res => {
            if (res['message']=="Incorrect username or password entered"){
				console.log(res['message'])
				toast.error('Incorrect username or password entered')           
            }
            else if(res['message']=="No username or password entered"){
				toast.error('No username or password entered')           
			}
			else {
				console.log("Logged In successfully")
				toast.success('Login successfull') 
            }
        })
	}

	render() {
		return (
			<div className="login">
				<form onSubmit={this.displayLogin}>
					<h2>Login</h2>
					<div className="username">
						<input
							type="text"
							placeholder="Username..."
							value={this.state.username}
							onChange={this.update}
							name="username"
						/>
					</div>

					<div className="password">
						<input
							type="password"
							placeholder="Password..."
							value={this.state.password}
							onChange={this.update}
							name="password"
						/>
					</div>

					<input type="submit" value="Login" />
				</form>

				<Link to="/register">Create an account</Link><br></br>
                <Link to="/changepassword">Update Password</Link>
			</div>
		);
	}
}

export default Login;