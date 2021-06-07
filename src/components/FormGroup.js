import React, { useState , useEffect } from "react";
import {Button, Form} from "react-bootstrap";
import "./formGroup.css";
import * as yup from "yup";

const formSchema = yup.object().shape({
    name : yup.string().required("Full Name is required!"),
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    password : yup.string().min("Password should contain more than 7 characters").required("Password is required"),
    terms: yup.boolean().oneOf([true], "Please agree to terms of use"),
});

function FormGroup(){
    const [formState , setFormState] = useState({
        name : "",
        email : "",
        password : "",
        terms : false
    })

    const [errors , setErrors] = useState({
        name : "",
        email : "",
        password : "",
        terms : ""
    })

    const [disabled , setDisabled ] = useState(true);

    useEffect( () => {
        formSchema.isValid(formState).then( (valid) => {
            setDisabled(!valid);
        })
    },[formState]);

    const validateChange = (e) => {
        yup
          .reach(formSchema, e.target.name)
          .validate(e.target.value)
          .then((valid) => {
            setErrors({
              ...errors,
              [e.target.name]: ""
            });
          })
          .catch((err) => {
            setErrors({
              ...errors,
              [e.target.name]: err.errors[0]
            });
          });
      };

    const fieldChange = (e) =>{
        e.persist();
        const newFormData = {
            ...formState , [e.target.name] : e.target.type === "checkbox" ? e.target.checked : e.target.value
        }
        validateChange(e);
        setFormState(newFormData);
    }

    return(
        <div className="mainForm">
        <Form>
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


        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" name="terms" label="Terms and Conditions" checked={formState.terms}
            onChange={fieldChange}/>
            <Form.Text className="text-muted">
            {errors.terms.length > 0 ? (<p style={{color : 'red'}} >{errors.terms}</p>) : null}
            </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={disabled}>
            Submit
        </Button>
        </Form>
        </div>
    );
}

export default FormGroup;