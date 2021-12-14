module.exports = (on, config) => {
    on("before:browser:launch", (browser = {}, args) => {
        console.log("Cypress plugin fired.")
    });
  };