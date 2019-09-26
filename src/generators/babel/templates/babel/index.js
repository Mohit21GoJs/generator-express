import app from "@babel/app";

function setter() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("after 2 secs");
      resolve();
    }, 2000);
  });
}
async function boot() {
  await setter();
  console.log(app());
}

boot();