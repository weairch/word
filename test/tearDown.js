/* eslint-disable no-undef */
const {requester}=require("./setUp");

after(async () => {
    requester.close();
});