/* eslint-disable no-undef */
require("dotenv").config();
const { JWT_SECRET } = process.env;
const { random }=require("../util/random");
const jwt = require("jsonwebtoken");
const { assert,requester }=require("./setUp");



describe("Test signUp",function(){
    
    it("signUp success",async function(){
        let randomNum=random(1,9999999999);
        let name=JSON.stringify(randomNum);
        let password=JSON.stringify(randomNum);
        let email=JSON.stringify(randomNum)+"@hotmail.com";
        const user={
            name,email,password
        };


        const res=await requester.post("/api/1.0/signup").send(user);
        const result=res.body.message;
        const token=res.body.token;
        assert.isString(result);
        assert.equal("signup success",result);

        assert.isString(token);

    });


    it("signUp email exists",async function(){
        const user = {
            name:"testUser",
            email:"testUser@hotmail.com",
            password:"testUserPassword"
        };

        const res=await requester.post("/api/1.0/signup").send(user);
        const result=res.body.message;

        assert.isString(result);
        assert.equal("Email already exists", result);
    });


    it("Confirm whether the email is duplicated",async function(){
        const user ={
            name:"testUser",
            email:"testUser@hotmail.com",
            password:"testUserPassword"
        };
    
        const res=await requester.post("/api/1.0/signup").send(user);
        const result=res.body.message;


        assert.isString(result);
        assert.equal("Email already exists", result);
    });


    it("Enter wront name format",async function(){
        const user={
            name:"",
            email:"testUser@hotmail.com",
            password:"testUserPassword"
        };
        
        const res=await requester.post("/api/1.0/signup").send(user);
        const result=res.body.message;

        assert.isString(result);
        assert.equal("Please enter the correct format", result);
    });

    it("Enter wront email format",async function(){
        const user ={
            name:"testUser",
            email:"testUser",
            password:"testUserPassword"
        };
        
        const res=await requester.post("/api/1.0/signup").send(user);
        const result=res.body.message;

        assert.isString(result);
        assert.equal("Please enter the correct email format", result); 
    });

    it("Enter wront password format",async function(){
        const user ={
            name:"testUser",
            email:"testUser@hotmail.com",
            password:""
        };
        
        const res=await requester.post("/api/1.0/signup").send(user);
        const result=res.body.message;

        assert.isString(result);
        assert.equal("Please enter the correct format", result);
    });
});

describe("Test signin",function(){
    it("Enter wront password format",async function(){
        const user={
            password:"",
            email:"testUser@hotmail.com"
        };
        const res=await requester.post("/api/1.0/signin").send(user);
        const result=res.body.message;

        assert.isString(result);
        assert.equal("Please enter the correct format", result);
    });

    it ("Enter wront email format",async function(){
        const user={
            password:"testUserPassword",
            email:""
        };

        const res=await requester.post("/api/1.0/signin").send(user);
        const result=res.body.message;
        assert.isString(result);
        assert.equal("Please enter the correct format", result);
    });
    
    it("Enter wront email",async function(){
        const user={
            password:"testUserPassword",
            email:"1234"
        };
        const res=await requester.post("/api/1.0/signin").send(user);
        const result=res.body.message;
        assert.isString(result);
        assert.equal("Please enter correct Email or password", result);
    });

    it ("Enter wront password",async function(){
        const user={
            password:"1234",
            email:"testUser@hotmail.com"
        };

        const res=await requester.post("/api/1.0/signin").send(user);
        const result=res.body.message;
        assert.isString(result);
        assert.equal("Please enter correct Email or password", result);

    });

    it("Sign success",async function(){
        const user ={
            email:"testUser@hotmail.com",
            password:"testUserPassword"
        };
        const res=await requester.post("/api/1.0/signin").send(user);
        const result=res.body.message;
        const token=res.body.token;

        assert.isString(token);

        assert.isString(result);
        assert.equal("Signin success",result);
    });

});

describe("Test check token",async function(){
    it ("Check tokne is ok",async function(){
        const user ={
            name:"testUser",
            email:"testUser@hotmail.com",
            password:"testUserPassword"
        };
        const encrypt = jwt.sign(user,JWT_SECRET,{expiresIn:"1 day"});
        const token="bearer "+encrypt;
        const res=await requester.post("/api/1.0/checkUserToken").set("Authorization",token).send(token);
        const result = res.body.Token;
        
        assert.equal("user is OK , aleard signin",result);
        assert.isString(result);
    });

    it ("Check token faile",async function(){
        const res=await requester.post("/api/1.0/checkUserToken").send();
        const result = await res.body.message;
        
        assert.isString(result);
        assert.equal("Pleast signin first", result);
    });
    
    it ("Fake token",async function(){
        const user={};
        const encrypt = jwt.sign(user,"123",{expiresIn:"1 day"});
        const token="bearer "+encrypt;
        const res=await requester.post("/api/1.0/checkUserToken").set("Authorization",token).send(token);
        const result = res.body.message;
        assert.isString(result);
        assert.equal("Pleast signin first", result);
    });
});