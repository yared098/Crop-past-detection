// import React, { useState } from 'react';
// import adminLayout from '../hoc/adminLayout'; 

// class Settings extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             name: '',
//             email: '',
//             password: ''
//         };
//     }

//     handleSave = (e) => {
//         e.preventDefault();
//         // Handle save logic here, such as updating user settings in the database
//         console.log('Settings saved:', this.state);
//     };

//     handleChange = (e) => {
//         this.setState({ [e.target.id]: e.target.value });
//     };

//     render() {
//         const { name, email, password } = this.state;

//         return (
//             <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
//                 <h2>Settings</h2>
//                 <form onSubmit={this.handleSave}>
//                     <div className="mb-3">
//                         <label htmlFor="name" className="form-label">Name</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="name"
//                             value={name}
//                             onChange={this.handleChange}
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="email" className="form-label">Email</label>
//                         <input
//                             type="email"
//                             className="form-control"
//                             id="email"
//                             value={email}
//                             onChange={this.handleChange}
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="password" className="form-label">Password</label>
//                         <input
//                             type="password"
//                             className="form-control"
//                             id="password"
//                             value={password}
//                             onChange={this.handleChange}
//                         />
//                     </div>
//                     <button type="submit" className="btn btn-primary">Save</button>
//                 </form>
//             </div>
//         );
//     }
// }

// export default adminLayout(Settings);
