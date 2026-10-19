import { API_Config } from "../Config/Api-config";

export const AuthService = {

  RegisterService: function (registerDataParam) {
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.REGISTER}`;
    console.log("=========== url ==========");
    console.log(url);

    const formData = new FormData();
    formData.append("name", registerDataParam.name);
    formData.append("email", registerDataParam.email);
    formData.append("phone", registerDataParam.phone);
    if (registerDataParam.image) {
      formData.append("image", registerDataParam.image);
    }

    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",

      },
      body: formData,
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((serverError) => {
          console.log( "serverr error", serverError)
         const error = new Error(serverError.message || "There was an error creating the account");
           error.errors = serverError.errors || {};
              throw error;
            });
      }
      return res.json();
    });
  },

  LoginService: function (phoneParam) {
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.LOGIN}`;
    console.log("=========== url ==========");
    console.log(url);

    const formData = new FormData();
    formData.append("phone", phoneParam);

    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((serverError) => {
          const error = new Error(serverError.message || "هنالك خطأ في تسجيل الدخول");
          error.errors = serverError.errors || {};
          throw error;
        });
      }
      return res.json();
    });
  },

  VerifyService: function (phoneParam, codeParam) {
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.VERIFY}`;
    console.log("=========== url ==========");
    console.log(url);

    const formData = new FormData();
    formData.append("phone", phoneParam);
    formData.append("otp", codeParam);

    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((serverError) => {
          const error = new Error(serverError.message || "الكود غير صحيح")
          error.errors = serverError.errors || {};
          throw error;
        });
      }
      return res.json();
    });
  },

  ResendService: function (phoneParam) {
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.RESEND}`;
    console.log("=========== url ==========");
    console.log(url);

    const formData = new FormData();
    formData.append("phone", phoneParam);

    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((serverError) => {
          const error = new Error(serverError.message || "ما قدرنا نبعت الكود من جديد");
          error.errors = serverError.errors || {};
          throw error;
        });
      }
      return res.json();
    });
  },
};