import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

// This component used to display suername,old password,new password 
// fields allowing user to update the password

class Password extends Component {
	constructor(props) {
		super(props);
        this.state = {
            username:'',
			oldpassword: '',
			newpassword: ''
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
		console.log('Password Changed Successfully');
		console.log(this.state);
		this.setState({
            username:'',
			oldpassword: '',
			newpassword: ''
        });
        e.preventDefault()
        let opts = {
        'username':this.state.username,
        'oldpassword': this.state.oldpassword,
        'newpassword': this.state.newpassword
        }
        console.log(opts)
        fetch('http://localhost:5000/password', {
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
				console.log("Password updated successfully")
				toast.success('Password Updated successfully') 
            }
        })
        
	}

	render() {
       
		return (
			<div className="login">
				<form onSubmit={this.displayLogin}>
					<h2>Change Password</h2>
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
							placeholder="Old Password..."
							value={this.state.oldpassword}
							onChange={this.update}
							name="oldpassword"
						/>
					</div>

					<div className="password">
						<input
							type="password"
							placeholder="New Password..."
							value={this.state.newpassword}
							onChange={this.update}
							name="newpassword"
						/>
					</div>
					<input type="submit" value="Change Password" />
				</form>		
				<Link to="/">Login Here</Link>		
			</div>
		);
	}
}

export default Password;