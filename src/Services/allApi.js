import { commonApi } from "../Services/commonApi";
import { server_url } from "../Services/server_Url";


// login section==========///

// Login API
export const LoginAPI = async (user) => {
    return await commonApi("POST", `${server_url}/login`, user, "");
  };
  
  
  // Get Current User API
  export const GetUserAPI = async (token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await commonApi("GET",` ${server_url}/me`, "",headers);
  };




  


// addBrongoApi
export const AddBrongoApi = async(reqBody)=>{
    return await commonApi("POST",`${server_url}/AddBrongo`,reqBody,"")
}


// GetBrongoListApi
export const GetBrongoListApi = async(searchKey) => {
  return await commonApi("GET",`${server_url}/getBrongo${searchKey?`?search=${encodeURIComponent(searchKey.trim())}` : ""}`,{},"")
}



// DeleteBrongoApi
export const DeleteBrongoApi = async(id)=>{
    return await commonApi("DELETE",`${server_url}/deleteBrongo/${id}`,{},"")
}



// UpdateBrongoApi
export const UpdateBrongoApi = async (id, reqBody) => {
    return await commonApi("PUT", `${server_url}/updateBrongo/${id}`, reqBody, "");
  }
  