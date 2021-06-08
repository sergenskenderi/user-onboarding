import React, { useState , useEffect } from "react";
import {Button, Form} from "react-bootstrap";
import "./formGroup.css";
import * as yup from "yup";
import axios from "axios";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const formSchema = yup.object().shape({
    name : yup.string().required("Full Name is required!"),
    email: yup.string().email("Please enter a valid email").required("Email is required").notOneOf(["waffle@syrup.com"] , "That email is already taken"),
    password : yup.string().min(8).required("Password is required"),
    terms: yup.boolean().oneOf([true], "Please agree to terms of use"),
    role : yup.string().required("Please select the role of user"),
    country : yup.string().required("Please enter your country"),
    birthday : yup.date().required("Please enter your birthday"),
    news: yup.boolean()
});

function FormGroup(){
    const [formState , setFormState] = useState({
        name : "",
        email : "",
        password : "",
        terms : false,
        role : "",
        country : "",
        birthday : "",
        news : false
    })

    const [errors , setErrors] = useState({
        name : "",
        email : "",
        password : "",
        terms : "",
        role : "",
        country : "",
        birthday : "",
        news : ""
    })

    const [users , setUsers] = useState([]);

    const [disabled , setDisabled ] = useState(true);

    useEffect( () => {
        formSchema.isValid(formState).then( (valid) => {
            setDisabled(!valid);
        })
    },[formState]);

    const validateChange = (e) => {
        if(e.target.type === "checkbox"){
        yup.reach(formSchema , e.target.name) 
        .validate(e.target.checked)
        .then( (valid) => {
            setErrors({
                ...errors, [e.target.name] : ""
            });
        })
        .catch( (err) => {
            setErrors({
                ...errors, [e.target.name] : err.errors[0]
            });
        });
        }else{
        yup.reach(formSchema , e.target.name) 
        .validate(e.target.value)
        .then( (valid) => {
            setErrors({
                ...errors, [e.target.name] : ""
            });
        })
        .catch( (err) => {
            setErrors({
                ...errors, [e.target.name] : err.errors[0]
            });
        });
        }
    }


    const fieldChange = (e) =>{
        e.persist();
        const newFormData = {
            ...formState , [e.target.name] : e.target.type === "checkbox" ? e.target.checked : e.target.value
        }
        validateChange(e);
        setFormState(newFormData);
    }


    const formSubmit = (e) => {
        e.preventDefault();
        axios.post("https://reqres.in/api/users", formState)
        .then( (response) => {
            console.log("succes" , response.data);
            setUsers(
                [...users ,response.data] 
            );
            setFormState({
                name : "",
                email : "",
                password : "",
                terms : false,
                role : "",
                country : "",
                birthday : "",
                news : false
            });
        }).catch( (error) => {
            console.log(error.res);
        })
    }

    return(
        <div className="mainForm">
        <AccountCircleIcon className="mainIcon" />
        <Form onSubmit={formSubmit} >
        <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter Full Name" value={formState.name} 
            onChange={fieldChange}/>
            <Form.Text className="text-muted">
            {errors.name.length > 0 ? (<p style={{color : 'red'}} >{errors.name}</p>) : null}
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter email" value={formState.email}
            onChange={fieldChange}/>
            <Form.Text className="text-muted">
            {errors.email.length > 0 ? (<p style={{color : 'red'}} >{errors.email}</p>) : null}
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="Password" value={formState.password}
            onChange={fieldChange}/>
            <Form.Text className="text-muted">
            {errors.password.length > 0 ? (<p style={{color : 'red'}} >{errors.password}</p>) : null}
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="ControlSelect1">
            <Form.Label>Select Role</Form.Label>
            <Form.Control as="select" name="role" onChange={fieldChange} value={formState.role}>
            <option></option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
            </Form.Control>
            <Form.Text className="text-muted">
            {errors.role.length > 0 ? (<p style={{color : 'red'}} >{errors.role}</p>) : null}
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control type="text" name="country" placeholder="Enter country" value={formState.country}
            onChange={fieldChange}/>
            <Form.Text className="text-muted">
            {errors.country.length > 0 ? (<p style={{color : 'red'}} >{errors.country}</p>) : null}
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Birthday</Form.Label>
            <Form.Control type="date" name="birthday" placeholder="Enter birthday" value={formState.birthday}
            onChange={fieldChange}/>
            <Form.Text className="text-muted">
            {errors.birthday.length > 0 ? (<p style={{color : 'red'}} >{errors.birthday}</p>) : null}
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" name="terms" label="Terms and Conditions" checked={formState.terms}
            onChange={fieldChange}/>
            <Form.Text className="text-muted">
            {errors.terms.length > 0 ? (<p style={{color : 'red'}} >{errors.terms}</p>) : null}
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox1">
            <Form.Check type="checkbox" name="news" label="Send Email about latest News" checked={formState.news}
            onChange={fieldChange}/>
            <Form.Text className="text-muted">
            {errors.news.length > 0 ? (<p style={{color : 'red'}} >{errors.news}</p>) : null}
            </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={disabled}>
            Submit
        </Button>
        {users.map( user => {
        return (
        <React.Fragment key={user.createdAt}>
        <Form.Group className="mb-3" controlId="formBasicResponse">
                <Form.Text className="text-muted" style={{marginTop: '3px'}}>
                {JSON.stringify(user, null, 5)}
                </Form.Text>
        </Form.Group>
        </React.Fragment>
        )
        })}
        </Form>
        </div>
    );
}

export default FormGroup;