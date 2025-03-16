function asyncFun(){
return new Promise((resolve,reject)=>{
setTimeout(()=>{
console.log("Hello i am abir");
resolve("Success");
},5000)


});
}

function asyncFun1(){
    return new Promise((resolve,reject)=>{
    setTimeout(()=>{
    console.log("Hello i am abir from second fun");
    resolve("Success2");
    },5000)
    
    
    });
    }
console.log("First Promise will execute after this line...");

asyncFun().then((messeage)=>{
    console.log(messeage);
    return asyncFun1();
}).then((message)=>{
 console.log(message);
})

console.log("Second Promise will execute after first promise...but sorry it will executed instantly");