export const globalMethods = {
    methods: {
      setTokenAndUrlInLocalStorage(response) {
        let token = response.token;
        let url = response.url;
        localStorage.setItem("token", response.token);
        localStorage.setItem("serverUrl", url);
        return token;
      },
  
      getTokenFromLocalStorage() {
        const token = localStorage.getItem("token");
        return token;
      },
  
      getServerUrlFromLocalStorage() {
        const url = localStorage.getItem("serverUrl");
        return url;
      },
  
      removeTokenAndUrlFromLocalStorage() {
        localStorage.removeItem("token");
        localStorage.removeItem("serverUrl");
      },
  
      redirectOnUnAuthorization(response) {
        if (response.status === 401) {
          console.log("Unauthorized, redirecting to login");
          this.removeTokenAndUrlFromLocalStorage();
          this.$router.push("/");
          return;
        }
      } 
    },
  };
  