import {TextField, Box} from '@mui/material';
import '../App.css';
import {useState} from "react"
import useCustomNavigation from './custom_nav';
import { useForm, Controller } from 'react-hook-form';
function Profile() {
  const [name,setName] = useState("")
  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")
  const navigate = useCustomNavigation()
  const { control, formState: { errors } } = useForm();

  
  // gets results typed by user validates it and POST it to the create_user API 
  const onSub = async (e) =>{
    e.preventDefault();
    const data= {
      email,
      name,
      password
      
    }
    const url = "http://127.0.0.1:5000/create_contact"
    const options ={
      method: "POST",
      headers: {
        "Content-Type" : "application/json; charset=UTF-8"
      },
      body:JSON.stringify(data) 
    }
    
   
    const response = await fetch(url, options);
    if (response.ok) {
      navigate('/');
}
    
  }
  return (
    // validation for each done in the Controller hook
    <div className="profile">
      <h1>PROFILE</h1>
      <form onSubmit={onSub}>
      <div className='buttons_stack'>
      <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '300px', margin: 'auto', mt: 5 }}
      noValidate
    >
      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email address',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            
            variant="outlined"
            fullWidth
            value={email} onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
        )}
        />
        <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{
          required: 'Name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters long',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name} onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
          />
        )}
      />
      
      <Controller
        name="password"
        control={control}
        defaultValue=""
        rules={{
          required: 'password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
         
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            type="password"
            variant="outlined"
            value={field.value}
            onChange={(e) => {
              field.onChange(e); // Update form
              setPassword(e.target.value); // Optionally update local state if needed
            }}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
          />
        )}
      />

      <button type='submit'>Create profile</button>
      </Box>
      </div>
      
      </form>
    </div>
  );
}

export default Profile;