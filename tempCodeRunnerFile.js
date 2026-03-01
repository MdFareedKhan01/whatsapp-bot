fetch("https://alfa-leetcode-api.vercel.app/")
.then(res=>res.json())
.then(data=>{
    console.log(data.problems.problemList./problems);
})