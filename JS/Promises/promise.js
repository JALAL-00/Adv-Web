import { check } from "./import_export_practice.js"
console.log("First line executed");
const prom=new Promise((resolve,reject)=>{

   let sum=2;
   if(check(sum))
   {
    resolve("Its an even number");
   }
   else if(check(sum)==false){
    resolve("Its a odd number");
   }
   else{
    reject("Error occurs");
   }



})
prom.then((message)=>console.log(message));
prom.catch((message)=>console.log(message));
console.log("Last line executed");