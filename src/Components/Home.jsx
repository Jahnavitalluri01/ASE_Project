import React from "react";

function Home(){
    const backgroundStyle = {
        backgroundImage: `url("https://parkwaylawn.com/wp-content/uploads/2019/03/professional-mowing-lawn-service-1024x552.jpg")`, // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',  // Set your desired height
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'blur(2px)'
      };
      
return(
    <div style={backgroundStyle} className="container-fluid mt-0">
        <p>hhhhh</p>
    {/* <div className="text-white text-center">
      <h1>Welcome to Our Website</h1>
      <p>This content appears over the background image</p>
      <button className="btn btn-primary">Learn More</button>
    </div> */}
  </div>

)
}
export default Home;