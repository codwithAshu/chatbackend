// // Connect to the server using Socket.io
// const socket = io();

// let messageArea=document.querySelector('.msg_area')
// let naam;
// let textarea=document.querySelector("#textarea")

// function  initializeChat(){
// do{
//     naam=prompt('please enter ur name')
// }while(!naam) 
//     socket.emit('register', naam);
//     let recipient = prompt("Who do you want to chat with? Enter their name or ID:");

// textarea.addEventListener('keyup',(e)=>{
//     if(e.key ==='Enter'){
//         e.preventDefault(); 
//         sendMessage(e.target.value)
//         e.target.value = '';
//     }
// })



// const sendMessage=(message)=>{
//     console.log("message",message);
//     let msg={
//         user:naam,
//     message :message.trim(),
//     recipient: recipient//tp send specific
//    }
// ////bhejdiya server ko
// socket.emit('sendMessage', msg);
// console.log("sendtoserver",msg);

//    //add msg to appendmsg
//    appendMessage(msg,'outgoing')
// //    socket.emit('message',msg)
   
// }
// ///div bnakar usme user name or uska msg maindiv me daldiya
// const appendMessage=(msg,type)=>{
// let mainDiv=document.createElement('div')
// let  className=type
// mainDiv.classList.add(className,'message')

// let markup=`
// <h4>${msg.user}</h4>
// <p>${msg.message}</p>
// `

// mainDiv.innerHTML=markup

// //send in msg area
// messageArea.appendChild(mainDiv)

// }
// socket.on('sendMessage', (msg) => {
//     console.log('msg',msg);  
//     ////extra
//     if (msg.recipient === naam){
//     appendMessage(msg, 'incoming');
// }
// });

// socket.on('sessionExpired', (message) => {
//     alert(message); 
//     socket.disconnect();

//     setTimeout(() => {
//         initializeChat(); 
//     }, 1000);
// });


// }

// initializeChat()





// //////////////////////////////////////////////////////////////

// // // let dataArr = [{
// // //     subjectID: 1,
// // //     displayID: 'ANT103',
// // //     orderBy: 3
// // //  }, {
// // //     subjectID: 1,
// // //     displayID: 'ANT104',
// // //     orderBy: 4
// // //  },
// // //  {
// // //     subjectID: 1,
// // //     displayID: 'ANT105',
// // //     orderBy: 5
// // //  }, {
// // //     subjectID: 1,
// // //     displayID: 'ANT102',
// // //     orderBy: 2
// // //  }, {
// // //     subjectID: 1,
// // //     displayID: 'ANT101',
// // //     orderBy: 1
// // //  }, {
// // //     subjectID: 2,
// // //     displayID: 'PHY103',
// // //     orderBy: 3
// // //  }, {
// // //     subjectID: 2,
// // //     displayID: 'PHY104',
// // //     orderBy: 4
// // //  }, {
// // //     subjectID: 2,
// // //     displayID: 'PHY105',
// // //     orderBy: 5
// // //  }, {
// // //     subjectID: 2,
// // //     displayID: 'PHY102',
// // //     orderBy: 2
// // //  }, {
// // //     subjectID: 2,
// // //     displayID: 'PHY101',
// // //     orderBy: 1
// // //  }
// // // ]
// // // console.log(dataArr.length);
// // // let sortedData = dataArr.sort((a, b) => a.orderBy - b.orderBy);
// // // console.log('sortdata',sortedData);
// // // let outPut = [];
// // // for (let i = 0; i < sortedData.length; i++) {
// // // let item =sortedData[i]
// // // console.log('irt',item);
// // //  let isFree = i < 3 ? 1 : 0;
// // //  outPut.push({ ...item, isFree });
// // // }
// // // console.log(outPut);



// // // const clickme=document.getElementById('clickme')
// // // const donotclickme=document.getElementById('donotclickme')
// // // const ok=document.getElementById('ok')
// // // const notok=document.getElementById('notok')

// // // const worker=new Worker('worker.js')

// // // // Listen for messages from the worker (result from computation)
// // // worker.onmessage = function (e) {
// // //     const result = e.data;
// // //     console.log("e.data",e.data);
// // //    console.log("result",result);
// // //     ok.innerHTML = `Computation finished: ${result}`;
// // //   };

// // // clickme.addEventListener('click',()=>{
// // //     // Send message to the worker to start the task
// // //   worker.postMessage('start computation');
// // //     // let i ;
// // //     // for(i=1;i<1000000000;i++){}
// // //     // ok.innerHTML=i
// // //     // console.log('i',i);
// // // })
// // // donotclickme.addEventListener('click',()=>{
// // //     notok.innerHTML='second was clicked'
// // // })
// ////////////////////////////////
// // function getuser(a){
// //     setTimeout(()=>{
// // a("userdata");
// //     },2000)}

// // function getuser2(b){
// // setTimeout(() => {
// //     b("userdata2")
// // }, 2000);
// // }
//     //they both are print immigetly
// // getuser((res)=>{
// // console.log(res);
// // })
// // getuser2((res)=>{
// //     console.log(res);
// //     })

//     ////////////////////////////
// // function getUserData() {
// //     return new Promise((resolve, reject) => {
// //       setTimeout(() => {
// //         resolve("User Data");
// //       }, 1000);
// //     });
// //   }
// //   function getUserPosts() {
// //     return new Promise((resolve, reject) => {
// //       setTimeout(() => {
// //         resolve("User Posts");
// //       }, 1000);
// //     });
// // }
// //   getUserData()
// //     .then((result) => {
// //         console.log(result);
// //       return getUserPosts();
// //     })
// //     .then((result) => {
// //       console.log(result);
// //     });


// /////////////////////////////
// //   function adata(){
// //     return new Promise((resolve, reject) => {
// //         setTimeout(() => {
// //         resolve("adata")
// //         }, 2000);
// //     })}
   
// //     function adata2(){
// //         return new Promise((resolve, reject) => {
// //             setTimeout(() => {
// //                 resolve("adata2")
// //             }, 2000);
// //         })
// //     }
// // async function fetchdata() {try{
// //     const userdata=await adata()
// //     console.log(userdata);
// //     const userdata2=await adata2()
// //     console.log(userdata2)}
// //     catch(err){
// //   console.log("err",err);
  
// //     }
// // }
// // fetchdata()