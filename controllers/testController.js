  
  const  testPost = (req, resp)=>{
    const {name} = req.body;
   resp.status(200).send(`My name is ${name}`);
}
module.exports ={
    testPost
}