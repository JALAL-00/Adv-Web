function asyncFun(){
    return new Promise((resolve,reject)=>{
    setTimeout(()=>{
    console.log("Hello i am abir");
    resolve("Success");
    },5000)
    
    
    });
 }

 async function fun() {
    console.log("Starting...")
    await asyncFun();
 }
 fun();
 console.log("this line will executed aftere starting...");