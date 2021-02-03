from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
import os
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY']='Th1s1ss3cr3t'
app.config['SQLALCHEMY_DATABASE_URI']=f"sqlite:///{os.path.join(os.getcwd(), 'testDB.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)

#Users Table schema
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.Integer)
    name = db.Column(db.String(50))
    password = db.Column(db.String(50))
    mail = db.Column(db.String(50))
    phone = db.Column(db.Integer)
    admin = db.Column(db.Boolean)

#Create table users with required columns
with app.app_context():
    db.create_all()

#decorator definition for protecting API methods
def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):

      token = None

      if 'x-access-tokens' in request.headers:
         token = request.headers['x-access-tokens']

      if not token:
         return jsonify({'message': 'a valid token is missing'})

      try:
         data = jwt.decode(token, app.config[SECRET_KEY])
         current_user = Users.query.filter_by(public_id=data['public_id']).first()
      except:
         return jsonify({'message': 'token is invalid'})
      return f(current_user, *args, **kwargs)
   return decorator

#Route to enter the user details fetched from frontend into database
@app.route('/register', methods=['GET', 'POST'])
@cross_origin()
def signup_user():
    data = request.get_json(force=True)
    print(data)
    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = Users(public_id=str(uuid.uuid4()), name=data['name'], password=hashed_password,
                     phone=data['phone'], mail=data['email'], admin=False)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'registered successfully'})

#Route to validate login credentials
@app.route('/login', methods=['GET', 'POST'])
@cross_origin()
def login_user():
    data = request.get_json(force=True)
    username = data.get('username', None)
    password = data.get('password', None)
    print("username:{} password:{}".format(username,password))
    if not username or not password:
        return jsonify({'message': 'No username or password entered'})

    user = Users.query.filter_by(name=username).first()

    if check_password_hash(user.password, password):
        token = jwt.encode(
            {'public_id': user.public_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)},
            app.config['SECRET_KEY'])
        print("token", token)
        return jsonify({'token': token})

    return jsonify({'message':'Incorrect username or password entered'})

#Route to update password
@app.route('/password', methods=['GET', 'POST'])
@cross_origin()
def password_update():
    data = request.get_json(force=True)
    username = data.get('username', None)
    oldpassword = data.get('oldpassword', None)
    hashed_password = generate_password_hash(data['newpassword'], method='sha256')
    if not username or not oldpassword:
        return jsonify({'message': 'No username or password entered'})

    user = Users.query.filter_by(name=username).first()

    if check_password_hash(user.password, oldpassword):
        token = jwt.encode(
            {'public_id': user.public_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)},
            app.config['SECRET_KEY'])
        user.name=username
        user.password=hashed_password
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Password changed successfully'})

    return jsonify({'message':'Incorrect username or password entered'})

# Sample secure API based on user authentication and authorisation
@app.route('/sample', methods=['POST', 'GET','PUT'])
@token_required
def sample_api(current_user):
    """
        A protected endpoint. The token_required decorator will require a header
        containing a valid JWT(x-access-tokens:<your token>)

        """
    return jsonify({'message': f'protected endpoint allowed user {current_user}'})

# Run the example
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)