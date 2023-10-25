import * as yup from 'yup';
import { emailRegex, passwordRegex } from '@/constants/regex.constant';

const loginRequestSchema = yup.object().shape({
	username: yup.string().required('username is required'),
	password: yup.string().required('password is required').matches(passwordRegex)
});

const registerRequestSchema = yup.object().shape({
	first_name: yup.string().required('first name is required'),
	last_name: yup.string().required('last name is required'),
	username: yup.string().required('username is required'),
	email: yup.string().email().required('email is required').matches(emailRegex, 'Email is not valid'),
	password: yup.string().required('password is required').matches(passwordRegex, 'Password is not valid'),
	confirmPassword: yup
		.string()
		.required('Confirm Password is required')
		.oneOf([yup.ref('password')], 'Confirming Password must match of Password')
});

export default { registerRequestSchema, loginRequestSchema };


