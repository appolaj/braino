import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';
import React,{Component} from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import FaceRecognition from './components/FaceRecognition/FaceRecognition';


const initialState={
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  isSignedIn: false,
  user:{
    id:'',
    name:'',
    email:'',
    entries: 0,
    joined : ''
  }
}
class App extends Component {
  constructor(){
    super()
    this.state = initialState;
      }
  

  loadUser = (user) =>{
    this.setState({
      user:{
      id:user.id,
      name:user.name,
      email:user.email,
      entries: user.entries,
      joined : user.joined
    }})
    
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState(initialState)
    }else if(route === 'home')
    {
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }


  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftcol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row  * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height -(clarifaiFace.bottom_row * height) 
    }
  }

  displayFaceBox= (box) =>{
    this.setState({box:box});
  }

  onInputChange = (event) =>{
    this.setState({input:event.target.value})
  } 


  onButtonSubmit = () =>{

    this.setState({imageUrl:this.state.input});
    fetch('http://localhost:3000/imageurl',{
      method: 'post',
      headers:{'content-Type':'application/json'},
      body: JSON.stringify({
        input:this.state.input,  
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response){
          fetch('http://localhost:3000/image',{
            method: 'put',
            headers:{'content-Type':'application/json'},
            body: JSON.stringify({
              id:this.state.user.id,  
          })
        })
        .then(response => response.json())
        .then(count =>{
          this.setState(Object.assign(this.state.user,{entries:count}))
        })
        .catch(console.log)
      }
        this.displayFaceBox(this.calculateFaceLocation(response))})
      

  }


  render(){
  const particlesInit = async (main) => {
    
    await loadFull(main);
    
  };
  
  return (
    <div className="App ">
        <Particles className='particles' id="particles-here" 
        init={particlesInit} 
        options={{
        
        "particles": {
            "number": {
                "value": 30,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "rotate": {
                "value": 50,
                "random": true,
                "direction": "clockwise",
                "animation": {
                    "enable": true,
                    "speed": 50,
                    "sync": false
                }
            },
            "move": {
                "enable": true,
                "speed": 3,      
            }
        },
        "interactivity": {
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": ["grab"]
                },
                
            },
            "modes": {
                "grab": {
                    "distance": 500,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200
                },
                
                
            }
        },
        "retina_detect": true,
        
    }} />
        
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
      {this.state.route === 'home' 
        ?<>
        <Logo />
        <Rank name={this.state.user.name} 
              entries={this.state.user.entries}/>
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognition 
          box={this.state.box}
           imageUrl={this.state.imageUrl} />
           </>  
        
        
        :(this.state.route === 'signin')
        ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
  }

    </div>
  );
    }
  }


export default App;
